// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** `https://donacode.link/es` → `https://donacode.link/es/`; `.html` URLs are left alone. */
function withIndexSlash(/** @type {string} */ url) {
  const parsed = new URL(url);
  if (!parsed.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(parsed.pathname)) {
    parsed.pathname += '/';
  }
  return parsed.href;
}

export default defineConfig({
  site: 'https://donacode.link',
  output: 'static',
  build: {
    // Each page file builds to the same path (`es/index.astro` → `es/index.html`), so the
    // URLs are `/`, `/es/` and the legacy `.html` ones (AD-5).
    format: 'preserve',
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } },
      // The 404 page is never indexed (AD-8).
      filter: (page) => !/\/404(\.html)?\/?$/.test(new URL(page).pathname),
      // With `format: 'preserve'` the integration lists `es/index.html` as `/es`, which 404s on
      // Pages; give extension-less URLs the trailing slash of the URL `routes.ts` builds.
      serialize: (item) => ({
        ...item,
        url: withIndexSlash(item.url),
        links: item.links?.map((link) => ({ ...link, url: withIndexSlash(link.url) })),
      }),
    }),
  ],
});
