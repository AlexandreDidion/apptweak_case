import { ReactNode, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RequestStatus } from "@/types/requests";

import { selectAccessToken, selectAuthStatus, selectUser } from "../selectors";
import { getToken, getUser, login } from "../slice";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const authenticationStatus = useAppSelector(selectAuthStatus);
  const accessToken = useAppSelector(selectAccessToken);
  const user = useAppSelector(selectUser);

  const code = new URLSearchParams(window.location.search).get("code");

  useEffect(() => {
    if (accessToken) {
      dispatch(getUser());
    } else if (code) {
      dispatch(getToken(code));
    } else {
      dispatch(login());
    }
  }, [code, accessToken, dispatch]);

  // Waits for the user, not just the token: getUser sets the shared status back to pending,
  // which would unmount the app (and refetch everything) if it was already rendered
  if (user) return <>{children}</>;

  if (authenticationStatus === RequestStatus.ERROR) {
    return <p className="p-4">Authentication failed. Please check the console for more info.</p>;
  }

  return null;
}
