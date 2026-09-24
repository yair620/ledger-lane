import { SITE_URL, pagePath, canonicalFor } from '../site.config.js';
import { readFile } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://127.0.0.1:4174/';
const pages = ['index.html', 'guides.html', 'deposits.html', 'withdrawals.html', 'safety.html', 'faq.html', 'about.html', 'legal.html'];
const assets = ['styles.css', 'assets/ledger-orbit.svg', 'robots.txt', 'sitemap.xml'];
const errors = [];
let affiliatePlacements = 0;
let internalLinks = 0;
let fragmentLinks = 0;

const url = (path) => new URL(path.replace(/^\//, ''), base).href;

for (const file of pages) {
  const path = pagePath(file);
  const response = await fetch(url(path));
  const html = await response.text();
  if (response.status !== 200) errors.push(`${file}: HTTP ${response.status}`);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!canonical) errors.push(`${file}: canonical missing`);
  else if (canonical !== canonicalFor(file)) errors.push(`${file}: canonical ${canonical} != ${canonicalFor(file)}`);
  if (!description) errors.push(`${file}: description missing`);
  if ((html.match(/<h1/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  if (!/<html lang="[a-z-]+">/.test(html)) errors.push(`${file}: missing html lang`);

  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  for (const schemaMatch of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(schemaMatch[1]);
    } catch {
      errors.push(`${file}: invalid JSON-LD`);
    }
  }

  affiliatePlacements += (html.match(/href="https:\/\/gamdom\.com\/r\/csgo2026"/g) || []).length;

  for (const href of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])) {
    if (href.startsWith('#')) {
      fragmentLinks += 1;
      if (!ids.has(href.slice(1))) errors.push(`${file}: dangling fragment ${href}`);
      continue;
    }
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    if (/\.html([?#]|$)/.test(href)) errors.push(`${file}: links to redirecting .html URL ${href}`);
    const target = href.split('#')[0].split('?')[0];
    internalLinks += 1;
    if (!/\.(css|svg|xml|txt|js)$/.test(target) && !pages.some((candidate) => pagePath(candidate) === target)) {
      errors.push(`${file}: unknown internal route ${href}`);
      continue;
    }
    const check = await fetch(url(target));
    if (check.status !== 200) errors.push(`${file} -> ${target}: HTTP ${check.status}`);
  }

  console.log(`${file}: HTTP ${response.status}; canonical ${canonical}; affiliate ${(html.match(/href="https:\/\/gamdom\.com\/r\/csgo2026"/g) || []).length}`);
}

for (const file of assets) {
  const response = await fetch(url(file));
  console.log(`${file}: HTTP ${response.status}; ${response.headers.get('content-type')}`);
  if (response.status !== 200) errors.push(`${file}: HTTP ${response.status}`);
}

const sitemap = await (await fetch(url('sitemap.xml'))).text();
for (const file of pages) {
  if (!sitemap.includes(`<loc>${canonicalFor(file)}</loc>`)) errors.push(`sitemap missing <loc>${canonicalFor(file)}</loc>`);
}
const sitemapEntries = (sitemap.match(/<url>/g) || []).length;
if (sitemapEntries !== pages.length) errors.push(`sitemap has ${sitemapEntries} entries, expected ${pages.length}`);

const robots = await (await fetch(url('robots.txt'))).text();
if (!robots.includes(`Sitemap: ${SITE_URL.replace(/\/$/, '')}/sitemap.xml`)) errors.push('robots.txt does not advertise the sitemap');

const generated = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
if (generated.includes('cycle-01.example')) errors.push('placeholder origin still present in the generated output');

if (!affiliatePlacements) errors.push('no affiliate placements found');
console.log(`Summary: ${pages.length} HTML pages, ${affiliatePlacements} affiliate placements, ${internalLinks} internal asset/route links, ${fragmentLinks} fragment links, ${sitemapEntries} sitemap entries`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('All checks passed.');
