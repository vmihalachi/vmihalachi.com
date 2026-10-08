# AGENTS.md

Guidance for AI coding agents (Codex, Claude Code, GitHub Copilot, Junie) working in this
repository. This is the single source: `CLAUDE.md` imports it, and
`.github/copilot-instructions.md` points here.

Personal portfolio for vmihalachi.com: a single static page with no framework, built with
[Vite+](https://viteplus.dev/) (`vp`). The Vite+ section near the end covers the CLI (for
example, built-in commands compared with `vp run <script>`).

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

- There is no test suite. Skip the `vp test` step from the Vite+ checklist below. It
  exits 1 with "No test files found". `npm run check` is the validation step, and CI
  runs it before building.
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

Project skills live in `.agents/skills/` (Codex reads them there), and `.claude/skills/`
and `.junie/skills/` link to the same folders. If your agent doesn't load skills, read the
`SKILL.md` directly when the task matches:

- `add-project`: add a project to the Projects section (template, strings in every
  language, art, colors, and checks).
- `edit-copy`: change or add visible text in all three languages, within `PRODUCT.md`.
- `context-search`: semantic code search with `jbcontext` (optional, see below). It's
  managed by `jbcontext setup-agent`, so it lives as a plain copy in `.claude/skills/` and
  `.junie/skills/`.

## Notes on the generated sections below

The two sections below are generated by tools (`vp` and `jbcontext setup-agent`) and may be
rewritten by them, so the repo-specific overrides live here:

- **Vite+ checklist:** skip `vp test` (there are no tests). Use `npm run check`, which
  also runs the CSP and i18n checks that `vp check` alone does not.
- **jbcontext:** optional in this repo. The code is a handful of files, so
  reading `index.html`, `src/main.js`, `src/style.css`, and `scripts/` directly or using
  `rg`/`git grep` is usually faster. `jbcontext` is only installed on Vlad's machine and
  needs a JetBrains login; in cloud agents (Copilot coding agent, Codex cloud, Claude on
  the web) or whenever `jbcontext` is missing or unauthenticated, use `rg`/`git grep`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!-- jbcontext-instructions-start -->

# Tools

## Semantic Code Search (jbcontext)

You have access to `jbcontext search` for searching the codebase semantically.
Use the `/context-search` skill or run `jbcontext search "<query>"` to find code by meaning, not just keywords.

### Query Tips

- Be descriptive: "Where is a function that validates user email addresses" > "email"
- Include context: "Find error handling middleware for HTTP requests with logging"
- Specify what you're looking for: "React component that renders a modal dialog"

### When to use

`jbcontext search` is a **code-discovery** tool. Reach for it only when a task requires finding or understanding code whose location you don't already know.

Skip it — go straight to the right tool — when:

- the task names the exact file, class, or symbol (keyword grep is faster);
- the relevant file is already open or identified;
- the task doesn't involve locating code at all — git operations (rebase, merge, commit), running tests or builds, shell/statusline/config setup, or reviewing a diff you already have.

### How to use it

- Start with `jbcontext search` before planning, editing, or exact search in unfamiliar code when you do not yet know the right file, subsystem, implementation, or related test.
- Use one focused natural-language query per search.
- Do not start with grep, ripgrep, or find when the search problem is still semantic or exploratory.
- Inspect the first relevant file or directory before issuing another broad semantic search.
- Use another broad `jbcontext search` only if the local path stops being productive.
- Once you know the relevant file, symbol, or directory, switch to direct file reads or exact search for local inspection.
- If you search again after finding a relevant area, narrow with `-p <path>`.

<!-- jbcontext-instructions-end -->
