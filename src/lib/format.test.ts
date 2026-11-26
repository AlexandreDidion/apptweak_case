import { formatDuration, formatReleaseDate } from "./format";

describe("formatDuration", () => {
  it("formats milliseconds as m:ss, truncating seconds", () => {
    expect(formatDuration(196_514)).toBe("3:16");
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(0)).toBe("0:00");
  });
});

describe("formatReleaseDate", () => {
  const album = (
    release_date: string,
    release_date_precision: "year" | "month" | "day"
  ): SpotifyApi.AlbumObjectSimplified =>
    ({ release_date, release_date_precision }) as SpotifyApi.AlbumObjectSimplified;

  it("shows only the year when that's all Spotify knows", () => {
    expect(formatReleaseDate(album("1999", "year"))).toBe("1999");
  });

  it("shows month and year, or the full date", () => {
    expect(formatReleaseDate(album("2021-03", "month"))).toMatch(/2021/);
    expect(formatReleaseDate(album("2021-03-12", "day"))).toMatch(/12/);
  });

  it("doesn't shift the day with the time zone", () => {
    // Parsed as UTC midnight: a local time zone behind UTC would show the 31st
    expect(formatReleaseDate(album("2021-01-01", "day"))).toMatch(/\b1\b/);
  });
});
