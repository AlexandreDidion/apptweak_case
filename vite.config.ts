/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // HOST comes from .env (127.0.0.1: Spotify rejects "localhost" redirect URIs)
  const { HOST } = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        quoteStyle: "double",
        semicolons: false
      }),
      react(),
      tailwindcss()
    ],
    resolve: {
      // resolves the "@/*" alias from "paths" in tsconfig.json
      tsconfigPaths: true
    },
    server: {
      host: HOST || "127.0.0.1",
      port: 3000,
      strictPort: true,
      // opens http://<host>:3000, so the Spotify redirect URI matches
      open: true
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/setupTests.ts"
    }
  };
});
