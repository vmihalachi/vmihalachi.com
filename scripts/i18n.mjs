// Renders one static page per language from the index.html template and the strings in
// src/i18n/. The template uses {{ key }} placeholders: most come from src/i18n/<code>.json,
// and {{ page.* }} values are generated here from src/i18n/languages.json. Strings are
// inserted as-is, so they may contain HTML.
//
// Used as a Vite plugin (vite.config.ts) and, run directly, as a check that every language
// has the same keys and renders the same element IDs.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteUrl = "https://vmihalachi.com";
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(projectRoot, path), "utf8");

export const loadLanguages = () => JSON.parse(read("src/i18n/languages.json"));

// "/" → "index.html", "/it/" → "it/index.html"
const pageFile = (language) => `${language.path.slice(1)}index.html`;

const flatten = (strings, prefix = "") =>
  Object.entries(strings).flatMap(([key, value]) =>
    typeof value === "object" ? flatten(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value]],
  );

function pageValues(language, languages) {
  const url = (other) => `${siteUrl}${other.path}`;
  const others = languages.filter((other) => other !== language);
  return {
    "page.lang": language.code,
    "page.url": url(language),
    "page.locale": language.locale,
    "page.alternateLinks": [
      ...languages.map(
        (other) => `<link rel="alternate" hreflang="${other.code}" href="${url(other)}" />`,
      ),
      `<link rel="alternate" hreflang="x-default" href="${url(languages[0])}" />`,
    ].join("\n    "),
    "page.alternateLocales": others
      .map((other) => `<meta property="og:locale:alternate" content="${other.locale}" />`)
      .join("\n    "),
    "page.languageLinks": languages
      .map(
        (other) =>
          `<a href="${other.path}" hreflang="${other.code}" lang="${other.code}" ` +
          `aria-label="${other.name}"${other === language ? ' aria-current="page"' : ""}>` +
          `${other.code.toUpperCase()}</a>`,
      )
      .join("\n          "),
  };
}

// Renders every language from the template, or throws listing every problem found.
export function renderPages(template = read("index.html")) {
  const languages = loadLanguages();
  const problems = new Set();
  const strings = new Map(
    languages.map(({ code }) => [
      code,
      new Map(flatten(JSON.parse(read(`src/i18n/${code}.json`)))),
    ]),
  );

  const [main] = languages;
  const mainKeys = [...strings.get(main.code).keys()];
  for (const { code } of languages.slice(1)) {
    const keys = strings.get(code);
    for (const key of mainKeys) {
      if (!keys.has(key)) problems.add(`${code}.json is missing "${key}"`);
    }
    for (const key of keys.keys()) {
      if (!mainKeys.includes(key))
        problems.add(`${code}.json has "${key}", ${main.code}.json does not`);
    }
  }

  const used = new Set();
  const pages = new Map();
  for (const language of languages) {
    const values = new Map([
      ...strings.get(language.code),
      ...Object.entries(pageValues(language, languages)),
    ]);
    const html = template.replace(/{{\s*([\w.]+)\s*}}/g, (placeholder, key) => {
      used.add(key);
      if (values.has(key)) return values.get(key);
      // A key missing from a translation is already reported above.
      if (language === main || !mainKeys.includes(key)) {
        problems.add(`${language.code}.json has no string for ${placeholder}`);
      }
      return placeholder;
    });
    pages.set(language.code, html);
  }

  for (const key of mainKeys) {
    if (!used.has(key)) problems.add(`"${key}" is not used in index.html`);
  }

  // main.js and the nav anchors rely on the same IDs existing in every language.
  const ids = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]).join(" ");
  const mainIds = ids(pages.get(main.code));
  for (const { code } of languages.slice(1)) {
    if (ids(pages.get(code)) !== mainIds) {
      problems.add(`${code} renders different element IDs than ${main.code}`);
    }
  }

  if (problems.size > 0) throw new Error(`Translation problems:\n- ${[...problems].join("\n- ")}`);
  return { languages, pages };
}

function sitemap(languages) {
  const links = [
    ...languages.map(
      ({ code, path }) =>
        `    <xhtml:link rel="alternate" hreflang="${code}" href="${siteUrl}${path}" />`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${languages[0].path}" />`,
  ].join("\n");
  const urls = languages
    .map(({ path }) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n${links}\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export default function i18nPages() {
  // Only the main language's page exists on disk; the others are served from the template.
  const translatedPages = () =>
    new Map(
      loadLanguages()
        .slice(1)
        .map((language) => [resolve(projectRoot, pageFile(language)), language]),
    );

  return {
    name: "i18n-pages",
    enforce: "pre",

    config: () => ({
      build: {
        rollupOptions: {
          input: Object.fromEntries(
            loadLanguages().map((language) => [
              language.code,
              resolve(projectRoot, pageFile(language)),
            ]),
          ),
        },
      },
    }),

    resolveId(source) {
      const file = resolve(projectRoot, source);
      return translatedPages().has(file) ? file : null;
    },

    load(id) {
      return translatedPages().has(id) ? read("index.html") : null;
    },

    transformIndexHtml: {
      order: "pre",
      handler(html, { path }) {
        const { languages, pages } = renderPages(html);
        const dir = path.replace(/index\.html$/, "");
        const language = languages.find((candidate) => candidate.path === dir);
        if (!language) throw new Error(`No language is served at ${path}.`);
        return pages.get(language.code);
      },
    },

    configureServer(server) {
      // Serve /it/ and the other translated pages in dev, and reload when strings change.
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        const language = loadLanguages()
          .slice(1)
          .find(({ path }) => url === path || url === `${path}index.html`);
        if (!language) return next();
        try {
          const html = await server.transformIndexHtml(
            `${language.path}index.html`,
            read("index.html"),
          );
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
      server.watcher.on("change", (file) => {
        if (file.startsWith(resolve(projectRoot, "src/i18n")))
          server.ws.send({ type: "full-reload" });
      });
    },

    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(loadLanguages()) });
    },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    renderPages();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
