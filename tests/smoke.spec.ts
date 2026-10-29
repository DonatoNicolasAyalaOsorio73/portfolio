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

      test('links the language switch to this page and its twin', async ({ page, context }) => {
        await load(page, path);
        const other = locale === 'en' ? 'es' : 'en';
        const header = page.locator('header[data-nav]');
        await expect(header).toHaveCount(1);
        await expect(page.locator('footer')).toHaveCount(1);
        const current = header.locator(`[data-lang-option="${locale}"]`);
        const twinLink = header.locator(`[data-lang-option="${other}"]`);
        await expect(current).toHaveAttribute('aria-current', 'true');
        await expect(current).toHaveAttribute('href', paths[locale]);
        await expect(twinLink).not.toHaveAttribute('aria-current', /.*/);
        await expect(twinLink).toHaveAttribute('href', paths[other]);

        await twinLink.click();
        await expect(page).toHaveURL((url) => url.pathname === paths[other]);
        await expect(page.locator('html')).toHaveAttribute('lang', other);
        expect(await context.cookies(), 'cookies after switching').toEqual([]);
        const storage = await page.evaluate(() => ({
          localStorage: Object.keys(localStorage),
          sessionStorage: Object.keys(sessionStorage),
        }));
        expect(storage, 'storage after switching').toEqual({
          localStorage: [],
          sessionStorage: [],
        });
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

test.describe('header scroll state', () => {
  test.use({ viewport: { width: 1280, height: 400 } });

  /** Makes the page tall enough that every `scrollTo` below lands exactly on its target. */
  async function addSpacer(page: BrowserPage) {
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.setAttribute('aria-hidden', 'true');
      spacer.style.height = '3000px';
      document.querySelector('main')!.append(spacer);
    });
  }

  /** Scrolls to `y` and waits for the scroll listener's next frame. */
  async function scrollTo(page: BrowserPage, y: number) {
    await page.evaluate(async (target) => {
      window.scrollTo({ top: target, behavior: 'instant' });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    }, y);
    expect(await page.evaluate(() => window.scrollY), `scrolled to ${y}`).toBe(y);
  }

  test('goes top → scrolled → hidden → scrolled, and focus reveals it', async ({ page }) => {
    await load(page, '/');
    await addSpacer(page);
    const header = page.locator('header[data-nav]');
    await expect(header).toHaveAttribute('data-nav-state', 'top');

    await scrollTo(page, 100);
    await expect(header).toHaveAttribute('data-nav-state', 'scrolled');

    await scrollTo(page, 300);
    await scrollTo(page, 600);
    await expect(header).toHaveAttribute('data-nav-state', 'hidden');

    await scrollTo(page, 560);
    await expect(header).toHaveAttribute('data-nav-state', 'scrolled');

    await scrollTo(page, 700);
    await expect(header).toHaveAttribute('data-nav-state', 'hidden');
    await header.locator('a').first().focus();
    await expect(header).toHaveAttribute('data-nav-state', 'scrolled');

    await scrollTo(page, 0);
    await expect(header).toHaveAttribute('data-nav-state', 'top');
  });

  test('shows the section links only on wide screens', async ({ page }) => {
    await load(page, '/');
    const links = page.locator('header[data-nav] a[href="/#work"]');
    await expect(links).toBeVisible();
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(links).toBeHidden();
    await expect(page.locator('header[data-nav] [data-lang-option="es"]')).toBeVisible();
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the header stays in its top state', async ({ page }) => {
      await load(page, '/');
      await addSpacer(page);
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(200);
      await expect(page.locator('header[data-nav]')).toHaveAttribute('data-nav-state', 'top');
      await expect(page.locator('header[data-nav] [data-lang-option="es"]')).toHaveAttribute(
        'href',
        '/es/',
      );
    });
  });
});

test.describe('statement sequence', () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

  /**
   * Scrolls so that `progress` of the sequence's scroll distance (height − viewport) has passed,
   * then waits for the scroll listener's next frame.
   */
  async function scrollSequence(page: BrowserPage, progress: number) {
    await page.evaluate(async (fraction) => {
      const section = document.querySelector<HTMLElement>('[data-seq]')!;
      const top = section.getBoundingClientRect().top + window.scrollY;
      const distance = section.offsetHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(top + fraction * distance), behavior: 'instant' });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    }, progress);
  }

  for (const [progress, state] of [
    [0, '0'],
    [0.6, '2'],
    [1, '3'],
  ] as const) {
    test(`is in state ${state} at progress ${progress}`, async ({ page }) => {
      await load(page, '/');
      await scrollSequence(page, progress);
      const section = page.locator('[data-seq]');
      await expect(section).toHaveAttribute('data-seq-state', state);
      const active = section.locator('[data-seq-item]').nth(Number(state));
      await expect(active).toHaveCSS('opacity', '1');
      await expect(section.locator('[data-seq-item]').nth(state === '0' ? 1 : 0)).toHaveCSS(
        'opacity',
        '0',
      );
    });
  }
});

/** Every statement, reveal and timeline step is in its final, fully visible state. */
async function expectAllShown(page: BrowserPage) {
  const statements = page.locator('[data-seq-item]');
  await expect(statements).toHaveCount(4);
  for (const statement of await statements.all()) {
    await expect(statement).toBeVisible();
    await expect(statement).toHaveCSS('opacity', '1');
    await expect(statement).toHaveCSS('transform', 'none');
  }
  // Stacked, not pinned: the section is only as tall as its content.
  await expect(page.locator('[data-seq] > *').first()).not.toHaveCSS('position', 'sticky');

  for (const reveal of await page.locator('[data-reveal]').all()) {
    // The featured cards and scenes are alternatives: one of them is `display: none`.
    if (!(await reveal.isVisible())) continue;
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS('opacity', '1');
  }

  const steps = page.locator('li[data-scene="pass"]');
  await expect(steps).toHaveCount(5);
  for (const step of await steps.all()) {
    await expect(step).toBeVisible();
    for (const part of await step.locator('.body > *').all()) {
      await expect(part).toHaveCSS('opacity', '1');
    }
  }
}

for (const locale of LOCALES) {
  const path = href('home', locale);

  test.describe(`home (${locale}) with reduced motion`, () => {
    test.use({ reducedMotion: 'reduce' });

    test('shows every statement and step', async ({ page }) => {
      await load(page, path);
      await expectAllShown(page);
    });
  });

  test.describe(`home (${locale}) without JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test('shows every statement and step', async ({ page }) => {
      await load(page, path);
      await expectAllShown(page);
    });
  });
}

test.describe('philosophy scenes', () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

  /** The legacy `seg()` windows and cubic in-out `ease()` from `tick()`. */
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const seg = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

  /** Reads the step's progress properties and its own `pass` progress after the next frame. */
  async function readStep(page: BrowserPage, index: number) {
    return page.evaluate(async (i) => {
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
      const step = document.querySelectorAll<HTMLElement>('li[data-scene="pass"]')[i]!;
      const rect = step.getBoundingClientRect();
      const vh = window.innerHeight;
      const style = getComputedStyle(step);
      return {
        p: (vh - rect.top) / (vh + rect.height),
        a: style.getPropertyValue('--a').trim(),
        b: style.getPropertyValue('--b').trim(),
        c: style.getPropertyValue('--c').trim(),
      };
    }, index);
  }

  test('a step below the fold starts undrawn', async ({ page }) => {
    await load(page, '/');
    const step = await readStep(page, 2);
    expect(Number(step.a)).toBe(0);
  });

  test('a step halfway through its pass follows the eased windows', async ({ page }) => {
    await load(page, '/');
    await page.evaluate(() => {
      const step = document.querySelectorAll<HTMLElement>('li[data-scene="pass"]')[2]!;
      const rect = step.getBoundingClientRect();
      const vh = window.innerHeight;
      // p = (vh − top) ÷ (vh + height) = 0.5  ⇒  top = vh − 0.5 × (vh + height).
      const targetTop = vh - 0.5 * (vh + rect.height);
      window.scrollTo({ top: rect.top + window.scrollY - targetTop, behavior: 'instant' });
    });
    const step = await readStep(page, 2);
    expect(step.p).toBeGreaterThan(0.45);
    expect(step.p).toBeLessThan(0.55);
    const expected = {
      a: seg(step.p, 0.04, 0.38),
      b: seg(step.p, 0.28, 0.66),
      c: seg(step.p, 0.5, 0.82),
    };
    for (const name of ['a', 'b', 'c'] as const) {
      const value = Number(step[name]);
      expect(Number.isNaN(value), `--${name} is a number (${step[name]})`).toBe(false);
      expect(value, `--${name}`).toBeGreaterThanOrEqual(0);
      expect(value, `--${name}`).toBeLessThanOrEqual(1);
      expect(value, `--${name} at p=${step.p}`).toBeCloseTo(expected[name], 2);
    }
  });
});

test.describe('work section, wide scenes', () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

  /** Scrolls the first featured scene to `progress` of its pinned distance and reads it. */
  async function readScene(page: BrowserPage, progress: number) {
    return page.evaluate(async (fraction) => {
      const scene = document.querySelector<HTMLElement>('[data-scene="sticky"]')!;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      const distance = scene.offsetHeight - window.innerHeight;
      window.scrollTo({ top: Math.round(top + fraction * distance), behavior: 'instant' });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
      const centre = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width };
      };
      const stage = scene.querySelector('[data-stage]')!;
      return {
        a: Number(getComputedStyle(scene).getPropertyValue('--a')),
        stage: centre(stage),
        stagePosition: getComputedStyle(stage).position,
        logo: centre(scene.querySelector('[data-logo]')!),
        target: centre(scene.querySelector('[data-logo-target]')!),
        text: Number(getComputedStyle(scene.querySelector('.text')!).opacity),
        shot: Number(getComputedStyle(scene.querySelector('figure')!).opacity),
      };
    }, progress);
  }

  test('pins three scenes in legacy order and hides the narrow cards', async ({ page }) => {
    await load(page, '/');
    const scenes = page.locator('[data-scene="sticky"]');
    await expect(scenes).toHaveCount(3);
    await expect(scenes.locator('h3')).toHaveText(['NariñoHoy', 'Steady Guardians', 'EcoBike']);
    await expect(page.locator('#work [data-reveal="parts"]').first()).toBeHidden();
  });

  test('reveals the heading and intro once in view', async ({ page }) => {
    await load(page, '/');
    const head = page.locator('#work [data-reveal=""]');
    await expect(head).toHaveCount(1);
    await expect(head).toHaveCSS('opacity', '0');
    await head.scrollIntoViewIfNeeded();
    await expect(head).toHaveAttribute('data-reveal-state', 'visible');
    await expect(head).toHaveCSS('opacity', '1');
  });

  test('starts with the logo centred and large, text and shot hidden', async ({ page }) => {
    await load(page, '/');
    const scene = await readScene(page, 0);
    expect(scene.stagePosition).toBe('sticky');
    expect(scene.a).toBe(0);
    expect(Math.abs(scene.logo.x - scene.stage.x)).toBeLessThan(1);
    expect(Math.abs(scene.logo.y - scene.stage.y)).toBeLessThan(1);
    expect(scene.logo.width).toBeGreaterThan(scene.target.width * 2);
    expect(scene.text).toBe(0);
    expect(scene.shot).toBe(0);
  });

  test('ends with the logo in its slot at slot size, text and shot in place', async ({ page }) => {
    await load(page, '/');
    const scene = await readScene(page, 0.9);
    expect(scene.a).toBe(1);
    expect(Math.abs(scene.logo.x - scene.target.x)).toBeLessThan(1);
    expect(Math.abs(scene.logo.y - scene.target.y)).toBeLessThan(1);
    expect(Math.abs(scene.logo.width - scene.target.width)).toBeLessThan(1);
    expect(scene.text).toBe(1);
    expect(scene.shot).toBe(1);
  });

  test('opens every external link in a new tab with rel="noopener"', async ({ page }) => {
    await load(page, '/');
    const links = page.locator('#work a[href^="http"]');
    // 1 + 1 + 2 featured actions, twice (scenes and cards), and 2 in the grid.
    await expect(links).toHaveCount(10);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
    }
  });
});

test.describe('work section, narrow cards', () => {
  test.use({ viewport: { width: 375, height: 800 }, reducedMotion: 'no-preference' });

  test('stacks the featured projects as cards that reveal in view', async ({ page }) => {
    await load(page, '/');
    await expect(page.locator('[data-scene="sticky"]').first()).toBeHidden();
    const cards = page.locator('#work [data-reveal="parts"]');
    await expect(cards).toHaveCount(3);
    const card = cards.first();
    await expect(card.locator('[data-reveal-part="pop"]')).toHaveCSS('opacity', '0');
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveAttribute('data-reveal-state', 'visible');
    await expect(card.locator('[data-reveal-part="pop"]')).toHaveCSS('opacity', '1');
    await expect(card.locator('[data-reveal-part="rise"]')).toHaveCSS('opacity', '1');
  });
});

test.describe('work section, other projects', () => {
  test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

  test('reveal together with a 0 / 110 / 220 ms stagger', async ({ page }) => {
    await load(page, '/');
    const others = page.locator('#work [data-reveal="far"]');
    await expect(others).toHaveCount(3);
    await expect(others.locator('h4')).toHaveText([
      'Centro de Estudios Andino',
      'Siesa MES',
      'Cognitios',
    ]);
    for (const [index, delay] of ['0s', '0.11s', '0.22s'].entries()) {
      // One value, or the same value for both opacity and transform.
      await expect(others.nth(index)).toHaveCSS(
        'transition-delay',
        new RegExp(`^${delay}(, ${delay})?$`),
      );
    }
    await others.first().scrollIntoViewIfNeeded();
    for (const other of await others.all()) {
      await expect(other).toHaveAttribute('data-reveal-state', 'visible');
      await expect(other).toHaveCSS('opacity', '1');
    }
  });

  test('a logo tilts toward the pointer and eases back on leave', async ({ page }) => {
    await load(page, '/');
    const logo = page.locator('#work [data-tilt]').first();
    await logo.scrollIntoViewIfNeeded();
    const box = (await logo.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15);
    await expect(logo).toHaveAttribute('data-tilt-state', 'active');
    await expect(logo).not.toHaveCSS('transform', 'none');
    await page.mouse.move(0, 0);
    await expect(logo).toHaveAttribute('data-tilt-state', 'idle');
    await expect(logo).toHaveCSS('transform', 'none');
  });
});

test.describe('work section on a touch device', () => {
  test.use({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true });

  test('does not tilt the logos', async ({ page }) => {
    await load(page, '/');
    const logo = page.locator('#work [data-tilt]').first();
    await logo.scrollIntoViewIfNeeded();
    const box = (await logo.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
    await expect(logo).not.toHaveAttribute('data-tilt-state', 'active');
    await expect(logo).toHaveCSS('transform', 'none');
  });
});

/** The work section in its final state: nothing pinned, hidden or tilted. */
async function expectWorkShown(page: BrowserPage) {
  await page.setViewportSize({ width: 1280, height: 800 });
  const scenes = page.locator('[data-scene="sticky"]');
  await expect(scenes).toHaveCount(3);
  for (const scene of await scenes.all()) {
    await expect(scene.locator('[data-stage]')).not.toHaveCSS('position', 'sticky');
    const height = await scene.evaluate((el) => (el as HTMLElement).offsetHeight);
    expect(height, 'scene is not a 300vh track').toBeLessThan(800 * 2);
    await expect(scene.locator('[data-logo-target] img')).toBeVisible();
    await expect(scene.locator('[data-logo]')).toBeHidden();
    await expect(scene.locator('.text')).toHaveCSS('opacity', '1');
    await expect(scene.locator('figure')).toHaveCSS('opacity', '1');
  }

  const others = page.locator('#work [data-reveal="far"]');
  for (const other of await others.all()) {
    await expect(other).toHaveCSS('opacity', '1');
    await expect(other).toHaveCSS('transform', 'none');
    // The logo row rests in place: no parallax offset.
    await expect(other.locator('.float')).toHaveCSS(
      'transform',
      /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/,
    );
  }
  const logo = page.locator('#work [data-tilt]').first();
  await logo.scrollIntoViewIfNeeded();
  const box = (await logo.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
  await expect(logo).toHaveCSS('transform', 'none');

  await page.setViewportSize({ width: 375, height: 800 });
  const cards = page.locator('#work [data-reveal="parts"]');
  await expect(cards).toHaveCount(3);
  for (const card of await cards.all()) {
    await expect(card.locator('[data-reveal-part="pop"]')).toHaveCSS('opacity', '1');
    await expect(card.locator('[data-reveal-part="pop"]')).toHaveCSS('transform', 'none');
    await expect(card.locator('[data-reveal-part="rise"]')).toHaveCSS('opacity', '1');
    await expect(card.locator('[data-reveal-part="rise"]')).toHaveCSS('transform', 'none');
  }
}

for (const locale of LOCALES) {
  const path = href('home', locale);

  test.describe(`work (${locale}) with reduced motion`, () => {
    test.use({ reducedMotion: 'reduce' });

    test('shows every project in place, unpinned and untilted', async ({ page }) => {
      await load(page, path);
      await expectWorkShown(page);
    });
  });

  test.describe(`work (${locale}) without JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test('shows every project in place, unpinned and untilted', async ({ page }) => {
      await load(page, path);
      await expectWorkShown(page);
    });
  });
}
