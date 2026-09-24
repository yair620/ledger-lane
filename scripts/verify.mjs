import { SITE_URL } from '../site.config.js';

const base = process.env.BASE_URL || 'http://127.0.0.1:4174/';
const publicOrigin = SITE_URL.replace(/\/$/, '');
const pages = ['index.html', 'guides.html', 'deposits.html', 'withdrawals.html', 'safety.html', 'faq.html', 'about.html', 'legal.html'];
const assets = ['styles.css', 'assets/ledger-orbit.svg', 'robots.txt', 'sitemap.xml'];
const errors = [];
let affiliatePlacements = 0;
for (const file of pages) {
  const response = await fetch(new URL(file, base));
  const html = await response.text();
  if (response.status !== 200) errors.push(`${file}: HTTP ${response.status}`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!canonical) errors.push(`${file}: canonical missing`);
  if (!description) errors.push(`${file}: description missing`);
  if ((html.match(/<h1/g) || []).length !== 1) errors.push(`${file}: expected exactly one h1`);
  const affiliateCount = (html.match(/href="https:\/\/gamdom\.com\/r\/csgo2026"/g) || []).length;
  affiliatePlacements += affiliateCount;
  for (const href of [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1])) {
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const target = href.split('#')[0];
    if (!/\.(html|css|svg|xml|txt)$/.test(target)) continue;
    const check = await fetch(new URL(target.slice(1), base));
    if (check.status !== 200) errors.push(`${file} -> ${target}: HTTP ${check.status}`);
  }
  console.log(`${file}: HTTP ${response.status}; canonical ${canonical}; affiliate ${affiliateCount}`);
}
for (const file of assets) {
  const response = await fetch(new URL(file, base));
  console.log(`${file}: HTTP ${response.status}; ${response.headers.get('content-type')}`);
  if (response.status !== 200) errors.push(`${file}: HTTP ${response.status}`);
}
const sitemap = await (await fetch(new URL('sitemap.xml', base))).text();
for (const file of pages) {
  const expected = file === 'index.html' ? `${publicOrigin}/` : `${publicOrigin}/${file}`;
  if (!sitemap.includes(expected)) errors.push(`sitemap missing ${expected}`);
}
console.log(`Summary: ${pages.length} HTML pages, ${affiliatePlacements} affiliate placements, ${(sitemap.match(/<url>/g) || []).length} sitemap entries`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
