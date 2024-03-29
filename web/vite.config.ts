import react from "@vitejs/plugin-react";
import * as path from "path";
import { defineConfig } from "vite";

import importToCDN, { autoComplete } from "vite-plugin-cdn-import";
import { visualizer } from "rollup-plugin-visualizer";
import VitePluginCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
      hashPrefix: "prefix",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: { outDir: "build" },
});
