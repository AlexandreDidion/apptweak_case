import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectSearchState = (state: RootState) => state.search;

export const selectSearchQuery = createSelector(selectSearchState, (search) => search.query);
