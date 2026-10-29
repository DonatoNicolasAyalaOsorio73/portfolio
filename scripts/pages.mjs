// The single list of built pages, shared by `check-dist.mjs`, the smoke tests and the parity
// script. A later story adds a page by adding one entry; the paths match what
// `href(key, locale)` in `src/i18n/routes.ts` builds.

/** @typedef {'en' | 'es'} Locale */
/** @typedef {{ key: string; paths: Record<Locale, string> }} Page */

/** The production origin; canonical and `hreflang` URLs are absolute on it (`site` in `astro.config.mjs`). */
export const SITE = 'https://donacode.link';

/** @type {readonly Locale[]} */
export const LOCALES = ['en', 'es'];

/** @type {readonly Page[]} */
export const PAGES = [{ key: 'home', paths: { en: '/', es: '/es/' } }];

/** The file a URL path builds to in `dist/` (`/` → `index.html`, `/es/` → `es/index.html`). */
export function distFile(/** @type {string} */ path) {
  const file = path.replace(/^\//, '');
  return file === '' || file.endsWith('/') ? `${file}index.html` : file;
}
