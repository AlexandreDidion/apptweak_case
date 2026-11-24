import { SagaIterator } from "redux-saga";
import { call, delay, put, SagaReturnType, takeLatest } from "redux-saga/effects";

import { spotifyClient } from "@/lib/spotifyClient";

import { clearSearch, searchTracks, searchTracksFailed, searchTracksSuccess } from "./slice";

const SEARCH_DEBOUNCE_MS = 300;
const SEARCH_LIMIT = 10;
// Only search for tracks by default
const ITEM_TYPE = "track";

/**
 * Spotify filters are written inside `q`, e.g. "miles tag:hipster", not sent as URL params.
 */
export function buildSearchQuery(query: string, { isHipsterSearch = false } = {}) {
  return isHipsterSearch ? `${query} tag:hipster` : query;
}

function* onSearchTracks(action: ReturnType<typeof searchTracks>): SagaIterator {
  const query = action.payload.query.trim();
  const type = action.payload.type ?? ITEM_TYPE;
  const isHipsterSearch = action.payload.isHipsterSearch ?? false;

  if (!query) {
    yield put(clearSearch());
    return;
  }

  // takeLatest cancels this saga when a new search comes in, during the delay or the request:
  // only the last query reaches the API, and older results can't overwrite newer ones
  yield delay(SEARCH_DEBOUNCE_MS);

  const params = {
    q: buildSearchQuery(query, { isHipsterSearch }),
    type: type,
    limit: SEARCH_LIMIT
  };

  try {
    const request = () =>
      spotifyClient.get<SpotifyApi.TrackSearchResponse>("/search", {
        params
      });
    const { data } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(searchTracksSuccess({ tracks: data.tracks.items, total: data.tracks.total }));
  } catch (error) {
    yield put(
      searchTracksFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

export default function* searchSaga() {
  yield takeLatest(searchTracks.type, onSearchTracks);
}
