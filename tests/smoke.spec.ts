import { expect, test, type Page as BrowserPage } from '@playwright/test';
import { LOCALES, PAGES, SITE } from '../scripts/pages.mjs';
import { href, routes, type RouteKey } from '../src/i18n/routes';

test('the page list matches the routes module', () => {
  // A route added to `routes.ts` without an entry in `pages.mjs` would get no coverage.
  expect(PAGES.map((page) => page.key).sort()).toEqual(Object.keys(routes).sort());
  for (const { key, paths } of PAGES) {
    for (const locale of LOCALES) {
      expect(paths[locale], `${key} (${locale})`).toBe(href(key as RouteKey, locale));
    }
  }
});

/** Loads `path` and records every request the page makes while loading. */
async function load(page: BrowserPage, path: string) {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  const response = await page.goto(path, { waitUntil: 'load' });
  return { response, requests };
}

for (const { key, paths } of PAGES) {
  for (const locale of LOCALES) {
    const path = paths[locale];

    test.describe(`${key} (${locale}) ${path}`, () => {
      test('answers 200 with a visible <h1>', async ({ page }) => {
        const { response } = await load(page, path);
        expect(response?.status(), `${path} status`).toBe(200);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('h1')).toBeVisible();
      });

      test('has a self-canonical and hreflang for en, es and x-default', async ({ page }) => {
        await load(page, path);
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical, `${path} canonical`).toHaveCount(1);
        await expect(canonical).toHaveAttribute('href', new URL(path, SITE).href);

        const expected = {
          en: new URL(paths.en, SITE).href,
          es: new URL(paths.es, SITE).href,
          'x-default': new URL(paths.en, SITE).href,
        };
        for (const [lang, href] of Object.entries(expected)) {
          const link = page.locator(`link[rel="alternate"][hreflang="${lang}"]`);
          await expect(link, `${path} hreflang="${lang}"`).toHaveCount(1);
          await expect(link, `${path} hreflang="${lang}"`).toHaveAttribute('href', href);
        }
      });

      for (const hash of ['', '#top']) {
        test(`handles a legacy ?lang=es link${hash ? ' with a #hash' : ''}`, async ({ page }) => {
          // An English page replaces itself with its Spanish twin; a Spanish page stays put.
          const target = paths.es + hash;
          await page.goto(`${path}?lang=es${hash}`, { waitUntil: 'commit' });
          if (locale === 'en') {
            await expect(page, `${path}?lang=es${hash} → ${target}`).toHaveURL(
              (url) => url.pathname + url.search + url.hash === target,
            );
          } else {
            await page.waitForLoadState('load');
            await expect(page).toHaveURL((url) => url.pathname === path && url.hash === hash);
          }
          await expect(page.locator('html')).toHaveAttribute('lang', 'es');
        });
      }

      test('leaves cookies, localStorage and sessionStorage empty', async ({ page, context }) => {
        await load(page, path);
        await page.waitForLoadState('networkidle');
        expect(await context.cookies(), `${path} cookies`).toEqual([]);
        const storage = await page.evaluate(() => ({
          localStorage: Object.keys(localStorage),
          sessionStorage: Object.keys(sessionStorage),
        }));
        expect(storage, `${path} storage`).toEqual({ localStorage: [], sessionStorage: [] });
      });

      test('requests only the preview origin', async ({ page, baseURL }) => {
        const { requests } = await load(page, path);
        await page.waitForLoadState('networkidle');
        // `data:` and `blob:` URLs never leave the browser.
        const foreign = requests.filter(
          (url) => !/^(data|blob):/.test(url) && new URL(url).origin !== new URL(baseURL!).origin,
        );
        expect(foreign, `${path} requested another host`).toEqual([]);
      });
    });
  }
}
