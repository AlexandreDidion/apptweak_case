import { SagaIterator } from "redux-saga";
import {
  call,
  put,
  SagaReturnType,
  takeLatest
} from "redux-saga/effects";

import { spotifyClient } from "@/lib/spotifyClient";

import { getPlaylistsFailed, getPlaylistsSuccess } from "./slice";
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
