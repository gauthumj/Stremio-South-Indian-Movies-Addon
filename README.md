# Stremio South Indian Content Addon
This project is a Stremio addon that provides a catalog of South Indian content, including movies and TV shows (work in progress) in Tamil, Malayalam, and Telugu languages. The addon fetches data from The Movie Database (TMDB) API and presents it in a user-friendly format for Stremio users.

**Still in development.**

Table of Contents
- [Stremio South Indian Content Addon](#stremio-south-indian-content-addon)
  - [What's new](#whats-new)
  - [Features](#features)
  - [Installation](#installation)
  - [Self-hosting with Docker](#self-hosting-with-docker)
  - [Contributing](#contributing)
  - [Future Improvements](#future-improvements)

## What's new
- Added a web configuration flow (`/configure`) that saves per-install `TMDB_API_KEY` and returns an install link that encodes a token.
- Requests now accept a per-request API key (from `args.config` or the tokenized install).
- Server serves tokenized manifests at `/:token/manifest.json` so configured installs are unique per user.

## Features
- Browse South Indian movies and TV shows by genre.
- Fetches data from TMDB API for up-to-date content.
- Supports multiple South Indian languages: Tamil, Malayalam and Telugu.
- Easy to install and use within Stremio.
- Lightweight and efficient.
- Customizable via environment variables.
- Open-source and community-driven.
- Support for per-install configuration via a web ` /configure ` page and tokenized manifests (install links).
    - Users can provide their own `TMDB_API_KEY` during install; the addon stores the key and serves a tokenized manifest so requests use the per-user key.
  
## Installation
1. Clone the repository:
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your TMDB API key:
   ```env
    TMDB_API_KEY=your_tmdb_api_key_here
    ```
4. Start the addon server:
    ```bash
    npm start
    ```
    For development you can run:

    ```bash
    npm start -- --launch
    ```
    which will open the Stremio web client and pre-install the addon for quick testing.
6. Add the addon to Stremio using the local server URL (e.g., `http://localhost:port`).
7. Enjoy browsing South Indian content on Stremio!
## Configuration
You can configure the addon in two ways:

- Per-install (recommended for user-specific keys): use the built-in configuration page at `http://<host>:<port>/configure`. This lets users provide a `TMDB_API_KEY` and receive a Stremio install link (`stremio://<host>/<token>/manifest.json`) that installs the addon configured for that user.

- Server-wide (shared key): set `TMDB_API_KEY` in a `.env` file or in your environment. This is useful if you want a single key for all installs.

Environment variable example in `.env`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

Notes:
- The SDK shows a "Configure" button in the client when `manifest.behaviorHints.configurable` is set; stremio serves a minimal `/configure` page based on manifest.config. If you want to customize the configuration page, you will need to use express or another web framework to serve your own HTML form at `/configure` - more details in stremio addon docs.
- The SDK shows a "Configure" button in the client when `manifest.behaviorHints.configurable` is set. Stremio may render a simple in-app form based on `manifest.config`, but that does not replace a server-side configure flow — if you want the Configure button to open a web page and create tokenized installs you must implement a `/configure` page and persist the supplied data on the server. See the Stremio docs on "Using User Data in Addons" and "Creating Addon Configuration Pages" for details.
- For per-install configuration the user provides a key via the `/configure` flow; that key is encoded in the install URL (Addon Repository URL) and the addon server must persist and use it. The Stremio client does not act as a secure server-side storage for your API keys.

Note: this repository includes a minimal `/configure` implementation that saves token->key mappings in `user_configs.json` for local testing. For production, replace that with a proper database and secure storage.

If you need the addon to return different behavior for a specific install, implement tokenized manifests (e.g. `/:token/manifest.json`) and mount your addon router under `/:token` so subsequent requests include the token context.
## Self-hosting with Docker
This project includes a `Dockerfile` so you can self-host the addon. Example commands:

Build the image:

```bash
docker build -t stremio-south .
```

Run the container (host port 8000 and set a server-wide TMDB key):

```bash
docker run -d \
    --name stremio-south \
    -p 8000:8000 \
    -e TMDB_API_KEY=your_tmdb_api_key_here \
    stremio-south
```

Notes:
- If you don't provide a global `TMDB_API_KEY`, users can still configure the addon via `/configure` to provide per-install keys.
- When hosting remotely, ensure the manifest URL is served over HTTPS (Stremio requires HTTPS for non-local installs). Here's the video that I used to get SSL for my local home server - [link](https://www.youtube.com/watch?v=qlcVx-k-02E)
## Contributing
 Contributions are welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.
## Future Improvements
- Implement TV show support.
- Display cast and crew information and IMDB ratings when browsing catalogs

