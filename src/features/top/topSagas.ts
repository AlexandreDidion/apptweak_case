import { SagaIterator } from "redux-saga";
import { all, call, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import { spotifyClient } from "@/lib/spotifyClient";

import { getTopItems, getTopItemsFailed, getTopItemsSuccess } from "./slice";

function* fetchTopItems(action: ReturnType<typeof getTopItems>): SagaIterator {
  const params = { time_range: action.payload.timeRange, limit: 1 };

  try {
    const requestTracks = () =>
      spotifyClient.get<SpotifyApi.UsersTopTracksResponse>("/me/top/tracks", { params });
    const requestArtists = () =>
      spotifyClient.get<SpotifyApi.UsersTopArtistsResponse>("/me/top/artists", { params });

    const [tracksResponse, artistsResponse] = (yield all([
      call(requestTracks),
      call(requestArtists)
    ])) as [SagaReturnType<typeof requestTracks>, SagaReturnType<typeof requestArtists>];

    yield put(
      getTopItemsSuccess({
        topTrack: tracksResponse.data.items[0],
        topArtist: artistsResponse.data.items[0]
      })
    );
  } catch (error) {
    yield put(
      getTopItemsFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

export default function* topSaga() {
  // takeLatest: sliding through periods only keeps the last request
  yield takeLatest(getTopItems.type, fetchTopItems);
}
