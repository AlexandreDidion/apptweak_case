import { UnknownAction } from "@reduxjs/toolkit";
import { useCallback, useEffect } from "react";

import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

import { useAppDispatch, useAppSelector } from "./hooks";
import type { RootState } from "./store";

interface UseReduxQueryOptions<TData> {
  /** Action that triggers the fetching saga. */
  action: () => UnknownAction;
  /** Selector for the data returned by the query. */
  selectData: (state: RootState) => TData;
  /** Must return a stable reference, e.g. the slice itself: (state) => state.whateverSlice */
  selectState: (state: RootState) => CommonReduxState;
}

export function useReduxQuery<TData>({
  action,
  selectData,
  selectState
}: UseReduxQueryOptions<TData>) {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  const { status, error } = useAppSelector(selectState);

  const refetch = useCallback(() => {
    dispatch(action());
  }, [dispatch, action]);

  useEffect(() => {
    refetch();
  }, [refetch]);

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
