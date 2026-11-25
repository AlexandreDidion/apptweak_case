import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectNaughtyState = (state: RootState) => state.naughty;

export const selectNaughtySample = createSelector(selectNaughtyState, (naughty) => naughty.sample);
export const selectExplicitTrackCount = createSelector(
  selectNaughtyState,
  (naughty) => naughty.explicitTracks.length
);
