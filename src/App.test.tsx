import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { END } from "redux-saga";

import App from "./App";
import { AppStore, setupStore } from "./store/store";

// resilient to strict mode
function StoreProvider({ children }: React.PropsWithChildren) {
  const [store, setStore] = React.useState<AppStore | undefined>();
  React.useEffect(() => {
    const store = setupStore();
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setStore(store);
    // shuts down sagas on dismount
    return () => {
      store.dispatch(END);
    };
  }, []);

  return store && <Provider store={store}>{children}</Provider>;
}

test("renders learn react link", () => {
  render(<App />, { wrapper: StoreProvider });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
