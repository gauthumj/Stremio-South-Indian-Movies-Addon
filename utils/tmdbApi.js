const { fetchTmdbWithRetry } = require("./fetchTmdb");
const { TMDB_BASE_URL } = require("./constants");
const logger = require("./logger");

function buildUrl(path) {
  // Ensure the path doesn't double slash
  return `${TMDB_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function discoverMovies(params) {
  const url = buildUrl(`/3/discover/movie`);
  logger.debug("Discover movies request", { url, params });
  return fetchTmdbWithRetry(url, params);
}

async function searchMovies(params) {
  const url = buildUrl(`/3/search/movie`);
  logger.debug("Search movies request", { url, params });
  return fetchTmdbWithRetry(url, params);
}

async function getMovieById(tmdbId, params = {}) {
  const url = buildUrl(`/3/movie/${tmdbId}`);
  logger.debug("Get movie by id request", { url, params });
  return fetchTmdbWithRetry(url, params);
}

module.exports = {
  discoverMovies,
  searchMovies,
  getMovieById,
};
