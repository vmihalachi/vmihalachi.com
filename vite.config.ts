import { defineConfig } from "vite-plus";
import i18nPages from "./scripts/i18n.mjs";

export default defineConfig({
  // Builds one page per language (English at /, Italian at /it/, Romanian at /ro/) from
  // the index.html template and the strings in src/i18n/.
  plugins: [i18nPages()],
  build: {
    // The default CSS target (Baseline, Safari 16.4) lets the minifier rewrite
    // `max-width: 720px` as `width<=720px`, which Safari before 16.4 ignores: iPhones that
    // stop at iOS 15 (SE 1st generation, 6s, 7) would get the desktop layout. With Safari 15
    // in the target, the media queries keep their max-width form.
    cssTarget: ["chrome111", "edge111", "firefox114", "safari15", "ios15"],
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
