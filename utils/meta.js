const { getMovieById } = require("./tmdbApi");
const { safeImage } = require("./helpers");

async function getMovieMeta(tmdbId, originalId) {
  const response = await getMovieById(tmdbId, {
    append_to_response: "credits",
  });
  const movie = response.data;
  const cast =
    movie.credits && movie.credits.cast
      ? movie.credits.cast.slice(0, 5).map((m) => m.name)
      : [];
  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";
  return {
    meta: {
      id: originalId || (movie.imdb_id ? movie.imdb_id : `tmdb_${movie.id}`),
      imdb_id: movie.imdb_id || undefined,
      type: "movie",
      name: movie.title,
      poster: safeImage(movie.poster_path) || safeImage(movie.backdrop_path),
      description: movie.overview,
      releaseInfo: releaseYear,
      genres: (movie.genres || []).map((g) => g.name),
      background: safeImage(movie.backdrop_path),
      cast,
      links: [
        {
          name: "actor",
          type: "text",
          url: "",
          description: `Cast: ${cast.join(", ")}`,
        },
      ],
    },
  };
}

module.exports = {
  getMovieMeta,
};
