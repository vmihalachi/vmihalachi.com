# AGENTS.md

Guidance for AI coding agents (Codex, Claude Code, GitHub Copilot, Junie) working in this
repository. This is the single source: `CLAUDE.md` imports it, and
`.github/copilot-instructions.md` points here.

Personal portfolio for vmihalachi.com: a single static page with no framework, built with
[Vite+](https://viteplus.dev/) (`vp`, see _Vite+_ below).

**Before changing any copy, read `PRODUCT.md`.** It sets the voice, the audience, and the
only facts that may be stated about Vlad.

## Commands

Requires Node.js 24 (`.nvmrc`).

```sh
npm install
npm run dev      # vp dev
npm run check    # vp check (Oxfmt + type-aware Oxlint + type check) + CSP hash + i18n checks
npm run csp:fix  # rewrite the CSP hash after editing the inline <head> script
npm run build    # vp build → dist/
npm run preview  # vp preview
```

- There is no test suite, so never run `vp test` (it exits 1 with "No test files
  found"). `npm run check` is the validation step, and CI runs it before building.
- A Stop hook (`.claude/hooks/validate.py`, `validate.json`) runs `npm run check` when you
  edited source or content files; fix what it reports before ending.
- The pre-commit hook (`.vite-hooks/pre-commit` → `vp staged`) runs `vp check --fix` on
  staged files.
- Lint rule `vite-plus/prefer-vite-plus-imports` is an error: import from `vite-plus`,
  not `vite` or `vitest`.

## Architecture

- The site is built in three languages from two templates: English at `/` (also the
  `x-default`), Italian at `/it/`, and Romanian at `/ro/`.
  - `index.html` is the template. It holds all markup, nav, and SEO metadata (meta
    description, Open Graph, Twitter, and JSON-LD: the `Person` and the apps and Laching
    he made), with `{{ key }}` placeholders for every piece of text.
  - `404.html` is the not-found page's template, built the same way into `/404.html`,
    `/it/404.html` and `/ro/404.html`. Cloudflare serves the nearest one for a missing path.
  - `src/i18n/en.json`, `it.json`, and `ro.json` hold the strings. Values are inserted
    as-is, so they may contain HTML (`<br />`, the counter `<span>`s, and the `<span>`
    around "click." in `work.title`).
  - `src/i18n/languages.json` lists the languages (code, name, path, `og:locale`). The
    first one is the default.
  - `scripts/i18n.mjs` is a Vite plugin that renders each language's pages from both
    templates, serves `/it/`, `/ro/` and their `404.html` in dev, and generates
    `sitemap.xml`. It also fills the `{{ page.* }}` placeholders: `lang`, canonical URL,
    the language's home path, `og:locale`, the `hreflang` alternates, and the language
    switcher links (`.lang-switch`).
  - The build fails, and `npm run check` runs the same validation, if a language is missing
    a key or has an extra one, a placeholder has no string, a string is unused, or a
    language renders different element IDs than English (each template checked on its own).

- `src/main.js` does three things:
  - Writes computed values into `#year`, `#microsoft-experience`, and
    `#professional-experience`. Microsoft tenure is counted from December 2019;
    professional experience is Microsoft years + 3.
  - Runs an `IntersectionObserver` that adds `.is-visible` to every
    `section:not(.hero)` and `.interest-card`. Sections don't fade in: the class only
    starts the Work band's "click." and each interest drawing.
  - Plays each `.project-art` drawing when it scrolls into view and resets it once it is
    fully off screen, so it plays again on the next visit: the mybackhurts card finishes
    its set of squats (rep 6 to 10), Sunny says its four lines, then dozes off, Mister
    Pagliacci's panel drops open and he says his line, and the open-source crates drop
    in under the three apps' marks. With reduced motion, the drawings stay in their still pose.
- The project drawings reuse each project's own art: the chair squat poses from the
  mybackhurts landing page, Sunny from the sunnysays character sheet, and Mister
  Pagliacci's menu bar glyph (a line drawing, per his design doc). Text inside them
  (exercise name, Sunny's lines, Pagliacci's line) comes from the strings files and is
  translated like any other copy.
- `src/style.css`:
  - Design tokens are CSS custom properties in `:root`.
  - Type floor: no text outside the art below 16px (`--text-small`), running copy (paragraphs,
    facts, captions) at `--text-body` (1.1rem) or more, and text drawn inside the art at 14px or
    more. Secondary text stays secondary through color, never a smaller size, and keeps 4.5:1:
    `--ink-soft` on paper and the project tints, a darker soft ink in the see-through menu bar
    (the Work band can scroll under it), and `--accent-text`, not `--accent`, for accent text.
  - Nothing fades or slides in on scroll. What plays on arrival ("click.", the interest
    drawings, the project art) waits under the `.js` class, which the inline `<head>`
    script adds, so without JS everything shows at rest. Don't add scroll reveals to
    sections or cards.
  - It has a `prefers-reduced-motion` override and one mobile breakpoint at `720px`. A
    `359px` one after it only gives the menu bar's items less room (and their focus rings a
    smaller offset), so the bar keeps its two rows on the narrowest phones without shrinking
    the text. Below `314px` the bar can't hold
    two rows, so a last block only raises `scroll-padding-top` to clear the taller bar.
  - `build.cssTarget` in `vite.config.ts` includes Safari 15, so the built CSS keeps its media
    queries as `max-width`. Keep it: without it the minifier writes `width<=720px`, which
    Safari before 16.4 ignores, and iPhones stuck on iOS 15 lose the phone layout.
- `public/` is copied as-is: the favicon (`favicon.svg`, `favicon-96.png` rendered from it for Google Search, which
  reads only raster favicons, and `favicon.ico` rendered from it at 16,
  32 and 48 px for crawlers and old clients that probe that path), the self-hosted fonts (`public/fonts/`, declared in
  `src/fonts.css`, latin and latin-ext subsets: Fraunces and DM Mono from Google Fonts,
  Atkinson Hyperlegible Next, OFL, from the `@fontsource/atkinson-hyperlegible-next` npm
  package), `robots.txt`, the web manifest, and `_headers` (Cloudflare's response headers: CSP, HSTS, caching).
- Deployment runs through GitHub Actions (`.github/workflows/deploy.yml`) to Cloudflare Workers
  static assets:
  - CI runs `npm ci && npm run check && npm run build`, then `wrangler deploy` with `wrangler.json`
    (the `vmihalachi-com` Worker: `/it` redirects to `/it/`, a missing path gets the nearest
    `404.html`, no logs).
  - Pushes to `main` deploy to production; PRs from this repository upload a preview version
    (`wrangler versions upload --preview-alias pr-<number>`; the URL is in the job summary).
    Dependabot's PRs skip the preview, because its runs get no secrets.

## Conventions and gotchas

- **Translations:** never put visible text directly in a template (`index.html`,
  `404.html`). Add a placeholder and the same key to every `src/i18n/*.json` file. Markup
  changes happen once, in the template.
  Section IDs stay in English in every language so anchors work the same everywhere. To add
  a language, add it to `languages.json` and create its strings file.

- **CSP hash:** `public/_headers` allows the inline `<head>` script by its
  SHA-256 hash, so any change to that script, including whitespace, needs a new hash.
  `scripts/check-csp.mjs` (part of `npm run check`) fails on a stale hash. Run
  `npm run csp:fix` to rewrite it. All languages share the template, so they share the hash.

  Any new external origin (fonts, images, scripts, fetch) must also be added to the CSP.

- When editing copy, keep the counter element IDs used by `main.js` in every language's
  strings. Their text is what no-JS visitors see, so keep those fallbacks current as well.
- Nav `href`s must match section `id`s.
- No labels above headings: no section marks, eyebrows or numbering. Each section's `h2`
  is its visible heading.
- One accent word on the page: "click." in the Work band, which pops in the way it says.
  Other headings stay one color, with no `<em>` or highlighted `<span>`.
- External links use `target="_blank" rel="noopener noreferrer"`.
- The meta description, `og:description`, and `twitter:description` all use
  `{{ meta.description }}`, so they stay identical. The sitemap is generated from
  `languages.json`.
- Copy is first-person, specific, and restrained. Keep facts accurate and never invent
  credentials, projects, or claims.

## Skills

Project skills live in `.agents/skills/`; `.claude/skills/`, `.junie/skills/` and
`.github/skills/` link to them. If your agent doesn't load skills, read the `SKILL.md`
directly when the task matches:

- `add-project`: add a project to the Projects section (template, strings in every
  language, art, colors, and checks).
- `edit-copy`: change or add visible text in all three languages, within `PRODUCT.md`.

## Finding code

The code is a handful of files, so reading `index.html`, `src/main.js` and `scripts/`
directly, or `rg`/`git grep`, is the way to find things. `src/style.css` is about 1,800 lines
(`wc -l`), well past the 600 a whole read allows: `grep -n '^/\* \|^\.[a-z-]* {' src/style.css`
for its outline, then a range (the hook, `.claude/hooks/guard.py`, refuses a whole read).

## Vite+

`vp <name>` runs a built-in command (`vp dev`, `vp build`, `vp check`); `vp run <name>`
runs a `package.json` script, so check `package.json` first. `vp check` alone skips the CSP
and i18n checks, so use `npm run check`. Run `vp install` after pulling. Docs:
`node_modules/vite-plus/docs` or https://viteplus.dev/guide/.

## Sessions

One task per session: start a new one for unrelated work and hand off follow-ups instead of continuing here. Before searching for code you don't know the location of, use the `context-explorer` subagent (or `jbcontext search`) so the reads stay out of this context. Read big files by outline (`grep -n '^\(func\|class\|struct\|extension\|public\|##\)'`) and then a range, never whole; the hook refuses a whole read over 600 lines. `/compact` at a milestone in a long session.
