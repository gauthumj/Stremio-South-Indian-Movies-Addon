const { addonBuilder } = require("stremio-addon-sdk");
const { discoverMovies, searchMovies } = require("./utils/tmdbApi");
const { getMovieMeta } = require("./utils/meta");
const {
  TMDB_IMAGE_BASE_URL,
  TMDB_BASE_URL,
  languagesMap,
} = require("./utils/constants");
const { genreMap, getTmdbGenre } = require("./utils/genres");
const { toMetaFromTmdbMovie, safeImage } = require("./utils/helpers");
// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md

// Constants and helpers have been moved to utils/constants.js and other utils

// genreMap moved to utils/genres.js
// Add a small white-list of genres for the addon UI (keeps the manifest simple)
const whiteListGenres = [
  "New",
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Crime",
];

// genreMap is provided by ./utils/genres.js

const manifest = {
  id: "community.South",
  version: "1.0.0",
  catalogs: [
    {
      type: "movie",
      id: "tmdb_popular_tamil",
      name: "Tamil Movies",
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", options: whiteListGenres },
        { name: "skip" },
      ],
    },
    {
      type: "movie",
      id: "tmdb_popular_telugu",
      name: "Telugu Movies",
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", options: whiteListGenres },
        { name: "skip" },
      ],
    },
    {
      type: "movie",
      id: "tmdb_popular_malayalam",
      name: "Malayalam Movies",
      extra: [
        { name: "search", isRequired: false },
        { name: "genre", options: whiteListGenres },
        { name: "skip" },
      ],
    },
    // Add more catalogs for different languages if needed
  ],
  idPrefixes: ["tmdb_", "tt"],
  resources: ["catalog", "meta"],
  types: ["movie"],
  name: "South Indian Content",
  description:
    "Catalog for south indian content. Includes the following languages - Tamil, Malayalam, Telugu and Kannada.",
};
const builder = new addonBuilder(manifest);

async function getTmdbCatalog(languageCode, page = 1, genre = "Top") {
  // Initialize parameters with defaults
  const params = {
    with_original_language: languageCode,
    with_release_date_lte: new Date().toISOString().split("T")[0],
    with_release_type: "2|3", // Theatrical and Digital releases
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
    const response = await discoverMovies(params);
    const tmdbMovies = response.data.results || [];
    const metas = tmdbMovies
      .map((movie) => toMetaFromTmdbMovie(movie))
      .filter(Boolean);
    return { metas };
  } catch (error) {
    console.error("Error fetching TMDB catalog:", error.message || error);
    if (error.response) {
      console.error("TMDB Response Data:", error.response.data);
    }
    return { metas: [] };
  }
}

// Helper function for search
async function searchTmdbMovies(languageCode, query, page = 1) {
  try {
    const response = await searchMovies({
      query,
      with_original_language: languageCode,
      page,
    });
    const tmdbMovies = response.data.results || [];
    const metas = tmdbMovies
      .map((movie) => {
        if (movie.original_language !== languageCode) return null;
        return toMetaFromTmdbMovie(movie);
      })
      .filter(Boolean);
    return { metas };
  } catch (error) {
    console.error("Error searching TMDB movies:", error.message || error);
    return { metas: [] };
  }
}

// Handler for the catalog
builder.defineCatalogHandler(async (args) => {
  const { id, extra } = args;
  // Get the genre filter, defaulting to "Top" if not provided
  const genre = (extra && extra.genre) || "Top";
  const page = extra && extra.skip ? Math.floor(extra.skip / 20) + 1 : 1;

  const language = id.replace("tmdb_popular_", "").toLowerCase();
  const languageCode = languagesMap[language];
  // console.log("Language code for catalog:", languageCode);

  if (!languageCode) {
    return Promise.reject(new Error("Invalid catalog ID"));
  }
  if (args.extra && args.extra.search) {
    return searchTmdbMovies(languageCode, args.extra.search, page);
  } else {
    return getTmdbCatalog(languageCode, page, genre);
  }
});

// getMovieMeta is now implemented in utils/meta.js and imported at the top

// A meta handler is not strictly needed for this type of addon, but including a basic one is good practice
builder.defineMetaHandler(async (args) => {
  const tmdbId = args.id.replace("tmdb_", "");
  return getMovieMeta(tmdbId, args.id);
});

// We use the getTmdbGenre helper in utils/genres.js; this file keeps a reference
module.exports = builder.getInterface();
