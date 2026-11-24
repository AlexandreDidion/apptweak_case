import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectSearchState = (state: RootState) => state.search;

export const selectSearchTracks = createSelector(selectSearchState, (search) => search.tracks);
export const selectSearchQuery = createSelector(selectSearchState, (search) => search.query);
export const selectSearchTotal = createSelector(selectSearchState, (search) => search.total);
