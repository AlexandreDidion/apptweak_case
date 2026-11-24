import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

/** Spotify's periods: ~4 weeks, ~6 months, ~1 year */
export type TimeRange = "short_term" | "medium_term" | "long_term";

export interface TopState extends CommonReduxState {
  timeRange?: TimeRange;
  topTrack?: SpotifyApi.TrackObjectFull;
  topArtist?: SpotifyApi.ArtistObjectFull;
}

const initialState: TopState = {
  status: RequestStatus.IDLE
};

const topSlice = createSlice({
  name: "top",
  initialState,
  reducers: {
    getTopItems: (state, action: PayloadAction<{ timeRange: TimeRange }>) => {
      setPending(state);
      state.timeRange = action.payload.timeRange;
    },
    getTopItemsSuccess: (
      state,
      action: PayloadAction<{
        topTrack?: SpotifyApi.TrackObjectFull;
        topArtist?: SpotifyApi.ArtistObjectFull;
      }>
    ) => {
      setSuccess(state);
      state.topTrack = action.payload.topTrack;
      state.topArtist = action.payload.topArtist;
    },
    getTopItemsFailed: setFailed
  }
});

export const { getTopItems, getTopItemsSuccess, getTopItemsFailed } = topSlice.actions;

export default topSlice.reducer;
