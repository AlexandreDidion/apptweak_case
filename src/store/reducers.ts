import { combineReducers } from "@reduxjs/toolkit";

import authentication from "@/features/auth/slice";
import playlist from "@/features/playlist/slice";
import search from "@/features/search/slice";

const rootReducer = combineReducers({
  authentication,
  playlist,
  search
});

export default rootReducer;
