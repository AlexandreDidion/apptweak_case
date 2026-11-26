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
  take,
  takeEvery,
  takeLatest
} from "redux-saga/effects";

import {
  ACCESS_TOKEN_STORAGE_KEY,
  EXPIRES_AT_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY
} from "@/lib/constants";
import { spotifyClient } from "@/lib/spotifyClient";

import {
  getToken,
  getTokenFailed,
  getTokenSuccess,
  getUser,
  getUserFailed,
  getUserSuccess,
  login
} from "./slice";
import {
  base64encode,
  generateRandomString,
  REDIRECT_URI,
  sha256,
  SPOTIFY_SCOPE,
  storeToken,
  TokenResponse
} from "./utils";

export function takeOne<A extends { type: string }, Args extends unknown[]>(
  pattern: ActionPattern<A>,
  saga: (action: A, ...args: Args) => SagaIterator,
  ...args: Args
): ForkEffect {
  return fork(function* (): SagaIterator {
    const action = (yield take(pattern)) as A;
    yield fork(saga, action, ...args);
  });
}

function* getUserSaga(): SagaIterator {
  try {
    const request = () => spotifyClient.get<SpotifyApi.CurrentUsersProfileResponse>("/me");
    const { data: user } = (yield call(request)) as SagaReturnType<typeof request>;

    yield put(getUserSuccess(user));
  } catch (error) {
    yield put(getUserFailed({ message: error instanceof Error ? error.message : String(error) }));
  }
}

function* loginSaga(): SagaIterator {
  const localStorageAccessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (localStorageAccessToken) {
    yield put(getTokenSuccess(localStorageAccessToken));
    return;
  }
  const { VITE_SPOTIFY_CLIENT_ID } = import.meta.env;
  if (!VITE_SPOTIFY_CLIENT_ID) {
    throw new Error("Missing Spotify Client ID");
  }
  const scope: string = SPOTIFY_SCOPE.join(",");
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  //  We generate a random string to use as the code verifier. It
  //  is used to verify the code challenge sent to Spotify, and we will need it to get the access token (in getTokenSaga)
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem("code_verifier", codeVerifier);

  const hashed = (yield call(sha256, codeVerifier)) as SagaReturnType<typeof sha256>;
  const codeChallenge = base64encode(hashed);
  const params = {
    response_type: "code",
    client_id: VITE_SPOTIFY_CLIENT_ID,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI
  };
  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

function* getTokenSaga(action: ReturnType<typeof getToken>): SagaIterator {
  const code = action.payload;
  const { VITE_SPOTIFY_CLIENT_ID } = import.meta.env;
  const getToken = () => {
    if (!VITE_SPOTIFY_CLIENT_ID) {
      throw new Error("Missing Spotify Client ID");
    }

    // stored before navigating to Spotify
    const codeVerifier = localStorage.getItem("code_verifier");
    if (!codeVerifier) {
      throw new Error("Missing code verifier");
    }

    const url = "https://accounts.spotify.com/api/token";

    return axios.post<TokenResponse>(
      url,
      new URLSearchParams({
        client_id: VITE_SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  };

  try {
    const { data } = (yield call(getToken)) as SagaReturnType<typeof getToken>;

    // Store the access token and refresh token in local storage
    storeToken(data);

    // Remove the code from the URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete("code");
    window.history.replaceState({}, "", `?${urlParams.toString()}`);

    // Remove the code verifier from local storage
    localStorage.removeItem("code_verifier");

    // Store the access token in the Redux store to be used by any request
    yield put(getTokenSuccess(data.access_token));
  } catch (e) {
    // Spotify returns { error: string } in the response body on failure
    const spotifyError = axios.isAxiosError<{ error?: string }>(e)
      ? e.response?.data.error
      : undefined;
    yield put(getTokenFailed({ message: spotifyError ?? String(e) }));
    console.error("Error getting token", e);
  }
}

/**
 * Returns whether the refresh succeeded
 */
function* refreshToken(): SagaIterator<boolean> {
  const { VITE_SPOTIFY_CLIENT_ID } = import.meta.env;
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? "";
  const refreshTokenCall = () => {
    if (!VITE_SPOTIFY_CLIENT_ID) {
      throw new Error("Missing Spotify Client ID");
    }

    return axios.post<TokenResponse>(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: VITE_SPOTIFY_CLIENT_ID
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
  };
  try {
    const { data } = (yield call(refreshTokenCall)) as SagaReturnType<typeof refreshTokenCall>;

    // Store the access token and refresh token in local storage
    storeToken(data);
    return true;
  } catch (e) {
    // e.g. { error: "invalid_grant" } when the refresh token was revoked or already used
    const spotifyError = axios.isAxiosError(e) ? (e.response?.data as unknown) : undefined;
    console.error("Error refreshing token", spotifyError ?? e);

    // The refresh token can't be used anymore: start a new login
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(EXPIRES_AT_STORAGE_KEY);
    yield put(login());
    return false;
  }
}

/**
 * Periodic refresh token saga
 */
function* periodicRefreshToken() {
  while (true) {
    const tokenExpiry = parseInt(localStorage.getItem(EXPIRES_AT_STORAGE_KEY) ?? "0");
    const now = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 1 minute buffer time
    yield delay(Math.max(0, (tokenExpiry - now - bufferTime) * 1000));
    const refreshed = (yield call(refreshToken)) as boolean;
    // Stop on failure, otherwise the expired token makes this loop retry immediately
    if (!refreshed) return;
  }
}

export default function* authSaga() {
  yield takeEvery(getUser.type, getUserSaga);
  yield takeOne(getToken.type, getTokenSaga);
  yield takeEvery(login.type, loginSaga);
  yield takeLatest(getTokenSuccess.type, periodicRefreshToken);
}
