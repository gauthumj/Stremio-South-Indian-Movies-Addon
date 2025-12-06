const { toMetaFromTmdbMovie, safeImage } = require("../utils/helpers");

describe("helpers", () => {
  test("safeImage returns undefined for falsy path", () => {
    expect(safeImage(null)).toBeUndefined();
    expect(safeImage(undefined)).toBeUndefined();
  });

  test("toMetaFromTmdbMovie maps fields correctly", () => {
    const movie = {
      id: 12345,
      title: "Sample Movie",
      overview: "This is a sample movie",
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      release_date: "2023-01-23",
      genre_ids: [28, 35],
    };
    const meta = toMetaFromTmdbMovie(movie);
    expect(meta.id).toBe("tmdb_12345");
    expect(meta.name).toBe("Sample Movie");
    expect(meta.description).toBe("This is a sample movie");
    expect(meta.poster).toBeDefined();
    expect(meta.releaseInfo).toBe("2023");
    expect(Array.isArray(meta.genres)).toBe(true);
  });
});
