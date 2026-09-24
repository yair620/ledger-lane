# Cycle 1 — Ledger Lane deployment report

Date: 2026-09-24

## Outcome

A complete English static information site was generated in `cycle-01-site` from independently written copy. It contains eight HTML pages, shared styling and a custom accessible SVG. The site passed real HTTP checks locally and through a temporary anonymous Vercel deployment.

- Local verification: passed (`node scripts/verify.mjs`)
- Public temporary deployment: `https://temporary-nimble-garnet-p0ak4zo.vercel.app`
- Public verification at report time: passed (`BASE_URL=https://temporary-nimble-garnet-p0ak4zo.vercel.app node scripts/verify.mjs`)
- Deployment lifetime: temporary and expires after about 60 minutes unless claimed
- Permanent custom domain: not acquired
- Permanent production deployment: not created because no authenticated Vercel account is connected

## Pages and metadata

1. `/` — home and disclosure
2. `/guides.html` — five-check decision guide
3. `/deposits.html` — deposit method/network/record checklist
4. `/withdrawals.html` — withdrawal and delay checklist
5. `/safety.html` — warning signals
6. `/faq.html` — six direct answers
7. `/about.html` — editorial posture
8. `/legal.html` — affiliate, adult-only, and risk disclosure

Each page has one H1, a unique title and description, a canonical, responsive navigation/footer, and internal links. `robots.txt` and `sitemap.xml` contain all eight pages. The configured origin is intentionally the placeholder `https://cycle-01.example` in `site.config.js`; it must be changed once the final domain is chosen.

## Affiliate placements

`https://gamdom.com/r/csgo2026` appears verbatim 15 times across the eight generated pages. Every occurrence has `rel="sponsored noopener"`; disclosures and risk warnings appear on the home, guides, deposit, withdrawal, FAQ, about, and legal pages. The URL is centralized as `AFFILIATE_URL` in `site.config.js`.

## Verification evidence

The verifier requested all eight pages and four supporting resources over HTTP. It also requested every local HTML/CSS/SVG destination discovered in those pages. It checked for one H1, a description, a canonical, exact sitemap coverage, and the affiliate URL. Summary:

- 8 HTML pages: HTTP 200
- Internal page, stylesheet, SVG, robots and sitemap requests: HTTP 200
- Internal-link errors: 0
- Canonical errors: 0
- Sitemap coverage errors: 0
- Affiliate href errors: 0
- Affiliate placements: 15

Browser inspection was also run at a 390 × 844 mobile viewport. There was no horizontal overflow, one H1 was present, the illustration had alternative text, and the browser console/network capture contained no errors. Screenshot compositing was unavailable in this desktop preview, so visual verification is based on the live accessibility tree, computed mobile layout, CSS review, and HTTP responses rather than a captured raster image.

## Domain attempts

### Freedomain.one (first)

The live search page loaded and `ledgerlane` was searched. The results offered paid domains such as `ledgerlane.ca` ($25), `.cc` ($34.95), `.tv` ($34.95), `.ai` ($99), `.biz` ($22.95), and `.us` ($14.95), with $0 setup fee. The common `.com`, `.net`, `.org`, `.eu`, `.co`, and `.info` variants were already taken. No zero-price claim was completed because the current search flow presented paid registrations, and registration would also require account, contact, and email verification data that was not connected.

### DigitalPlat FreeDomain

Repository documentation loaded and advertises suffixes including `.dpdns.org`, `.us.kg`, `.qzz.io`, `.xx.kg`, and `.qd.je`, plus a dashboard. Registration is account/dashboard based. No account or authenticated dashboard session was available, so no domain was reserved.

### DNSHE

The live client area loaded at a sign-in page with account registration and Google/GitHub login options. Repository documentation advertises `.de5.net`, `.us.ci`, `.cc.cd`, and `.bot.cd` with DNS/API support. No DNSHE account was connected, so no domain was reserved.

### Stackryze

Repository documentation loaded and advertises `.indevs.in`, `.sryze.cc`, `.ryzedns.org`, and `.nx.kg`. The live domain dashboard was protected by a Cloudflare human security challenge, so automated registration could not proceed. No account session was available.

### Other listed repositories

The remaining repositories are lists, source references, or provider directories rather than a verified unauthenticated allocation mechanism. They were not treated as proof that a free domain had been acquired. The primary requirement remains an authorized dashboard/API session from the owner.

## Hosting attempts

1. Authenticated Vercel production deploy failed: `No existing credentials found`; the CLI instructed authentication.
2. Vercel anonymous `--temporary` deploy succeeded and was fetched publicly: `https://temporary-nimble-garnet-p0ak4zo.vercel.app`.
3. The anonymous deployment is temporary and is not treated as a permanent public production release.
4. HTTPS worked for every tested temporary deployment URL, including home, all content pages, stylesheet, SVG, robots, and sitemap.
5. Canonical and sitemap values intentionally point to the central placeholder rather than the temporary Vercel hostname, because a temporary host must not become the site identity.

## Scheduling

No scheduler, cron service, persistent Mission trigger, or authenticated deployment connection is available in this environment. No 120-minute recurring task was registered. Creating a recurring workflow is outside the static-site project itself; this client Mission can run cycles, but it has not exposed a durable scheduler API.

## Exact one-time owner setup still required

1. Connect or sign in to the chosen free-domain dashboard (Freedomain, DigitalPlat, DNSHE, or Stackryze).
2. Complete account registration, email verification, any CAPTCHA, and the provider's identity/contact checks.
3. Claim a preferred available suffix/domain; ownership and renewal rules remain subject to that provider.
4. Sign in to Vercel or connect an authenticated Vercel token/CLI session.
5. Tell me the final domain and replace `SITE_URL` in `cycle-01-site/site.config.js`; regenerate with `node scripts/serve.mjs`.
6. Run the permanent Vercel deploy and add the domain in Vercel; configure the provider's required A/CNAME or nameserver records.
7. Wait for Vercel DNS validation and HTTPS issuance, then run `BASE_URL=https://<final-domain> node scripts/verify.mjs`.
8. Configure a real 120-minute scheduler that can invoke this Mission/project and retain its authentication.

## Grade

`GRADES spec=6 design=7 correctness=8 quality=7; biggest gap: no permanent domain or authenticated production deployment`
