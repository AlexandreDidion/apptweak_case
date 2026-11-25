import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

export interface NaughtyState extends CommonReduxState {
  /** Explicit tracks found so far: in random pages of the playlists and in opened playlists */
  explicitTracks: SpotifyApi.TrackObjectFull[];
  /** The random selection shown on the page */
  sample: SpotifyApi.TrackObjectFull[];
  /** URLs of the track pages already fetched, so they're never fetched twice */
  fetchedPages: string[];
}

const initialState: NaughtyState = {
  status: RequestStatus.IDLE,
  explicitTracks: [],
  sample: [],
  fetchedPages: []
};

const naughtySlice = createSlice({
  name: "naughty",
  initialState,
  reducers: {
    getNaughtyTracks: setPending,
    getNaughtyTracksSuccess: (
      state,
      action: PayloadAction<{
        explicitTracks: SpotifyApi.TrackObjectFull[];
        sample: SpotifyApi.TrackObjectFull[];
        fetchedPages: string[];
      }>
    ) => {
      setSuccess(state);
      state.explicitTracks = action.payload.explicitTracks;
      state.sample = action.payload.sample;
      state.fetchedPages = action.payload.fetchedPages;
    },
    getNaughtyTracksFailed: setFailed
  }
});

export const { getNaughtyTracks, getNaughtyTracksSuccess, getNaughtyTracksFailed } =
  naughtySlice.actions;

export default naughtySlice.reducer;
