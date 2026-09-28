# vmihalachi.com

Personal portfolio of Vlad Mihalachi — Senior Software Engineer at Microsoft.

## Development

Requires Node.js 24 (see `.nvmrc`). The project uses [Vite+](https://viteplus.dev/) (`vp`).

```sh
npm install
npm run dev      # start the dev server
npm run check    # format, lint and type check
npm run build    # build to dist/
npm run preview  # preview the production build
```

Static files served as-is (favicon, `robots.txt`, `sitemap.xml`, web manifest and the
Azure Static Web Apps config) live in `public/`.

## Deployment

Automated via GitHub Actions to Azure Static Web Apps. Pushes to `master` deploy to
production; pull requests get a preview environment.

Security headers and caching are configured in `public/staticwebapp.config.json`. The
Content-Security-Policy allows the inline script in `index.html` by its SHA-256 hash.
`npm run check` fails when the hash is stale, and `npm run csp:fix` rewrites it.
