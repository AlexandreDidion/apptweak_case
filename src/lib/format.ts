/**
 * 196514 → "3:16" (seconds are truncated, like in the Spotify app)
 */
export function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * An album's release date, as precise as Spotify knows it: "12 Mar 2021", "Mar 2021" or "2021"
 */
export function formatReleaseDate(album: SpotifyApi.AlbumObjectSimplified) {
  if (album.release_date_precision === "year") return album.release_date;

  // UTC: "2021-03-12" is parsed as UTC midnight, a local time zone could shift it a day
  return new Intl.DateTimeFormat(undefined, {
    day: album.release_date_precision === "day" ? "numeric" : undefined,
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(album.release_date));
}
