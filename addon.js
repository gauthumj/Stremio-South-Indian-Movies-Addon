const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");
const { fetchTmdbWithRetry } = require("./utils/fetchTmdb");
// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md

// dotenv.config();

const TMDB_BASE_URL = "https://api.themoviedb.org/";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// console.log(TMDB_API_KEY);

// Define the TMDB language codes for South Indian languages
const southIndianLanguages = [
  "te", // Telugu
  "ta", // Tamil
  "ml", // Malayalam
  "kn", // Kannada
];

const languagesMap = {
  telugu: "te",
  tamil: "ta",
  malayalam: "ml",
  kannada: "kn",
};

const genreMap = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  Horror: 27,
  Mystery: 9648,
  Romance: 10749,
  "Science Fiction": 878,
  Thriller: 53,
};

const manifest = {
  id: "community.South",
  version: "0.0.1",
  catalogs: [
    {
      type: "movie",
      id: "tmdb_popular_tamil",
      name: "Tamil Movies",
      extra: [
        {
          name: "genre",
          options: ["New", "Action", "Comedy", "Drama", "Thriller", "Crime"],
        },
        { name: "skip" },
      ],
    },
    {
      type: "movie",
      id: "tmdb_popular_telugu",
      name: "Telugu Movies",
      extra: [
        {
          name: "genre",
          options: ["New", "Action", "Comedy", "Drama", "Thriller", "Crime"],
        },
        { name: "skip" },
      ],
    },
    {
      type: "movie",
      id: "tmdb_popular_malayalam",
      name: "Malayalam Movies",
      extra: [
        {
          name: "genre",
          options: ["New", "Action", "Comedy", "Drama", "Thriller", "Crime"],
        },
        { name: "skip" },
      ],
    },
    // Add more catalogs for different languages if needed
  ],
  idPrefixes: ["tmdb_", "tt"],
  resources: ["catalog", "meta"],
  types: ["movie", "series"],
  name: "South Indian Content",
  description:
    "Catalog for south indian content. Includes the following languages - Tamil, Malayalam, Telugu and Kannada.",
};
const builder = new addonBuilder(manifest);

async function getTmdbCatalog(languageCode, page = 1, genre = "Top") {
  const tmdbUrl = `${TMDB_BASE_URL}/3/discover/movie`;

  // Initialize parameters with defaults
  const params = {
    with_original_language: languageCode,
    page: page,
  };

  // Logic to handle the genre/filter selection
  const tmdbGenreId = genreMap[genre];

  if (tmdbGenreId) {
    params.sort_by = "primary_release_date.desc"; // Default sorting for genre lists
    params.with_genres = tmdbGenreId;
  } else if (genre === "New") {
    // Sort by release date for "New" content
    params.sort_by = "primary_release_date.desc";
    params["primary_release_date.lte"] = new Date().toISOString().split("T")[0]; // Only show released films
  } else {
    // Sort by popularity for "Top" content (default)
    params.sort_by = "popularity.desc";
  }

  try {
    // Step 1: Get the list of movies
    const response = await fetchTmdbWithRetry(tmdbUrl, params);

    const tmdbMovies = response.data.results;
    const metas = tmdbMovies.map((movie) => {
      return {
        id: `tmdb_${movie.id}`,
        imdb_id: undefined, // Leaving this as undefined to avoid rate limiting
        type: "movie",
        name: movie.title,
        poster: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        posterShape: "poster",
        description: movie.overview,
        releaseInfo: movie.release_date
          ? movie.release_date.split("-")[0]
          : "N/A",
        genres: movie.genre_ids.map((id) => getTmdbGenre(id)),
      };
    });

    return { metas };
  } catch (error) {
    console.error("Error fetching TMDB catalog:", error.message);
    // Log the full error to see what TMDB returned (e.g., 401 Unauthorized)
    if (error.response) {
      console.error("TMDB Response Data:", error.response.data);
    }
    return { metas: [] };
  }
}

// Handler for the catalog
builder.defineCatalogHandler(async (args) => {
  const { id, extra } = args;
  // Get the genre filter, defaulting to "Top" if not provided
  const genre = extra.genre || "Top";
  const page = extra.skip ? Math.floor(extra.skip / 20) + 1 : 1;

  const languageCode = languagesMap[id.replace("tmdb_popular_", "")];

  if (!languageCode) {
    return Promise.reject(new Error("Invalid catalog ID"));
  }

  // Pass the new genre parameter
  return getTmdbCatalog(languageCode, page, genre);
});

// A meta handler is not strictly needed for this type of addon, but including a basic one is good practice
builder.defineMetaHandler(async (args) => {
  const tmdbId = args.id.replace("tmdb_", "");
  const movieUrl = `${TMDB_BASE_URL}/3/movie/${tmdbId}`;
  try {
    const response = await fetchTmdbWithRetry(movieUrl);
    const movie = response.data;
    const releaseYear = movie.release_date
      ? movie.release_date.split("-")[0]
      : "N/A";

    console.log("Fetched movie meta:", movie);

    return {
      meta: {
        // id: args.id,
        id: movie.imdb_id ? movie.imdb_id : `tmdb_${movie.id}`,
        imdb_id: movie.imdb_id,
        type: "movie",
        name: movie.title,
        poster: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        description: movie.overview,
        releaseInfo: releaseYear,
        genres: movie.genres.map((g) => g.name),
        background: `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`,

        // Other meta properties
      },
    };
  } catch (error) {
    console.error("Error fetching movie meta:", error.message);
    return Promise.reject(new Error("Movie not found"));
  }
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fallback for genres
function getTmdbGenre(genreId) {
  // TMDB has a genre list endpoint you can call, but for simplicity, we can
  // create a static map.
  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  return genres[genreId] || "Unknown";
}
module.exports = builder.getInterface();
