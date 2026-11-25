import { combineReducers } from "@reduxjs/toolkit";

import authentication from "@/features/auth/slice";
import naughty from "@/features/naughty/slice";
import playlist from "@/features/playlist/slice";
import search from "@/features/search/slice";
import top from "@/features/top/slice";

const rootReducer = combineReducers({
  authentication,
  naughty,
  playlist,
  search,
  top
});

export default rootReducer;
