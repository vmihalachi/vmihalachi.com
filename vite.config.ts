import { defineConfig } from "vite-plus";
import i18nPages from "./scripts/i18n.mjs";

export default defineConfig({
  // Builds one page per language (English at /, Italian at /it/, Romanian at /ro/) from
  // the index.html template and the strings in src/i18n/.
  plugins: [i18nPages()],
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
