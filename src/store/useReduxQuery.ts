import { UnknownAction } from "@reduxjs/toolkit";
import { useCallback, useEffect, useEffectEvent } from "react";

import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

import { useAppDispatch, useAppSelector } from "./hooks";
import type { RootState } from "./store";

// actionPayload is required when the action creator needs a payload, optional otherwise
type PayloadOption<TPayload> = undefined extends TPayload
  ? { actionPayload?: TPayload }
  : { actionPayload: TPayload };

type UseReduxQueryOptions<TData, TPayload> = {
  /** Action that triggers the fetching saga, e.g. getPlaylists or getPlaylist */
  action: (payload: TPayload) => UnknownAction;
  /** Selector for the data returned by the query. */
  selectData: (state: RootState) => TData;
  /** Must return a stable reference, e.g. the slice itself: (state) => state.whateverSlice */
  selectState: (state: RootState) => CommonReduxState;
} & PayloadOption<TPayload>;

export function useReduxQuery<TData, TPayload>({
  action,
  actionPayload,
  selectData,
  selectState
}: UseReduxQueryOptions<TData, TPayload>) {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const { status, error } = useAppSelector(selectState);

  const refetch = useCallback(() => {
    console.log("Refetching with payload:", actionPayload);
    dispatch(action(actionPayload as TPayload));
  }, [dispatch, action, actionPayload]);

  // Like a TanStack Query key: refetch when the payload's value changes, not when an
  // inline object like { playlistId } is recreated on each render (that would loop)
  const payloadKey = JSON.stringify(actionPayload);
  const fetchOnChange = useEffectEvent(refetch);
  useEffect(() => {
    fetchOnChange();
  }, [action, payloadKey]);

  return {
    data,
    error,
    status,
    isLoading: status === RequestStatus.PENDING,
    isError: status === RequestStatus.ERROR,
    isSuccess: status === RequestStatus.SUCCESS,
    refetch
  };
}
