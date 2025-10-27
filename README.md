# Stremio South Indian Content Addon
This project is a Stremio addon that provides a catalog of South Indian content, including movies and TV shows (work in progress) in Tamil, Malayalam, and Telugu languages. The addon fetches data from The Movie Database (TMDB) API and presents it in a user-friendly format for Stremio users.

**Still in development. Configuration page coming soon + other improvements**
## Features
- Browse South Indian movies and TV shows by genre.
- Fetches data from TMDB API for up-to-date content.
- Supports multiple South Indian languages: Tamil, Malayalam and Telugu.
- Easy to install and use within Stremio.
- Lightweight and efficient.
- Customizable via environment variables.
- Open-source and community-driven.
  
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
6. Add the addon to Stremio using the local server URL (e.g., `http://localhost:port`).
7. Enjoy browsing South Indian content on Stremio!
## Configuration
You can configure the addon using environment variables in the `.env` file:
 - `TMDB_API_KEY`: Your TMDB API key for fetching content.
## Contributing
 Contributions are welcome! If you have any ideas, bug fixes, or improvements, feel free to open an issue or submit a pull request.
