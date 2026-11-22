import axios from "axios";
import { SagaIterator } from "redux-saga";
import {
  ActionPattern,
  call,
  delay,
  fork,
  ForkEffect,
  put,
  SagaReturnType,
  select,
  take,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { getPlaylistsFailed, getPlaylistsSuccess } from "./slice";
import { spotifyClient } from "@/lib/spotifyClient";
import { getPlaylists } from "./slice";

function* fetchPlaylists(): SagaIterator {
  try {
    const request = () =>
      spotifyClient.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>("/me/playlists");
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(getPlaylistsSuccess(data.items));
  } catch (error) {
    yield put(
      getPlaylistsFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

export default function* playlistSaga() {
  yield takeLatest(getPlaylists.type, fetchPlaylists);
}
