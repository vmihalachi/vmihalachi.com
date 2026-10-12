# vmihalachi.com

My portfolio :)

---

Available in English (`/`), Italian (`/it/`), and Romanian (`/ro/`). `index.html` is a
template with `{{ key }}` placeholders, and the strings for each language live in
`src/i18n/` (`en.json`, `it.json`, `ro.json`). A small Vite plugin (`scripts/i18n.mjs`)
renders one static page per language at build time and fails the build if a translation
is missing or out of sync.

## Development

Requires Node.js 24 (see `.nvmrc`). The project uses [Vite+](https://viteplus.dev/) (`vp`).

```sh
npm install
npm run dev      # start the dev server
npm run check    # format, lint and type check
npm run build    # build to dist/
npm run preview  # preview the production build
```

Static files served as-is (favicon, `robots.txt`, web manifest and the Cloudflare
`_headers` file) live in `public/`. `sitemap.xml` is generated at build time.

## Deployment

Automated via GitHub Actions (`.github/workflows/deploy.yml`) to Cloudflare Workers static
assets: `wrangler deploy` uploads `dist/` to the `vmihalachi-com` Worker (`wrangler.json`),
which serves `vmihalachi.com` with no Worker code and no logs. It needs the
`CLOUDFLARE_API_TOKEN` secret and the `CLOUDFLARE_ACCOUNT_ID` variable. Pushes to `master`
deploy to production; pull requests from this repository upload a preview version at
`pr-<number>-vmihalachi-com.<subdomain>.workers.dev` (the URL is in the job summary).
`www.vmihalachi.com` redirects to the apex through a Cloudflare redirect rule.

Security headers and caching are configured in `public/_headers`. The
Content-Security-Policy allows the inline script in `index.html` by its SHA-256 hash.
`npm run check` fails when the hash is stale, and `npm run csp:fix` rewrites it.

## License

The code is released under the [MIT License](LICENSE). The license doesn't cover the
site's content: the copy in `src/i18n/` and `PRODUCT.md`, and the VM wordmark, are
© Vlad Mihalachi, all rights reserved. If you reuse the code, replace the content with
your own.
