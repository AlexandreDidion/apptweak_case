import { combineReducers } from "@reduxjs/toolkit";

import authentication from "../containers/auth/slice";

const rootReducer = combineReducers({
  authentication
});

export default rootReducer;
