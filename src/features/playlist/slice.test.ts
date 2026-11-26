import { makePlaylistItem, makeTrack } from "@/test/fixtures";

import reducer, {
  addItemsToPlaylistSuccess,
  getPlaylistSuccess,
  PlaylistState,
  reorderPlaylistItems,
  reorderPlaylistItemsFailed
} from "./slice";

const PLAYLIST_ID = "playlist";

/** State with an open playlist holding tracks a, b, c, d, of `total` tracks on Spotify */
function stateWithOpenPlaylist(total = 4): PlaylistState {
  const playlist = {
    id: PLAYLIST_ID,
    snapshot_id: "snapshot",
    items: {
      items: ["a", "b", "c", "d"].map((id) => makePlaylistItem(makeTrack(id))),
      total
    }
  } as SpotifyApi.PlaylistObjectFull;

  return reducer(undefined, getPlaylistSuccess(playlist));
}

const trackIds = (state: PlaylistState) =>
  state.playlist?.items?.items.map((playlistItem) => playlistItem.item?.id);

describe("reorderPlaylistItems", () => {
  it("moves a track down, before the item at `insertBefore` (like Spotify)", () => {
    const state = reducer(
      stateWithOpenPlaylist(),
      reorderPlaylistItems({ playlistId: PLAYLIST_ID, rangeStart: 0, insertBefore: 3 })
    );
    expect(trackIds(state)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves a track up", () => {
    const state = reducer(
      stateWithOpenPlaylist(),
      reorderPlaylistItems({ playlistId: PLAYLIST_ID, rangeStart: 3, insertBefore: 1 })
    );
    expect(trackIds(state)).toEqual(["a", "d", "b", "c"]);
  });

  it.each([
    { rangeStart: 0, insertBefore: 3 },
    { rangeStart: 3, insertBefore: 1 }
  ])("puts the track back when Spotify refuses the move ($rangeStart → $insertBefore)", (move) => {
    const moved = reducer(
      stateWithOpenPlaylist(),
      reorderPlaylistItems({ playlistId: PLAYLIST_ID, ...move })
    );
    const reverted = reducer(
      moved,
      reorderPlaylistItemsFailed({
        message: "Forbidden",
        move: { playlistId: PLAYLIST_ID, ...move }
      })
    );
    expect(trackIds(reverted)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("addItemsToPlaylistSuccess", () => {
  const added = {
    playlistId: PLAYLIST_ID,
    snapshotId: "new-snapshot",
    tracks: [makeTrack("new")]
  };

  it("appends the track when every page is loaded", () => {
    const state = reducer(stateWithOpenPlaylist(), addItemsToPlaylistSuccess(added));
    expect(trackIds(state)).toEqual(["a", "b", "c", "d", "new"]);
    expect(state.playlist?.items?.total).toBe(5);
  });

  it("only updates the count when pages are still unloaded (Load more brings it)", () => {
    const state = reducer(stateWithOpenPlaylist(120), addItemsToPlaylistSuccess(added));
    expect(trackIds(state)).toEqual(["a", "b", "c", "d"]);
    expect(state.playlist?.items?.total).toBe(121);
  });
});
