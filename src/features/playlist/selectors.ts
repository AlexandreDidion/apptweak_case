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
export const selectGetMoreItemsRequest = (state: RootState) => state.playlist.getMoreItemsRequest;
export const selectEditPlaylistRequest = (state: RootState) => state.playlist.editRequest;
export const selectAddItemsRequest = (state: RootState) => state.playlist.addItemsRequest;
export const selectRemoveItemsRequest = (state: RootState) => state.playlist.removeItemsRequest;
export const selectReorderItemsRequest = (state: RootState) => state.playlist.reorderItemsRequest;

/** Tracks of the playlists opened during the session, by playlist id */
export const selectTracksByPlaylistId = createSelector(
  selectPlaylistState,
  (playlist) => playlist.tracksByPlaylistId
);
