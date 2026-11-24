import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectTopState = (state: RootState) => state.top;

export const selectTopItems = createSelector(selectTopState, ({ topTrack, topArtist }) => ({
  topTrack,
  topArtist
}));
