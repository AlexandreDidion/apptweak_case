import { all } from "redux-saga/effects";

import authSaga from "@/features/auth/authSagas";
import playlistSaga from "@/features/playlist/playlistSagas";
import searchSaga from "@/features/search/searchSagas";
import topSaga from "@/features/top/topSagas";

export default function* rootSaga() {
  yield all([authSaga(), playlistSaga(), searchSaga(), topSaga()]);
}
