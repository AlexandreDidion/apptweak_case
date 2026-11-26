import { makePlaylistItem, makeTrack } from "@/test/fixtures";

import { playlistTrackEntries } from "./playlistItemTracks";

describe("playlistTrackEntries", () => {
  it("skips episodes, removed tracks and local files, keeping Spotify's positions", () => {
    const episode = { id: "episode", type: "episode" } as SpotifyApi.EpisodeObjectFull;
    const items = [
      makePlaylistItem(makeTrack("a")),
      makePlaylistItem(episode),
      makePlaylistItem(null),
      makePlaylistItem(makeTrack("local"), { is_local: true }),
      makePlaylistItem(makeTrack("b"))
    ];

    const entries = playlistTrackEntries(items);

    expect(entries.map((entry) => entry.track.id)).toEqual(["a", "b"]);
    // Hidden items still count: "b" is the 5th item for Spotify
    expect(entries.map((entry) => entry.position)).toEqual([0, 4]);
  });

  it("gives a different id to each copy of a track", () => {
    const track = makeTrack("a");
    const entries = playlistTrackEntries([makePlaylistItem(track), makePlaylistItem(track)]);

    expect(entries.map((entry) => entry.id)).toEqual(["spotify:track:a:0", "spotify:track:a:1"]);
  });
});
