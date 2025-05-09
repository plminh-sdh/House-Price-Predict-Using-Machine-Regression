import { defineConfig, configDefaults } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      reporter: ["text", "lcov", "clover", "html"],
      exclude: [
        ...configDefaults.exclude,
        "**/*.services.ts",
        "**/WithInterceptor/index.tsx",
        "**/App.tsx",
        "**/env.ts",
        "**/vite-env.d.ts",
        "**/GlobalStyles.ts",
        "**/providers/**/*.tsx",
        "**/features/admin/services"
      ],
    },
    jsx: "react-jsx",
    include: ["**/*.test.tsx"],
    setupFiles: ["./tests/setupTests.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@admin": path.resolve(__dirname, "./src/features/admin"),
      "@auth": path.resolve(__dirname, "./src/features/auth"),
      "@client": path.resolve(__dirname, "./src/features/client"),
      "@env": path.resolve(__dirname, "./tests/env.ts"),
    },
  },
});
