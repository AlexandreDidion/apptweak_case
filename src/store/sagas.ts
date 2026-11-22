import { all } from "redux-saga/effects";

import authSaga from "../features/auth/authSagas";

export default function* rootSaga() {
  yield all([authSaga()]);
}
