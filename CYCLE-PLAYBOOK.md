# Cycle playbook

Owned procedure for one publishing cycle. Every step is run by the agent in that cycle;
nothing here delegates the work to another agent.

## Identity rules

- One site per cycle, one unique subdomain of `cryptoguides.net` per site.
- The subdomain must be a short, readable English name that describes the site's subject
  (for example `paymentclarity`), never a sequence id such as `cycle-02`.
- Site name, subdomain, design language and content must describe the same identity.
- The apex `cryptoguides.net`, its A/MX/TXT records and its hosting are never modified.
  Only new records for new subdomains are created.
- Check availability before claiming a name: `nslookup -type=A <name>.cryptoguides.net 8.8.8.8`
  must answer "Non-existent domain".

## Per-cycle steps

1. Pick the next unused subdomain and confirm it is free (see above).
2. Build the site's own generator with its own design tokens, then generate:
   `node scripts/serve.mjs` (writes `public/`).
3. Verify locally before publishing: start `node server.mjs`, then
   `BASE_URL=http://127.0.0.1:4174/ node scripts/verify.mjs`. It must exit 0.
4. Create the Pages project through the Cloudflare MCP:
   `POST /accounts/{account_id}/pages/projects` with `{ name, production_branch: "main" }`.
5. Deploy the generated directory:
   `CLOUDFLARE_ACCOUNT_ID=<id> npx wrangler pages deploy public --project-name=<name> --branch=main --commit-dirty=true`.
6. Attach the custom domain through the MCP:
   `POST /accounts/{account_id}/pages/projects/{name}/domains` with `{ name: "<sub>.cryptoguides.net" }`.
7. Ensure the DNS record exists (see open dependency below), then wait for the domain
   status to leave `initializing`.
8. Set `SITE_URL` in `site.config.js` to `https://<sub>.cryptoguides.net`, regenerate,
   redeploy, and re-run step 3 against the custom domain.
9. Supersede the previous cycle: deploy a `_redirects` payload to the old Pages project so
   `/*` returns 301 to the live site, and keep its `robots.txt` at `Disallow: /`.
10. Report: live URL, deployment ids, page and affiliate counts, verification output, and
    any step that did not complete.

## Verification that must pass before reporting

- `node scripts/verify.mjs` against the live origin exits 0.
- Every internal route returns 200; no internal link points at a `.html` URL; no fragment
  link is dangling.
- Every canonical equals the served URL of its own page, and the sitemap lists exactly the
  published pages.
- `curl` reports `ssl_verify_result=0` for every checked URL.
- The affiliate destination responds and keeps its parameters
  (`https://gamdom.com/r/csgo2026` -> 302 -> `https://gamdom.com/?aff=csgo2026`).

## Open dependency

Step 7 needs one DNS record per subdomain in `cryptoguides.net`, which is served by Namecheap
BasicDNS (`dns1/dns2.registrar-servers.com`). The connected Cloudflare account holds no zone
for that domain, so the record must be created at Namecheap:

- either a one-time API key with `cryptoguides.net` whitelisted, which lets each cycle create
  its own CNAME record programmatically, or
- a signed-in Namecheap session in the browser, reused per cycle.

## Known limits

- No scheduler is exposed to the agent, so nothing here starts a new cycle on its own.
  The 120-minute cadence has to come from the client that runs the agent.
- `wrangler pages deploy` is a direct upload; these projects are not git-connected, so a
  push alone does not publish. The deploy command must run each cycle.
