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
Content-Security-Policy allows the inline script in `index.html` by its SHA-256 hash, so
if that script (including its whitespace) changes, update the hash too:

```sh
python3 -c "import re,hashlib,base64;s=open('dist/index.html').read();m=re.search(r'<script>(.*?)</script>',s,re.S).group(1);print(base64.b64encode(hashlib.sha256(m.encode()).digest()).decode())"
```
