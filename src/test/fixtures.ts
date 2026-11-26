/**
 * Minimal Spotify objects for tests: only the fields the app reads
 */
export function makeTrack(
  id: string,
  overrides: Partial<SpotifyApi.TrackObjectFull> = {}
): SpotifyApi.TrackObjectFull {
  return {
    id,
    uri: `spotify:track:${id}`,
    type: "track",
    name: id,
    explicit: false,
    duration_ms: 180_000,
    artists: [{ name: "Artist" }],
    album: { name: "Album", images: [], release_date: "2020-01-01", release_date_precision: "day" },
    ...overrides
  } as SpotifyApi.TrackObjectFull;
}

/** `item` can be an episode: Spotify returns them in playlists, even though the types don't say so */
export function makePlaylistItem(
  item: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull | null,
  overrides: Partial<SpotifyApi.PlaylistTrackObject> = {}
): SpotifyApi.PlaylistTrackObject {
  return { item, is_local: false, ...overrides } as SpotifyApi.PlaylistTrackObject;
}
