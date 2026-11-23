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
}

const initialState: PlaylistState = {
  status: RequestStatus.IDLE,
  playlists: [],
  playlist: undefined,
  createRequest: { status: RequestStatus.IDLE },
  getRequest: { status: RequestStatus.IDLE },
  editRequest: { status: RequestStatus.IDLE }
};

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
  getPlaylistFailed
} = playlistSlice.actions;

export default playlistSlice.reducer;
