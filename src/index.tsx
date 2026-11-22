import "./index.css";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import AuthProvider from "./features/auth";
import { routeTree } from "./routeTree.gen";
import { setupStore } from "./store/store";

const router = createRouter({ routeTree });

// Makes <Link to>, params and navigate type-safe across the app
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found");
}
const root = ReactDOM.createRoot(container);

const store = setupStore();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* No page shows before auth succeeds */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
