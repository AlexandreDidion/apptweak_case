import { RequestStatus } from "./requests";

export interface CommonReduxState {
  status: RequestStatus;
  error?: string;
}
