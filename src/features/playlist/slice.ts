import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { ErrorPayload, RequestStatus } from "@/types/requests";

import { PlaylistFormValues } from "./playlistFormSchema";

export interface PlaylistState extends CommonReduxState {
  playlists: SpotifyApi.PlaylistObjectSimplified[];
  playlist?: SpotifyApi.PlaylistObjectSimplified;
  createRequest: CommonReduxState;
  getRequest: CommonReduxState;
}

const initialState: PlaylistState = {
  status: RequestStatus.IDLE,
  playlists: [],
  playlist: undefined,
  createRequest: { status: RequestStatus.IDLE },
  getRequest: { status: RequestStatus.IDLE }
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
  getPlaylist,
  getPlaylistSuccess,
  getPlaylistFailed
} = playlistSlice.actions;

export default playlistSlice.reducer;
