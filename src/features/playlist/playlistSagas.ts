import { SagaIterator } from "redux-saga";
import { call, put, SagaReturnType, takeEvery, takeLatest } from "redux-saga/effects";

import { spotifyClient } from "@/lib/spotifyClient";

import {
  createPlaylist,
  createPlaylistFailed,
  createPlaylistSuccess,
  getPlaylistsFailed,
  getPlaylistsSuccess
} from "./slice";
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

function* onCreatePlaylist(action: ReturnType<typeof createPlaylist>): SagaIterator {
  console.log("Creating playlist with payload:", action.payload);
  try {
    const request = () =>
      spotifyClient.post<SpotifyApi.PlaylistObjectSimplified>("/me/playlists", {
        name: action.payload.name,
        description: action.payload.description,
        public: action.payload.isPublic
      });
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(createPlaylistSuccess(data));
  } catch (error) {
    yield put(
      createPlaylistFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

export default function* playlistSaga() {
  yield takeLatest(getPlaylists.type, fetchPlaylists);
  yield takeEvery(createPlaylist.type, onCreatePlaylist);
}
