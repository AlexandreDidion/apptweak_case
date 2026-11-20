import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import AuthProvider from "./containers/auth";
import { setupStore } from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const store = setupStore();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
