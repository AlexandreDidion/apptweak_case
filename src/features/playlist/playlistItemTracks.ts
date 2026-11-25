/**
 * The Spotify tracks of a playlist's items. Skips podcast episodes (no album: TrackLine would
 * crash), removed tracks (null) and local files (no Spotify id)
 */
export function playlistItemTracks(
  playlistItems: SpotifyApi.PlaylistTrackObject[]
): SpotifyApi.TrackObjectFull[] {
  return playlistItems.flatMap((playlistItem) => {
    // The types only expect tracks, but Spotify can also return podcast episodes here
    const item = playlistItem.item as
      SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null;
    return item?.type === "track" && !playlistItem.is_local ? [item] : [];
  });
}
