const axios = require("axios");
// Load environment variables using dotenv instead of a nonstandard process API
require("dotenv").config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * A utility function to pause execution for a given number of milliseconds.
 * @param {number} ms - The delay in milliseconds.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetches data from TMDB, automatically including the API key, with retry logic.
 * @param {string} url - The full URL endpoint (e.g., `${TMDB_BASE_URL}/discover/movie`).
 * @param {object} params - Additional query parameters for the request.
 * @param {number} maxRetries - Maximum number of times to retry the request (default: 3).
 * @param {number} delayMs - Delay in milliseconds between retries (default: 1000).
 * @returns {Promise<any>} The response data from TMDB.
 */
async function fetchTmdbWithRetry(
  url,
  params = {},
  maxRetries = 5,
  delayMs = 2000
) {
  // 1. Inject the hardcoded API key and set English language for consistent meta data

  for (let i = 0; i < maxRetries; i++) {
    try {
      // 2. Make the request with the combined parameters
      const response = await axios.get(url, {
        params: params,
        headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      });
      return response; // Return response on success
    } catch (error) {
      const isFinalAttempt = i === maxRetries - 1;

      const status = error.response ? error.response.status : "Network Error";

      if (isFinalAttempt) {
        console.error(
          `TMDB Request failed after ${maxRetries} attempts. Last error: Status ${status}, Message: ${error.message}`
        );
        throw error;
      }

      console.warn(
        `TMDB Request failed (Status: ${status}). Retrying in ${delayMs}ms... (Attempt ${
          i + 1
        }/${maxRetries})`
      );
      await sleep(delayMs);
      delayMs *= 1.5; // Exponential backoff
    }
  }
}
module.exports = {
  fetchTmdbWithRetry,
};
