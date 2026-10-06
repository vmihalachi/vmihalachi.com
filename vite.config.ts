import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    rollupOptions: {
      // One page per language: English at /, Italian at /it/, Romanian at /ro/.
      input: {
        en: "index.html",
        it: "it/index.html",
        ro: "ro/index.html",
      },
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
