import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

export interface SearchState extends CommonReduxState {
  query: string;
  tracks: SpotifyApi.TrackObjectFull[];
  /** Number of matches on Spotify, can be more than the returned tracks */
  total: number;
}

const initialState: SearchState = {
  status: RequestStatus.IDLE,
  query: "",
  tracks: [],
  total: 0
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    searchTracks: (state, action: PayloadAction<{ query: string; isHipsterSearch?: boolean }>) => {
      setPending(state);
      state.query = action.payload.query;
    },
    searchTracksSuccess: (
      state,
      action: PayloadAction<{ tracks: SpotifyApi.TrackObjectFull[]; total: number }>
    ) => {
      setSuccess(state);
      state.tracks = action.payload.tracks;
      state.total = action.payload.total;
    },
    searchTracksFailed: setFailed,
    clearSearch: () => initialState
  }
});

export const { searchTracks, searchTracksSuccess, searchTracksFailed, clearSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
