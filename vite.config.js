import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/tv-planner-card.ts",
      formats: ["es"],
      fileName: () => "tv-planner-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
