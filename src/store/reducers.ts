import { combineReducers } from "@reduxjs/toolkit";

import authentication from "@/features/auth/slice";
import playlist from "@/features/playlist/slice";

const rootReducer = combineReducers({
  authentication,
  playlist
});

export default rootReducer;
