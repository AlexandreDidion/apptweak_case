import { combineReducers } from "@reduxjs/toolkit";

import authentication from "../features/auth/slice";

const rootReducer = combineReducers({
  authentication
});

export default rootReducer;
