import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/main.ts",
      name: "random-table-generator",
      fileName: "random-table-generator",
    },
    rollupOptions: {
      external: ["vue", "@planarally/module-api"],
    },
  },
});
