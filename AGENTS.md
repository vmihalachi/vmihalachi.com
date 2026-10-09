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
- The pre-commit hook (`.vite-hooks/pre-commit` → `vp staged`) runs `vp check --fix` on
  staged files.
- Lint rule `vite-plus/prefer-vite-plus-imports` is an error: import from `vite-plus`,
  not `vite` or `vitest`.

## Architecture

- The page is built in three languages from one template: English at `/` (also the
  `x-default`), Italian at `/it/`, and Romanian at `/ro/`.
  - `index.html` is the template. It holds all markup, nav, and SEO metadata (meta
    description, Open Graph, Twitter, and JSON-LD `Person`), with `{{ key }}` placeholders
    for every piece of text.
  - `src/i18n/en.json`, `it.json`, and `ro.json` hold the strings. Values are inserted
    as-is, so they may contain HTML (`<br />`, `<em>`, the counter `<span>`s).
  - `src/i18n/languages.json` lists the languages (code, name, path, `og:locale`). The
    first one is the default.
  - `scripts/i18n.mjs` is a Vite plugin that renders each language's page, serves `/it/`
    and `/ro/` in dev, and generates `sitemap.xml`. It also fills the `{{ page.* }}`
    placeholders: `lang`, canonical URL, `og:locale`, the `hreflang` alternates, and the
    language switcher links (`.lang-switch`).
  - The build fails, and `npm run check` runs the same validation, if a language is missing
    a key or has an extra one, a placeholder has no string, a string is unused, or a
    language renders different element IDs than English.

- `src/main.js` does three things:
  - Writes computed values into `#year`, `#microsoft-experience`, and
    `#professional-experience`. Microsoft tenure is counted from December 2019;
    professional experience is Microsoft years + 3.
  - Runs an `IntersectionObserver` that adds `.is-visible` to every
    `section:not(.hero)` and `.interest-card`.
  - Plays each `.project-art` drawing when it scrolls into view and resets it once it is
    fully off screen, so it plays again on the next visit: the mybackhurts card finishes
    its set of squats (rep 6 to 10), Deskling's parts plug in, and Sunny says its four
    lines, then dozes off. With reduced motion, the drawings stay in their still pose.
- The project drawings reuse each project's own art: the chair squat poses from the
  mybackhurts landing page, Deskling's mark, and Sunny from the sunnysays character
  sheet. Text inside them (exercise name, Deskling parts, Sunny's lines) comes from the
  strings files like any other copy.
- `src/style.css`:
  - Design tokens are CSS custom properties in `:root`.
  - Reveal animations apply only under the `.js` class, which the inline `<head>` script
    adds, so content stays visible without JS.
  - It has a `prefers-reduced-motion` override and a single mobile breakpoint at `720px`.
- `public/` is copied as-is: favicon, the self-hosted fonts (`public/fonts/`, declared in
  `src/fonts.css`, latin and latin-ext subsets from Google Fonts), `robots.txt`, the web manifest, and
  `staticwebapp.config.json`.
- Deployment runs through GitHub Actions to Azure Static Web Apps:
  - CI runs `npm ci && npm run check && npm run build` and uploads `dist/` with
    `skip_app_build: true`.
  - Pushes to `master` deploy to production; PRs get preview environments.

## Conventions and gotchas

- **Translations:** never put visible text directly in `index.html`. Add a placeholder and
  the same key to every `src/i18n/*.json` file. Markup changes happen once, in the template.
  Section IDs stay in English in every language so anchors work the same everywhere. To add
  a language, add it to `languages.json` and create its strings file.

- **CSP hash:** `public/staticwebapp.config.json` allows the inline `<head>` script by its
  SHA-256 hash, so any change to that script, including whitespace, needs a new hash.
  `scripts/check-csp.mjs` (part of `npm run check`) fails on a stale hash. Run
  `npm run csp:fix` to rewrite it. All languages share the template, so they share the hash.

  Any new external origin (fonts, images, scripts, fetch) must also be added to the CSP.

- When editing copy, keep the counter element IDs used by `main.js` in every language's
  strings. Their text is what no-JS visitors see, so keep those fallbacks current as well.
- Nav `href`s must match section `id`s.
- Section marks are numbered (`01 / {{ work.mark }}`, `02 / …`); the numbers live in the
  template, so renumber them there when sections change.
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

The code is a handful of files, so reading `index.html`, `src/main.js`, `src/style.css`,
and `scripts/` directly, or `rg`/`git grep`, is usually faster than search. Where
`jbcontext` is installed (Vlad's machine, not cloud sessions), one
`jbcontext search "<what the code does>"` is enough when you don't know where something
lives; the `context-search` skill and `context-explorer` agent are installed per user, not
in this repository. Session-start hooks keep the index fresh (`.claude/settings.json`,
`.codex/config.toml`).

## Vite+

`vp <name>` runs a built-in command (`vp dev`, `vp build`, `vp check`); `vp run <name>`
runs a `package.json` script, so check `package.json` first. `vp check` alone skips the CSP
and i18n checks, so use `npm run check`. Run `vp install` after pulling. Docs:
`node_modules/vite-plus/docs` or https://viteplus.dev/guide/.
