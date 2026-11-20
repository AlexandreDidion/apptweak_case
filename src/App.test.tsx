import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { AppStore, setupStore } from "./store/store";
import { END } from "redux-saga";

// resilient to strict mode
function StoreProvider({ children }: React.PropsWithChildren) {
  const [store, setStore] = React.useState<AppStore | undefined>();
  React.useEffect(() => {
    const store = setupStore();
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
