const { TMDB_IMAGE_BASE_URL } = require("./constants");
const { getTmdbGenre } = require("./genres");

function safeImage(path) {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

function toMetaFromTmdbMovie(movie) {
  const poster = safeImage(movie.poster_path) || safeImage(movie.backdrop_path);
  const genres = (movie.genre_ids || movie.genres || []).map((g) => {
    // If g is number, map via getTmdbGenre, else if object, return name
    if (typeof g === "number") return getTmdbGenre(g);
    if (g && g.name) return g.name;
    return "Unknown";
  });

  return {
    id: `tmdb_${movie.id}`,
    imdb_id: movie.imdb_id || undefined,
    type: "movie",
    name: movie.title,
    poster,
    posterShape: "poster",
    description: movie.overview,
    releaseInfo: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
    genres,
  };
}

module.exports = {
  safeImage,
  toMetaFromTmdbMovie,
};
