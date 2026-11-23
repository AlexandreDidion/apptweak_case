import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectPlaylistState = (state: RootState) => state.playlist;

export const selectPlaylists = createSelector(
  selectPlaylistState,
  (playlist) => playlist.playlists
);

export const selectPlaylist = createSelector(selectPlaylistState, (playlist) => playlist.playlist);

// Returns the nested object itself: a stable reference for useReduxMutation
export const selectCreatePlaylistRequest = (state: RootState) => state.playlist.createRequest;
export const selectGetPlaylistRequest = (state: RootState) => state.playlist.getRequest;
