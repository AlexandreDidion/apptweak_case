/**
 * 196514 → "3:16" (seconds are truncated, like in the Spotify app)
 */
export function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
}
