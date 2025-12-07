jest.mock("../utils/tmdbApi", () => ({
  getMovieById: jest.fn(),
}));

const { getMovieById } = require("../utils/tmdbApi");
const { getMovieMeta } = require("../utils/meta");

describe("meta util", () => {
  test("getMovieMeta maps movie response to Stremio meta", async () => {
    const fakeMovie = {
      id: 100,
      title: "Meta Test Movie",
      overview: "Overview",
      poster_path: "/p.jpg",
      backdrop_path: "/b.jpg",
      release_date: "2020-05-12",
      imdb_id: "tt1234567",
      genres: [{ id: 28, name: "Action" }],
      credits: { cast: [{ name: "Actor One" }, { name: "Actor Two" }] },
    };
    getMovieById.mockResolvedValue({ data: fakeMovie });
    const result = await getMovieMeta("100", "tmdb_100");
    expect(result.meta.id).toBe("tt1234567");
    expect(result.meta.name).toBe("Meta Test Movie");
    expect(result.meta.imdb_id).toBe("tt1234567");
    expect(result.meta.cast).toEqual(["Actor One", "Actor Two"]);
    expect(result.meta.genres).toEqual(["Action"]);
  });
});
