# michaelpei.github.io (source)

Hexo source branch for https://michaelpei.com.

## Local development

```bash
nvm use
npm install
npm run serve
```

## Build

```bash
npm run clean
npm run build
```

Generated files are in `public/`.

## Deploy

Push to `source` branch; GitHub Actions will build and deploy to `master` branch automatically.
