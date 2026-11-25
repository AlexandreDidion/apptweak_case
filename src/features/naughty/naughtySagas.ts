import { SagaIterator } from "redux-saga";
import { call, put, SagaReturnType, select, take, takeLatest } from "redux-saga/effects";

import { playlistItemTracks } from "@/features/playlist/playlistItemTracks";
import { selectPlaylistState } from "@/features/playlist/selectors";
import { getPlaylistsSuccess } from "@/features/playlist/slice";
import { spotifyClient } from "@/lib/spotifyClient";
import { RequestStatus } from "@/types/requests";

import { selectNaughtyState } from "./selectors";
import { getNaughtyTracks, getNaughtyTracksFailed, getNaughtyTracksSuccess } from "./slice";

const SAMPLE_SIZE = 15;
/** Trying to limit requests to not exceed Spotify's Development Mode quota */
const MAX_PAGE_REQUESTS = 4;
const PAGE_LIMIT = 50;

/**.
 * Random, so it lives in the saga: reducers and selectors must stay pure
 */
function randomSample<Item>(items: Item[], size: number): Item[] {
  const shuffled = [...items];
  const count = Math.min(size, shuffled.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (shuffled.length - i));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** The URL of each page of a playlist's tracks */
function playlistPageUrls(playlist: SpotifyApi.PlaylistObjectSimplified): string[] {
  const pageCount = Math.ceil((playlist.items?.total ?? 0) / PAGE_LIMIT);
  return Array.from(
    { length: pageCount },
    (_, page) =>
      `/playlists/${playlist.id}/items?limit=${PAGE_LIMIT.toString()}&offset=${(page * PAGE_LIMIT).toString()}`
  );
}

/** Waits for the playlist list (the sidebar fetches it on every page) */
function* selectLoadedPlaylists(): SagaIterator<SpotifyApi.PlaylistObjectSimplified[]> {
  const playlistState = (yield select(selectPlaylistState)) as SagaReturnType<
    typeof selectPlaylistState
  >;
  if (playlistState.status === RequestStatus.SUCCESS) return playlistState.playlists;

  const action = (yield take(getPlaylistsSuccess.type)) as ReturnType<typeof getPlaylistsSuccess>;
  return action.payload;
}

/**
 * A random sample of explicit tracks. The pool is made of the tracks already known (previous
 * draws, opened playlists) and, while it's too small, of a few random pages of the playlists:
 * a random page is a random sample of tracks, without fetching every playlist
 */
function* drawNaughtyTracks(): SagaIterator {
  try {
    const playlists = (yield call(selectLoadedPlaylists)) as SpotifyApi.PlaylistObjectSimplified[];
    const { tracksByPlaylistId } = (yield select(selectPlaylistState)) as SagaReturnType<
      typeof selectPlaylistState
    >;
    const naughtyState = (yield select(selectNaughtyState)) as SagaReturnType<
      typeof selectNaughtyState
    >;

    // Keyed by id: a track in several playlists counts once
    const explicitTracksById = new Map<string, SpotifyApi.TrackObjectFull>();
    const addExplicitTracks = (tracks: SpotifyApi.TrackObjectFull[]) => {
      tracks
        .filter((track) => track.explicit)
        .forEach((track) => explicitTracksById.set(track.id, track));
    };
    addExplicitTracks([
      ...naughtyState.explicitTracks,
      ...Object.values(tracksByPlaylistId).flatMap((tracks) => tracks ?? [])
    ]);

    const fetchedPages = [...naughtyState.fetchedPages];
    const candidatePageUrls = playlists
      .filter((playlist) => playlist.items && !(playlist.id in tracksByPlaylistId))
      .flatMap(playlistPageUrls)
      .filter((url) => !fetchedPages.includes(url));

    for (const url of randomSample(candidatePageUrls, MAX_PAGE_REQUESTS)) {
      if (explicitTracksById.size >= SAMPLE_SIZE) break;

      const request = () => spotifyClient.get<SpotifyApi.PlaylistTrackResponse>(url);
      const { data } = (yield call(request)) as SagaReturnType<typeof request>;

      addExplicitTracks(playlistItemTracks(data.items));
      fetchedPages.push(url);
    }

    const explicitTracks = [...explicitTracksById.values()];
    yield put(
      getNaughtyTracksSuccess({
        explicitTracks,
        sample: randomSample(explicitTracks, SAMPLE_SIZE),
        fetchedPages
      })
    );
  } catch (error) {
    yield put(
      getNaughtyTracksFailed({ message: error instanceof Error ? error.message : String(error) })
    );
  }
}

export default function* naughtySaga() {
  yield takeLatest(getNaughtyTracks.type, drawNaughtyTracks);
}
