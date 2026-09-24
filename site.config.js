// Single source of truth for the public origin and monetised destination.
// Cloudflare Pages serves each HTML file without its extension and 308-redirects
// the .html form, so canonicals, internal links and the sitemap must be extensionless.
export const SITE_URL = 'https://ledger-lane.pages.dev';
export const AFFILIATE_URL = 'https://gamdom.com/r/csgo2026';
export const SITE_NAME = 'Ledger Lane';

// Maps a generated file name to the URL path it is actually served at.
export const pagePath = (file) => (file === 'index.html' ? '/' : `/${file.replace(/\.html$/, '')}`);
export const canonicalFor = (file) => `${SITE_URL.replace(/\/$/, '')}${pagePath(file)}`;
