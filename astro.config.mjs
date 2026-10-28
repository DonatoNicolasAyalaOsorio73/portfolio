// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://donacode.link',
  output: 'static',
  build: {
    format: 'file',
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
