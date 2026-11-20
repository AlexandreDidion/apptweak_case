/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // HOST comes from .env (127.0.0.1: Spotify rejects "localhost" redirect URIs)
  const { HOST } = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      host: HOST || "127.0.0.1",
      port: 3000,
      strictPort: true
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts"
    }
  };
});
