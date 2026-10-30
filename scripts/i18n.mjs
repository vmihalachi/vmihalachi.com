// Renders each language's pages from the templates (index.html and 404.html) and the
// strings in src/i18n/. The templates use {{ key }} placeholders: most come from
// src/i18n/<code>.json, and {{ page.* }} values are generated here from
// src/i18n/languages.json. Strings are inserted as-is, so they may contain HTML.
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

// The page templates at the project root. Every language renders each one, and only the
// main language's pages exist on disk.
const templates = ["index.html", "404.html"];

// ("/", "index.html") → "index.html", ("/it/", "404.html") → "it/404.html"
const pageFile = (language, template) => `${language.path.slice(1)}${template}`;

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
    "page.home": language.path,
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

// Renders every template in every language as a Map of template → language code → HTML, or
// throws listing every problem found. `sources` can hold a template's HTML by file name;
// the others are read from disk.
export function renderPages(sources = {}) {
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

  // main.js and the nav anchors rely on the same IDs existing in every language.
  const ids = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]).join(" ");
  const used = new Set();
  const pages = new Map();
  for (const template of templates) {
    const source = sources[template] ?? read(template);
    const rendered = new Map();
    for (const language of languages) {
      const values = new Map([
        ...strings.get(language.code),
        ...Object.entries(pageValues(language, languages)),
      ]);
      const html = source.replace(/{{\s*([\w.]+)\s*}}/g, (placeholder, key) => {
        used.add(key);
        if (values.has(key)) return values.get(key);
        // A key missing from a translation is already reported above.
        if (language === main || !mainKeys.includes(key)) {
          problems.add(`${language.code}.json has no string for ${placeholder} in ${template}`);
        }
        return placeholder;
      });
      rendered.set(language.code, html);
    }
    const mainIds = ids(rendered.get(main.code));
    for (const { code } of languages.slice(1)) {
      if (ids(rendered.get(code)) !== mainIds) {
        problems.add(`${code} renders different element IDs than ${main.code} in ${template}`);
      }
    }
    pages.set(template, rendered);
  }

  for (const key of mainKeys) {
    if (!used.has(key)) problems.add(`"${key}" is not used in ${templates.join(" or ")}`);
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
  // Only the main language's pages exist on disk; the others are served from the templates.
  const translatedPages = () =>
    new Map(
      loadLanguages()
        .slice(1)
        .flatMap((language) =>
          templates.map((template) => [
            resolve(projectRoot, pageFile(language, template)),
            { language, template },
          ]),
        ),
    );

  return {
    name: "i18n-pages",
    enforce: "pre",

    config: () => ({
      build: {
        rollupOptions: {
          input: Object.fromEntries(
            loadLanguages().flatMap((language) =>
              templates.map((template) => [
                template === "index.html"
                  ? language.code
                  : `${language.code}-${template.slice(0, -5)}`,
                resolve(projectRoot, pageFile(language, template)),
              ]),
            ),
          ),
        },
      },
    }),

    resolveId(source) {
      const file = resolve(projectRoot, source);
      return translatedPages().has(file) ? file : null;
    },

    load(id) {
      const page = translatedPages().get(id);
      return page ? read(page.template) : null;
    },

    transformIndexHtml: {
      order: "pre",
      handler(html, { path }) {
        const slash = path.lastIndexOf("/") + 1;
        const template = path.slice(slash) || "index.html";
        if (!templates.includes(template)) throw new Error(`No page is built from ${path}.`);
        const { languages, pages } = renderPages({ [template]: html });
        const language = languages.find((candidate) => candidate.path === path.slice(0, slash));
        if (!language) throw new Error(`No language is served at ${path}.`);
        return pages.get(template).get(language.code);
      },
    },

    configureServer(server) {
      // Serve /it/, /it/404.html and the other translated pages in dev, and reload when
      // strings change.
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        const page = [...translatedPages().values()].find(
          ({ language, template }) =>
            url === `${language.path}${template}` ||
            (template === "index.html" && url === language.path),
        );
        if (!page) return next();
        try {
          const html = await server.transformIndexHtml(
            `${page.language.path}${page.template}`,
            read(page.template),
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
