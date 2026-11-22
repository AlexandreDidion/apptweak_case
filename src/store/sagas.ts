import { all } from "redux-saga/effects";

import authSaga from "@/features/auth/authSagas";
import playlistSaga from "@/features/playlist/playlistSagas";

export default function* rootSaga() {
  yield all([authSaga(), playlistSaga()]);
}
