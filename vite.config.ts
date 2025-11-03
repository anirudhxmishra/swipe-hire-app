import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import { webcrypto } from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
