import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { setFailed, setPending, setSuccess } from "@/store/commonReducers";
import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

export interface AuthState extends CommonReduxState {
  accessToken?: string;
  user?: SpotifyApi.UserObjectPrivate;
}

const initialState: AuthState = {
  status: RequestStatus.IDLE
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    getUser: setPending,
    getUserSuccess: (state, action: PayloadAction<SpotifyApi.UserObjectPrivate>) => {
      setSuccess(state);
      state.user = action.payload;
    },
    getUserFailed: setFailed,
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    getToken: (state, _action: PayloadAction<string>) => {
      setPending(state);
    },
    getTokenSuccess: (state, action: PayloadAction<string>) => {
      setSuccess(state);
      state.accessToken = action.payload;
    },
    getTokenFailed: setFailed,
    login: () => {
      // only used in sagas
    }
  }
});

export const {
  getUser,
  getUserSuccess,
  getUserFailed,
  setAccessToken,
  getToken,
  getTokenSuccess,
  getTokenFailed,
  login
} = authSlice.actions;

export default authSlice.reducer;
