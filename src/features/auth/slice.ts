import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ErrorPayload, RequestStatus } from "../../types/requests";

export interface User {
  userId?: string;
  userName?: string;
}

export interface AuthState {
  accessToken?: string;
  user?: User;
  status: RequestStatus;
  error?: string;
}

const initialState: AuthState = {
  status: RequestStatus.IDLE
};

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    getUser: (state) => {
      state.status = RequestStatus.PENDING;
    },
    getUserSuccess: (state, action: PayloadAction<User>) => {
      state.status = RequestStatus.SUCCESS;
      state.user = action.payload;
    },
    getUserFailed: (state, action: PayloadAction<ErrorPayload>) => {
      state.status = RequestStatus.ERROR;
      state.error = action.payload.message;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    getToken: (state, _action: PayloadAction<string>) => {
      state.status = RequestStatus.PENDING;
    },
    getTokenSuccess: (state, action: PayloadAction<string>) => {
      state.status = RequestStatus.SUCCESS;
      state.accessToken = action.payload;
    },
    getTokenFailed: (state, action: PayloadAction<string>) => {
      state.status = RequestStatus.ERROR;
      state.error = action.payload;
    },
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
