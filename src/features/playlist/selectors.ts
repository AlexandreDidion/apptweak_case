import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectPlaylistState = (state: RootState) => state.playlist;

export const selectPlaylists = createSelector(
  selectPlaylistState,
  (playlist) => playlist.playlists
);
