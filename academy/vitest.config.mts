import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Tests default to the node environment. Component tests opt into jsdom with
// a `// @vitest-environment jsdom` docblock at the top of the file.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx", "src/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    testTimeout: 20_000,
  },
  resolve: {
    alias: {
      "server-only": new URL("./tests/unit/server-only-stub.ts", import.meta.url).pathname,
    },
  },
});
