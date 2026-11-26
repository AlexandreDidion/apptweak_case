export interface PlaylistTrackEntry {
  /** Stable across reorders, even when a track is in the playlist several times */
  id: string;
  /** Index in the playlist's items: Spotify's position, hidden items included */
  position: number;
  track: SpotifyApi.TrackObjectFull;
}

/**
 * The Spotify tracks of a playlist's items, with their position. Skips podcast episodes (no
 * album: TrackLine would crash), removed tracks (null) and local files (no Spotify id)
 */
export function playlistTrackEntries(
  playlistItems: SpotifyApi.PlaylistTrackObject[]
): PlaylistTrackEntry[] {
  const occurrencesByUri = new Map<string, number>();

  return playlistItems.flatMap((playlistItem, position) => {
    // The types only expect tracks, but Spotify can also return podcast episodes here
    const item = playlistItem.item as
      SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null;
    if (item?.type !== "track" || playlistItem.is_local) return [];

    const occurrence = occurrencesByUri.get(item.uri) ?? 0;
    occurrencesByUri.set(item.uri, occurrence + 1);
    return [{ id: `${item.uri}:${occurrence.toString()}`, position, track: item }];
  });
}

/** The Spotify tracks of a playlist's items (see `playlistTrackEntries`) */
export function playlistItemTracks(
  playlistItems: SpotifyApi.PlaylistTrackObject[]
): SpotifyApi.TrackObjectFull[] {
  return playlistTrackEntries(playlistItems).map((entry) => entry.track);
}
