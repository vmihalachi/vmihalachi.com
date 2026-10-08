# Copilot instructions

The instructions for every agent working in this repository live in
[`AGENTS.md`](../AGENTS.md) at the repository root: commands, architecture, and
conventions. Read it before making changes.

Before changing any copy, also read [`PRODUCT.md`](../PRODUCT.md). It sets the voice and
the only facts that may be stated about Vlad.

The rules that matter most in review:

- `npm run check` is the validation step. There are no tests, so don't run `vp test`.
- Never put visible text in `index.html`. Use a `{{ key }}` placeholder and add the key to
  every `src/i18n/*.json` file.
- Any change to the inline `<head>` script needs `npm run csp:fix`, and any new external
  origin must be added to the CSP in `public/staticwebapp.config.json`.
- Never invent credentials, projects, metrics, or claims about Vlad.
