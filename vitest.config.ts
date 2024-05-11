import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["__test__/setup.ts"],
    clearMocks: true,
    mockReset: true,
    coverage: {
      provider: "v8",
      enabled: true,
      exclude: [
        "**/node_modules/**",
        "**/typings/**",
        "**/public/**",
        "**/*.next/**",
        "next-env.d.ts",
        "*.config.*",
        "_app.*",
        "_document.*",
      ],
    },
    exclude: [
      "**/node_modules/**",
      "**/typings/**",
      "**/public/**",
      "**/*.next/**",
      "next-env.d.ts",
      "*.config.*",
      "_app.*",
      "_document.*",
    ],
  },
});
