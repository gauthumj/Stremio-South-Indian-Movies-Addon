const { getMovieById } = require("./tmdbApi");
const { safeImage } = require("./helpers");
const logger = require("./logger");

async function getMovieMeta(tmdbId, originalId, apiKey) {
  logger.info("Fetching movie meta", { tmdbId, originalId });
  const response = await getMovieById(tmdbId, apiKey, {
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
  // Summarize fetched response for debugging (avoid large/secret logs)
  logger.debug("TMDB response summary", {
    status: response && response.status,
    tmdbId: movie && movie.id,
    title: movie && movie.title,
    imdb_id: movie && movie.imdb_id,
    release_date: movie && movie.release_date,
    genres_count: movie && movie.genres && movie.genres.length,
    credits_count:
      movie && movie.credits && movie.credits.cast
        ? movie.credits.cast.length
        : 0,
  });

  const metaObj = {
    meta: {
      id: (movie.imdb_id ? movie.imdb_id : `tmdb_${movie.id}`) || originalId,
      imdb_id: movie.imdb_id || undefined,
      type: "movie",
      name: movie.title,
      poster: safeImage(movie.poster_path) || safeImage(movie.backdrop_path),
      description: movie.overview,
      releaseInfo: releaseYear,
      genres: (movie.genres || []).map((g) => g.name),
      background: safeImage(movie.backdrop_path),
      cast: cast,
      // links: [
      //   {
      //     name: "actor",
      //     type: "text",
      //     url: "",
      //     description: `Cast: ${cast.join(", ")}`,
      //   },
      // ],
    },
  };

  logger.info("Returning movie meta summary", {
    id: metaObj.meta.id,
    name: metaObj.meta.name,
    imdb_id: metaObj.meta.imdb_id,
    poster: !!metaObj.meta.poster,
    background: !!metaObj.meta.background,
    genres_count: metaObj.meta.genres.length,
    cast_count: metaObj.meta.cast.length,
  });

  return metaObj;
}

module.exports = {
  getMovieMeta,
};
