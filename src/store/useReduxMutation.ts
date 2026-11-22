import { UnknownAction } from "@reduxjs/toolkit";
import { useCallback, useEffect, useEffectEvent, useRef } from "react";

import { CommonReduxState } from "@/types/redux";
import { RequestStatus } from "@/types/requests";

import { useAppDispatch, useAppSelector } from "./hooks";
import type { RootState } from "./store";

interface UseReduxMutationOptions<TPayload> {
  action: (payload: TPayload) => UnknownAction;
  selectState: (state: RootState) => CommonReduxState;
  onSuccess?: () => void;
  onError?: (error: string | undefined) => void;
}

/**
 * TanStack Query-like mutation on top of a slice: mutate() dispatches the action,
 * the saga does the work, and the request state comes back from the store.
 */
export function useReduxMutation<TPayload>({
  action,
  selectState,
  onSuccess,
  onError
}: UseReduxMutationOptions<TPayload>) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectState);

  const mutate = useCallback(
    (payload: TPayload) => {
      dispatch(action(payload));
    },
    [dispatch, action]
  );

  // Always calls the latest callbacks without re-running the effect below
  const onSettled = useEffectEvent((newStatus: RequestStatus) => {
    if (newStatus === RequestStatus.SUCCESS) onSuccess?.();
    if (newStatus === RequestStatus.ERROR) onError?.(error);
  });

  // Fire callbacks only when a request finishes (pending → success/error),
  // not for a success left in the store by an earlier request
  const previousStatusRef = useRef(status);
  useEffect(() => {
    if (previousStatusRef.current === RequestStatus.PENDING && status !== RequestStatus.PENDING) {
      onSettled(status);
    }
    previousStatusRef.current = status;
  }, [status]);

  return {
    mutate,
    error,
    status,
    isPending: status === RequestStatus.PENDING,
    isError: status === RequestStatus.ERROR,
    isSuccess: status === RequestStatus.SUCCESS
  };
}
