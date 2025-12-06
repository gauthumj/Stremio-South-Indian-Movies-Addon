const { genreMap, getTmdbGenre } = require("../utils/genres");

describe("genres util", () => {
  test("genreMap contains Action and Comedy", () => {
    expect(genreMap.Action).toBe(28);
    expect(genreMap.Comedy).toBe(35);
  });

  test("getTmdbGenre returns known names and Unknown for missing genres", () => {
    expect(getTmdbGenre(28)).toBe("Action");
    expect(getTmdbGenre(999999)).toBe("Unknown");
  });
});
