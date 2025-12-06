const { fetchTmdbWithRetry } = require("./fetchTmdb");
const { TMDB_BASE_URL } = require("./constants");

function buildUrl(path) {
  // Ensure the path doesn't double slash
  return `${TMDB_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function discoverMovies(params) {
  const url = buildUrl(`/3/discover/movie`);
  return fetchTmdbWithRetry(url, params);
}

async function searchMovies(params) {
  const url = buildUrl(`/3/search/movie`);
  return fetchTmdbWithRetry(url, params);
}

async function getMovieById(tmdbId, params = {}) {
  const url = buildUrl(`/3/movie/${tmdbId}`);
  return fetchTmdbWithRetry(url, params);
}

module.exports = {
  discoverMovies,
  searchMovies,
  getMovieById,
};
