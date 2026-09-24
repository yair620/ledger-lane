# Ledger Lane — Cycle 1

Independent English-language information site about crypto payment routes, offer terms, deposits, withdrawals, verification records, and risk controls.

## Build

```bash
node scripts/serve.mjs
```

The command generates the static site in `public/`.

## Local server

```bash
node server.mjs
```

The local site is served at `http://127.0.0.1:4174/`.

## Verify

```bash
node scripts/verify.mjs
```

The verifier makes real HTTP requests for every HTML page and static asset, follows all internal local links, checks title/description/H1/canonical requirements, verifies affiliate hrefs, and confirms sitemap coverage.

## Cloudflare Pages settings

- Production branch: `main`
- Build command: `node scripts/serve.mjs`
- Build output directory: `public`

The deployment host must allow affiliate links. Update `SITE_URL` in `site.config.js` to the final HTTPS origin before building, then update the same value after the production domain is assigned.
