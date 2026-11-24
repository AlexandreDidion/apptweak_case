import {
  ACCESS_TOKEN_STORAGE_KEY,
  EXPIRES_AT_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY
} from "@/lib/constants";

/**
 * List of the Spotify API scopes that are used in the app.
 * Please refer to the Spotify API documentation for more information.
 * You can add or remove scopes as needed.
 */
export const SPOTIFY_SCOPE = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-library-read",
  "user-top-read"
];

/**
 * See **Code Verifier** section in https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
export const generateRandomString = (length: number) => {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

/**
 * See **Code Challenge** section in https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

/**
 * See **Code Challenge** section in https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
export const base64encode = (input: ArrayBufferLike) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const REDIRECT_URI = window.location.origin;

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * Store the access token and refresh token in local storage
 */
export const storeToken = (token: TokenResponse) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token.access_token);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token.refresh_token);
  localStorage.setItem(EXPIRES_AT_STORAGE_KEY, (Date.now() / 1000 + token.expires_in).toString());
};
