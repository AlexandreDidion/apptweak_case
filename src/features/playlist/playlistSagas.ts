import { SagaIterator } from "redux-saga";
import { call, put, SagaReturnType, takeEvery, takeLatest } from "redux-saga/effects";

import { spotifyClient } from "@/lib/spotifyClient";
import { fetchAllPages } from "@/lib/spotifyPaging";

import {
  addItemsToPlaylist,
  addItemsToPlaylistFailed,
  addItemsToPlaylistSuccess,
  createPlaylist,
  createPlaylistFailed,
  createPlaylistSuccess,
  editPlaylist,
  editPlaylistFailed,
  editPlaylistSuccess,
  getPlaylist,
  getPlaylistFailed,
  getPlaylists,
  getPlaylistsFailed,
  getPlaylistsSuccess,
  getPlaylistSuccess,
  removeItemsFromPlaylist,
  removeItemsFromPlaylistFailed,
  removeItemsFromPlaylistSuccess
} from "./slice";

function* fetchPlaylists(): SagaIterator {
  try {
    // Every page: one request only returned the first 20 playlists
    const playlists = (yield call(
      fetchAllPages<SpotifyApi.PlaylistObjectSimplified>,
      "/me/playlists"
    )) as SpotifyApi.PlaylistObjectSimplified[];

    yield put(getPlaylistsSuccess(playlists));
  } catch (error) {
    yield put(
      getPlaylistsFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

function* fetchPlaylist(action: ReturnType<typeof getPlaylist>): SagaIterator {
  try {
    const request = () =>
      spotifyClient.get<SpotifyApi.SinglePlaylistResponse>(
        `/playlists/${action.payload.playlistId}`
      );
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(getPlaylistSuccess(data));
  } catch (error) {
    yield put(
      getPlaylistFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

function* onCreatePlaylist(action: ReturnType<typeof createPlaylist>): SagaIterator {
  try {
    const request = () =>
      spotifyClient.post<SpotifyApi.PlaylistObjectSimplified>("/me/playlists", {
        name: action.payload.name,
        description: action.payload.description,
        public: action.payload.public
      });
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(createPlaylistSuccess(data));
  } catch (error) {
    yield put(
      createPlaylistFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

function* onEditPlaylist(action: ReturnType<typeof editPlaylist>): SagaIterator {
  try {
    const request = () =>
      spotifyClient.put<SpotifyApi.PlaylistObjectSimplified>(
        `/playlists/${action.payload.playlistId}`,
        {
          name: action.payload.values.name,
          // Spotify rejects an empty description and has
          // no documented way to remove one: a single space is the workaround to clear it
          description:
            action.payload.values.description.trim() === ""
              ? " "
              : action.payload.values.description,
          public: action.payload.values.public
        }
      );
    (yield call(request)) as SagaReturnType<typeof request>;

    yield put(editPlaylistSuccess(action.payload));
  } catch (error) {
    yield put(
      editPlaylistFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

function* onAddItemsToPlaylist(action: ReturnType<typeof addItemsToPlaylist>): SagaIterator {
  const { playlistId, tracks, position } = action.payload;

  try {
    const request = () =>
      spotifyClient.post<SpotifyApi.AddTracksToPlaylistResponse>(`/playlists/${playlistId}/items`, {
        uris: tracks.map((track) => track.uri),
        // Spotify appends when position is left out
        ...(position !== undefined && { position })
      });
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(
      addItemsToPlaylistSuccess({ playlistId, tracks, position, snapshotId: data.snapshot_id })
    );
  } catch (error) {
    yield put(
      addItemsToPlaylistFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

function* onRemoveItemsFromPlaylist(
  action: ReturnType<typeof removeItemsFromPlaylist>
): SagaIterator {
  const { playlistId, uris } = action.payload;
  try {
    const request = () =>
      spotifyClient.delete<SpotifyApi.RemoveTracksFromPlaylistResponse>(
        `/playlists/${playlistId}/items`,
        { data: { items: uris.map((uri) => ({ uri })) } }
      );
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(removeItemsFromPlaylistSuccess({ playlistId, uris, snapshotId: data.snapshot_id }));
  } catch (error) {
    yield put(
      removeItemsFromPlaylistFailed({
        message: error instanceof Error ? error.message : String(error)
      })
    );
  }
}

export default function* playlistSaga() {
  yield takeLatest(getPlaylists.type, fetchPlaylists);
  yield takeEvery(createPlaylist.type, onCreatePlaylist);
  yield takeEvery(editPlaylist.type, onEditPlaylist);
  yield takeLatest(getPlaylist.type, fetchPlaylist);
  yield takeEvery(addItemsToPlaylist.type, onAddItemsToPlaylist);
  yield takeEvery(removeItemsFromPlaylist.type, onRemoveItemsFromPlaylist);
}
