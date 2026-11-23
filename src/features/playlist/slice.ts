import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { ErrorPayload, RequestStatus } from "@/types/requests";

import { PlaylistFormValues } from "./playlistFormSchema";

export interface PlaylistState extends CommonReduxState {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  playlist?: SpotifyApi.PlaylistObjectFull;
  createRequest: CommonReduxState;
  getRequest: CommonReduxState;
  editRequest: CommonReduxState;
  addItemsRequest: CommonReduxState;
  removeItemsRequest: CommonReduxState;
}

interface PlaylistItemsChange {
  playlistId: string;
  snapshotId: string;
}

const initialState: PlaylistState = {
  status: RequestStatus.IDLE,
  playlists: [],
  playlist: undefined,
  createRequest: { status: RequestStatus.IDLE },
  getRequest: { status: RequestStatus.IDLE },
  editRequest: { status: RequestStatus.IDLE },
  addItemsRequest: { status: RequestStatus.IDLE },
  removeItemsRequest: { status: RequestStatus.IDLE }
};

/** Keeps the track count of the playlist in the list (sidebar, cards) in sync */
function updateListItemTotal(state: PlaylistState, playlistId: string, delta: number) {
  const listItem = state.playlists.find((playlist) => playlist.id === playlistId);
  if (listItem?.items) listItem.items.total += delta;
}

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    getPlaylists: setPending,
    getPlaylistsSuccess: (state, action: PayloadAction<SpotifyApi.PlaylistObjectSimplified[]>) => {
      setSuccess(state);
      state.playlists = action.payload;
    },
    getPlaylistsFailed: setFailed,
    createPlaylist: (state, _action: PayloadAction<PlaylistFormValues>) => {
      setPending(state.createRequest);
    },
    createPlaylistSuccess: (state, action: PayloadAction<SpotifyApi.PlaylistObjectSimplified>) => {
      setSuccess(state.createRequest);
      state.playlists.push(action.payload);
    },
    createPlaylistFailed: (state, action: PayloadAction<ErrorPayload>) => {
      setFailed(state.createRequest, action);
    },
    editPlaylist: (
      state,
      _action: PayloadAction<{ playlistId: string; values: PlaylistFormValues }>
    ) => {
      setPending(state.editRequest);
    },
    editPlaylistSuccess: (
      state,
      action: PayloadAction<{ playlistId: string; values: PlaylistFormValues }>
    ) => {
      setSuccess(state.editRequest);
      const { playlistId, values } = action.payload;

      const listItem = state.playlists.find((playlist) => playlist.id === playlistId);
      if (listItem) Object.assign(listItem, values);

      if (state.playlist?.id === playlistId) Object.assign(state.playlist, values);
    },
    editPlaylistFailed: (state, action: PayloadAction<ErrorPayload>) => {
      setFailed(state.editRequest, action);
    },
    getPlaylist: (state, _action: PayloadAction<{ playlistId: string }>) => {
      setPending(state.getRequest);
    },
    getPlaylistSuccess: (state, action: PayloadAction<SpotifyApi.PlaylistObjectFull>) => {
      setSuccess(state.getRequest);
      state.playlist = action.payload;
    },
    getPlaylistFailed: (state, action: PayloadAction<ErrorPayload>) => {
      setFailed(state.getRequest, action);
    },
    addItemsToPlaylist: (
      state,
      _action: PayloadAction<{ playlistId: string; tracks: SpotifyApi.TrackObjectFull[] }>
    ) => {
      setPending(state.addItemsRequest);
    },
    addItemsToPlaylistSuccess: (
      state,
      action: PayloadAction<PlaylistItemsChange & { tracks: SpotifyApi.TrackObjectFull[] }>
    ) => {
      setSuccess(state.addItemsRequest);
      const { playlistId, snapshotId, tracks } = action.payload;

      if (state.playlist?.id === playlistId && state.playlist.items) {
        state.playlist.items.items.push(
          ...tracks.map(
            (track) =>
              ({
                item: track
              }) as SpotifyApi.PlaylistTrackObject
          )
        );
        state.playlist.items.total += tracks.length;
        state.playlist.snapshot_id = snapshotId;
      }
      updateListItemTotal(state, playlistId, tracks.length);
    },
    addItemsToPlaylistFailed: (state, action: PayloadAction<ErrorPayload>) => {
      setFailed(state.addItemsRequest, action);
    },
    removeItemsFromPlaylist: (
      state,
      _action: PayloadAction<{ playlistId: string; uris: string[] }>
    ) => {
      setPending(state.removeItemsRequest);
    },
    removeItemsFromPlaylistSuccess: (
      state,
      action: PayloadAction<PlaylistItemsChange & { uris: string[] }>
    ) => {
      setSuccess(state.removeItemsRequest);
      const { playlistId, snapshotId, uris } = action.payload;
      let removedCount = 0;

      if (state.playlist?.id === playlistId && state.playlist.items) {
        // Spotify removes every occurrence of each URI, so do the same locally
        const remaining = state.playlist.items.items.filter(
          (playlistItem) => !playlistItem.item || !uris.includes(playlistItem.item.uri)
        );
        removedCount = state.playlist.items.items.length - remaining.length;
        state.playlist.items.items = remaining;
        state.playlist.items.total -= removedCount;
        state.playlist.snapshot_id = snapshotId;
      }
      updateListItemTotal(state, playlistId, -removedCount);
    },
    removeItemsFromPlaylistFailed: (state, action: PayloadAction<ErrorPayload>) => {
      setFailed(state.removeItemsRequest, action);
    }
  }
});

export const {
  getPlaylists,
  getPlaylistsSuccess,
  getPlaylistsFailed,
  createPlaylist,
  createPlaylistSuccess,
  createPlaylistFailed,
  editPlaylist,
  editPlaylistSuccess,
  editPlaylistFailed,
  getPlaylist,
  getPlaylistSuccess,
  getPlaylistFailed,
  addItemsToPlaylist,
  addItemsToPlaylistSuccess,
  addItemsToPlaylistFailed,
  removeItemsFromPlaylist,
  removeItemsFromPlaylistSuccess,
  removeItemsFromPlaylistFailed
} = playlistSlice.actions;

export default playlistSlice.reducer;
