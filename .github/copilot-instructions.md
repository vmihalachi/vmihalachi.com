# Copilot instructions

Personal portfolio for vmihalachi.com: a single static page with no framework, built with
[Vite+](https://viteplus.dev/) (`vp`). See `AGENTS.md` for Vite+ CLI details (for example,
built-in commands compared with `vp run <script>`).

## Commands

Requires Node.js 24 (`.nvmrc`).

```sh
npm install
npm run dev      # vp dev
npm run check    # vp check (Oxfmt + type-aware Oxlint + type check) + CSP hash check
npm run csp:fix  # rewrite the CSP hash after editing the inline <head> script
npm run build    # vp build → dist/
npm run preview  # vp preview
```

- There is no test suite. Skip the `vp test` step from the `AGENTS.md` checklist. It
  exits 1 with "No test files found". `npm run check` is the validation step, and CI
  runs it before building.
- The pre-commit hook (`.vite-hooks/pre-commit` → `vp staged`) runs `vp check --fix` on
  staged files.
- Lint rule `vite-plus/prefer-vite-plus-imports` is an error: import from `vite-plus`,
  not `vite` or `vitest`.

## Architecture

- `index.html` contains all page content, nav, and SEO metadata (meta description,
  Open Graph, Twitter, and JSON-LD `Person`).
- `src/main.js` does only two things:
  - Writes computed values into `#year`, `#microsoft-experience`, and
    `#professional-experience`. Microsoft tenure is counted from December 2019;
    professional experience is Microsoft years + 3.
  - Runs an `IntersectionObserver` that adds `.is-visible` to every
    `section:not(.hero)` and `.interest-card`.
- `src/style.css`:
  - Design tokens are CSS custom properties in `:root`.
  - Reveal animations apply only under the `.js` class, which the inline `<head>` script
    adds, so content stays visible without JS.
  - It has a `prefers-reduced-motion` override and a single mobile breakpoint at `720px`.
- `public/` is copied as-is: favicon, `robots.txt`, `sitemap.xml`, the web manifest, and
  `staticwebapp.config.json`.
- Deployment runs through GitHub Actions to Azure Static Web Apps:
  - CI runs `npm ci && npm run check && npm run build` and uploads `dist/` with
    `skip_app_build: true`.
  - Pushes to `master` deploy to production; PRs get preview environments.

## Conventions and gotchas

- **CSP hash:** `public/staticwebapp.config.json` allows the inline `<head>` script by its
  SHA-256 hash, so any change to that script, including whitespace, needs a new hash.
  `scripts/check-csp.mjs` (part of `npm run check`) fails on a stale hash. Run
  `npm run csp:fix` to rewrite it.

  Any new external origin (fonts, images, scripts, fetch) must also be added to the CSP.

- When editing copy, keep the counter element IDs used by `main.js`. Their text in
  `index.html` is what no-JS visitors see, so keep those fallbacks current as well.
- Nav `href`s must match section `id`s.
- Section marks are numbered (`01 / WORK`, `02 / …`); renumber all of them together when
  sections change.
- External links use `target="_blank" rel="noopener noreferrer"`.
- Keep the meta description, `og:description`, and `twitter:description` identical. Update
  `public/sitemap.xml` if URLs change.
- Copy is first-person, specific, and restrained. Keep facts accurate and never invent
  credentials, projects, or claims.
