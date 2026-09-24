import { SITE_URL, AFFILIATE_URL, SITE_NAME } from './site.config.js';

export const nav = [
  ['Guides', '/guides.html'], ['Deposits', '/deposits.html'], ['Withdrawals', '/withdrawals.html'],
  ['Safety', '/safety.html'], ['FAQ', '/faq.html']
];

export const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function page({ title, description, slug, eyebrow = 'Ledger Lane / Field notes', body, active = '' }) {
  const canonical = `${SITE_URL}/${slug}`.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  const navLinks = nav.map(([label, href]) => `<a href="${href}" ${active === href ? 'aria-current="page"' : ''}>${label}</a>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${canonical}"><link rel="stylesheet" href="/styles.css"></head><body><a class="skip" href="#main">Skip to content</a><div class="topbar"><div class="shell"><span>Independent, source-led notes for adults who value a clean paper trail.</span><a href="/legal.html">Read the rules of engagement →</a></div></div><header class="nav"><div class="shell"><a class="brand" href="/"><span class="mark">LL</span>${SITE_NAME}</a><nav class="links" aria-label="Primary">${navLinks}<a class="button gold" href="${AFFILIATE_URL}" rel="sponsored noopener" target="_blank">Explore partner ↗</a></nav></div></header><main id="main"><div class="shell"><p class="crumbs">Field notes / ${escape(eyebrow)}</p>${body}</div></main><footer class="footer"><div class="shell"><div class="footer-grid"><div><a class="brand" href="/"><span class="mark">LL</span>${SITE_NAME}</a><p>A calm, independent guide to comparing crypto payment paths, reading the fine print, and making reversible decisions.</p></div><div><strong>Explore</strong>${nav.map(([l,h])=>`<a href="${h}">${l}</a>`).join('')}</div><div><strong>Good to know</strong><a href="/about.html">About this project</a><a href="/legal.html">Legal &amp; affiliate disclosure</a><a href="/sitemap.xml">Sitemap</a></div></div><p class="fine">© 2026 ${SITE_NAME}. This site is for adults only. Not financial, legal, or gambling advice. Never chase a promotion, deposit what you cannot afford to lose, or use borrowed money.</p></div></footer></body></html>`;
}

export const callout = (text, warning = false) => `<div class="callout ${warning ? 'warning' : ''}"><strong>${warning ? 'Slow down.' : 'Useful checkpoint.'}</strong> ${text}</div>`;
export const affiliate = (label = 'Check the current terms') => `<a class="affiliate" href="${AFFILIATE_URL}" rel="sponsored noopener" target="_blank">${label} ↗</a>`;
