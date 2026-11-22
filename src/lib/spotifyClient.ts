import axios from "axios";

import { ACCESS_TOKEN_STORAGE_KEY, BASE_SPOTIFY_API_URL } from "./constants";

/**
 * Axios instance for the Spotify Web API.
 * Use relative URLs, e.g. spotifyClient.get<SpotifyApi.CurrentUsersProfileResponse>("/me")
 */
export const spotifyClient = axios.create({
  baseURL: BASE_SPOTIFY_API_URL
});

// Read the token on every request: the periodic refresh saga updates localStorage
// (not the Redux store), so this always sends the latest token
spotifyClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
