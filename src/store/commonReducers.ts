import { PayloadAction } from "@reduxjs/toolkit";

import { CommonReduxState } from "@/types/redux";
import { ErrorPayload, RequestStatus } from "@/types/requests";

/**
 * Case reducers shared by every slice extending CommonReduxState
 */
export function setPending(state: CommonReduxState) {
  state.status = RequestStatus.PENDING;
  state.error = undefined;
}

export function setSuccess(state: CommonReduxState) {
  state.status = RequestStatus.SUCCESS;
  state.error = undefined;
}

export function setFailed(state: CommonReduxState, action: PayloadAction<ErrorPayload>) {
  state.status = RequestStatus.ERROR;
  state.error = action.payload.message;
}
