import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import type { AliasOptions } from "vite";

const root = path.resolve(__dirname, "src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
});
