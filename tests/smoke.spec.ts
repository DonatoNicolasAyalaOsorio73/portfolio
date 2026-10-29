import { expect, test, type Page as BrowserPage } from '@playwright/test';
import { LOCALES, PAGES, SITE } from '../scripts/pages.mjs';
import { t } from '../src/i18n';
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

/** Scrolls the featured scene holding `id`'s button to its settled end, where it is in place. */
async function settleScene(page: BrowserPage, id: string) {
  await page.evaluate(async (projectId) => {
    const button = document.querySelector(`[data-scene="sticky"] [data-arch-open="${projectId}"]`);
    const scene = button?.closest<HTMLElement>('[data-scene="sticky"]');
    if (!scene) return;
    const top = scene.getBoundingClientRect().top + window.scrollY;
    const distance = scene.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(top + 0.9 * distance), behavior: 'instant' });
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  }, id);
}

/** Opens `id`'s dialog from its visible "View architecture" button and returns both. */
async function openArch(page: BrowserPage, id: string) {
  await settleScene(page, id);
  const button = page.locator(`#work [data-arch-open="${id}"]:visible`);
  await expect(button).toHaveCount(1);
  await button.click();
  const dialog = page.locator(`dialog[data-arch="${id}"]`);
  await expect(dialog).toBeVisible();
  return { button, dialog };
}

/**
 * Where keyboard focus is relative to `id`'s dialog: on its last control, elsewhere inside it,
 * on `body` (focus has left the page for the browser chrome), or on a page element outside it.
 */
function focusPlace(page: BrowserPage, id: string) {
  return page.evaluate((projectId) => {
    const dialog = document.querySelector(`dialog[data-arch="${projectId}"]`)!;
    const active = document.activeElement;
    if (!active || active === document.body) return 'body';
    if (!dialog.contains(active)) return 'outside';
    const controls = dialog.querySelectorAll('button');
    return active === controls[controls.length - 1] ? 'last' : 'inside';
  }, id);
}

for (const locale of LOCALES) {
  const path = href('home', locale);
  const arch = t(locale).work.architecture;
  const ecobike = arch.projects.find((entry) => entry.id === 'ecobike')!;

  test.describe(`architecture dialog (${locale})`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

    test('opens EcoBike with the first node selected, Close focused, the page inert', async ({
      page,
    }) => {
      await load(page, path);
      const { dialog } = await openArch(page, 'ecobike');
      expect(await dialog.evaluate((el) => el.matches(':modal'))).toBe(true);
      await expect(dialog).toHaveAttribute('data-arch-state', 'in');
      await expect(dialog).toHaveAttribute('data-arch-node', '0');
      await expect(dialog.locator('.eyebrow')).toHaveText(arch.eyebrow);
      await expect(dialog.locator('h2')).toHaveText(`EcoBike${arch.titleSuffix}`);
      await expect(dialog.locator('[data-arch-close]')).toBeFocused();
      const nodes = dialog.locator('[data-arch-select]');
      await expect(nodes).toHaveCount(ecobike.nodes.length);
      await expect(nodes.first()).toHaveAttribute('aria-pressed', 'true');
      await expect(dialog.locator('.pane:visible')).toHaveCount(1);
      await expect(dialog.locator('.pane:visible')).toContainText(ecobike.nodes[0]!.label);
      await expect(dialog.locator('.panel')).toHaveCSS('opacity', '1');
      await expect(page.locator('html')).toHaveCSS('overflow-y', 'hidden');

      // The page behind does not scroll.
      const scrollY = await page.evaluate(() => window.scrollY);
      await page.mouse.move(640, 5);
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    });

    test('selects node 3 and shows its detail', async ({ page }) => {
      await load(page, path);
      const { dialog } = await openArch(page, 'ecobike');
      const nodes = dialog.locator('[data-arch-select]');
      await nodes.nth(2).click();
      await expect(dialog).toHaveAttribute('data-arch-node', '2');
      for (const [index, node] of (await nodes.all()).entries()) {
        await expect(node).toHaveAttribute('aria-pressed', String(index === 2));
      }
      await expect(nodes.nth(2)).toHaveCSS('border-color', 'rgb(111, 168, 255)');
      const pane = dialog.locator('.pane:visible');
      await expect(pane).toHaveCount(1);
      const third = ecobike.nodes[2]!;
      await expect(pane).toContainText(third.label);
      await expect(pane).toContainText(third.role);
      await expect(pane).toContainText(third.tech);
      await expect(dialog.locator('[aria-live="polite"]')).toHaveCount(1);
    });

    test('advances the flow from step 1 to step 2', async ({ page }) => {
      await load(page, path);
      const { dialog } = await openArch(page, 'ecobike');
      const flow = dialog.locator('[data-flow]');
      const white = 'rgb(255, 255, 255)';
      await expect(flow).toHaveAttribute('data-flow-state', '0');
      await expect(flow.locator('.step').first()).toHaveCSS('background-color', white);
      await page.waitForTimeout(1500);
      await expect(flow).toHaveAttribute('data-flow-state', '1');
      await expect(flow.locator('.step').nth(1)).toHaveCSS('background-color', white);
    });

    test('Escape closes and returns focus to the opening button', async ({ page }) => {
      await load(page, path);
      const { button, dialog } = await openArch(page, 'ecobike');
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveAttribute('data-arch-state', 'closed');
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
      await expect(page.locator('html')).not.toHaveCSS('overflow-y', 'hidden');
    });

    test('closes on a press and release on the scrim, not on a drag across its edge', async ({
      page,
    }) => {
      await load(page, path);
      const { button, dialog } = await openArch(page, 'ecobike');
      // Once risen, the 94vh panel leaves the scrim's top 24px padding free.
      await expect(dialog.locator('.panel')).toHaveCSS('transform', 'none');
      const panel = (await dialog.locator('.panel').boundingBox())!;
      const scrim = { x: 640, y: panel.y / 2 };
      expect(panel.y).toBeGreaterThan(10);

      await page.mouse.move(panel.x + panel.width / 2, panel.y + 40);
      await page.mouse.down();
      await page.mouse.move(scrim.x, scrim.y);
      await page.mouse.up();
      await page.waitForTimeout(400);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('data-arch-state', 'in');

      // Pressed on the scrim, released inside the panel: stays open too.
      await page.mouse.move(scrim.x, scrim.y);
      await page.mouse.down();
      await page.mouse.move(panel.x + panel.width / 2, panel.y + 40);
      await page.mouse.up();
      await page.waitForTimeout(400);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('data-arch-state', 'in');

      await page.mouse.click(scrim.x, scrim.y);
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
    });

    test('keeps keyboard focus inside while open and returns it after', async ({ page }) => {
      await load(page, path);
      await settleScene(page, 'ecobike');
      const button = page.locator('#work [data-arch-open="ecobike"]:visible');
      // Reach the button with Tab from the top of the page.
      let reached = false;
      for (let step = 0; step < 200 && !reached; step++) {
        await page.keyboard.press('Tab');
        reached = await button.evaluate((el) => el === document.activeElement);
      }
      expect(reached, 'Tab reaches "View architecture"').toBe(true);
      await page.keyboard.press('Enter');
      const dialog = page.locator('dialog[data-arch="ecobike"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('[data-arch-close]')).toBeFocused();

      // Forward and back past both ends: focus is in the dialog, or on body (browser chrome)
      // only right after the last (or first) dialog control; never on the page behind.
      for (const key of ['Tab', 'Shift+Tab']) {
        let previous = await focusPlace(page, 'ecobike');
        const presses = ecobike.nodes.length + 4;
        for (let step = 0; step < presses; step++) {
          await page.keyboard.press(key);
          const place = await focusPlace(page, 'ecobike');
          const label = `${key} ${step + 1}: ${previous} → ${place}`;
          expect(place, label).not.toBe('outside');
          if (place === 'body') {
            const edge = key === 'Tab' ? previous === 'last' : previous !== 'last';
            expect(edge || previous === 'body', label).toBe(true);
          }
          previous = place;
        }
        await dialog.locator('[data-arch-close]').focus();
      }

      await dialog.locator('[data-arch-select]').nth(1).focus();
      await page.keyboard.press('Enter');
      await expect(dialog).toHaveAttribute('data-arch-node', '1');
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(button).toBeFocused();
    });

    test('Cognitios has no flow row', async ({ page }) => {
      await load(page, path);
      const { dialog } = await openArch(page, 'cognitios');
      await expect(dialog.locator('h2')).toHaveText(`Cognitios${arch.titleSuffix}`);
      await expect(dialog.locator('[data-flow]')).toHaveCount(0);
      await expect(dialog.locator('[data-arch-select]')).toHaveCount(5);
    });

    test('every project opens its own dialog', async ({ page }) => {
      await load(page, path);
      for (const project of arch.projects) {
        const { button, dialog } = await openArch(page, project.id);
        await expect(dialog.locator('.intro')).toHaveText(project.intro);
        await dialog.locator('[data-arch-close]').click();
        await expect(dialog).toBeHidden();
        await expect(button).toBeFocused();
      }
    });
  });

  test.describe(`architecture dialog (${locale}) with reduced motion`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

    test('opens and closes without animation or flow cycling', async ({ page }) => {
      await load(page, path);
      const { button, dialog } = await openArch(page, 'ecobike');
      const look = await dialog.locator('.panel').evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          opacity: style.opacity,
          transform: style.transform,
          duration: style.transitionDuration,
        };
      });
      expect(look).toEqual({ opacity: '1', transform: 'none', duration: '0s' });
      const flow = dialog.locator('[data-flow]');
      const first = flow.locator('.step').first();
      await expect(first).not.toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await page.waitForTimeout(1600);
      await expect(flow).toHaveAttribute('data-flow-state', '0');

      // Closing is immediate: the dialog is closed right after the click.
      const stillOpen = await dialog.evaluate((el) => {
        el.querySelector<HTMLElement>('[data-arch-close]')!.click();
        return (el as HTMLDialogElement).open;
      });
      expect(stillOpen).toBe(false);
      await expect(button).toBeFocused();
    });
  });

  test.describe(`architecture dialog (${locale}) without JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test('shows no architecture buttons', async ({ page }) => {
      await load(page, path);
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 800 });
        const buttons = page.locator('[data-arch-open]');
        await expect(buttons).toHaveCount(9);
        for (const button of await buttons.all()) await expect(button).toBeHidden();
      }
      const dialogs = page.locator('dialog[data-arch]');
      await expect(dialogs).toHaveCount(6);
      for (const dialog of await dialogs.all()) await expect(dialog).toBeHidden();
    });
  });
}

/**
 * Scrolls so at least `progress` of the stack's pinned distance (height − viewport) has passed:
 * rounded up, so a progress on a group boundary lands in the later group.
 */
async function scrollStack(page: BrowserPage, progress: number) {
  await page.evaluate(async (fraction) => {
    const section = document.querySelector<HTMLElement>('[data-stack]')!;
    const top = section.getBoundingClientRect().top + window.scrollY;
    const distance = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: Math.ceil(top + fraction * distance), behavior: 'instant' });
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  }, progress);
}

/** Waits until the page has stopped scrolling (the same scrollY over 300ms). */
async function waitForScrollEnd(page: BrowserPage) {
  await page.evaluate(async () => {
    let last = -1;
    while (window.scrollY !== last) {
      last = window.scrollY;
      await new Promise((done) => setTimeout(done, 300));
    }
  });
}

/** The stack's tabs say `index` is selected, with the roving tabindex on it. */
async function expectSelectedTab(page: BrowserPage, index: number) {
  const tabs = page.locator('#stack [role="tab"]');
  await expect(tabs).toHaveCount(6);
  for (const [i, tab] of (await tabs.all()).entries()) {
    await expect(tab).toHaveAttribute('aria-selected', String(i === index));
    await expect(tab).toHaveAttribute('tabindex', i === index ? '0' : '-1');
  }
}

const INK = 'rgb(17, 17, 17)';
const WHITE = 'rgb(255, 255, 255)';
const FADED = 'rgb(199, 199, 204)';

for (const locale of LOCALES) {
  const path = href('home', locale);
  const stackCopy = t(locale).stack;

  test.describe(`tech stack (${locale}), wide`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

    test('pins the section and shows group 3 at progress 0.5', async ({ page }) => {
      await load(page, path);
      const section = page.locator('[data-stack]');
      expect(await section.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(800 * 5.6);
      await expect(section.locator('.stage')).toHaveCSS('position', 'sticky');
      await scrollStack(page, 0.5);
      await expect(section).toHaveAttribute('data-stack-state', '3');
      await expectSelectedTab(page, 3);
      const title = section.locator('.title').nth(3);
      await expect(title).toHaveText(stackCopy.groups[3]!.title);
      await expect(title).toHaveCSS('opacity', '1');
      await expect(section.locator('.title').nth(0)).toHaveCSS('opacity', '0');
      await expect(section.locator('#stack-panel-3')).toBeVisible();
      await expect(section.locator('#stack-panel-0')).toBeHidden();
    });

    test('a tab click scrolls to its band and holds that group while scrolling', async ({
      page,
    }) => {
      await load(page, path);
      await scrollStack(page, 0);
      const section = page.locator('[data-stack]');
      await expect(section).toHaveAttribute('data-stack-state', '0');
      const startY = await page.evaluate(() => window.scrollY);
      await page.getByRole('tab', { name: stackCopy.groups[4]!.short, exact: true }).click();
      // Sampled through the smooth scroll: never a group passed on the way.
      const states = await page.evaluate(async () => {
        const el = document.querySelector<HTMLElement>('[data-stack]')!;
        const seen: string[] = [];
        for (let i = 0; i < 20; i++) {
          seen.push(el.dataset.stackState!);
          await new Promise((done) => setTimeout(done, 50));
        }
        return seen;
      });
      expect(new Set(states)).toEqual(new Set(['4']));
      await waitForScrollEnd(page);
      const expected = await section.evaluate((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const span = (el as HTMLElement).offsetHeight - window.innerHeight;
        return top + (span * 4.5) / 6;
      });
      const endY = await page.evaluate(() => window.scrollY);
      expect(endY).toBeGreaterThan(startY);
      expect(Math.abs(endY - expected)).toBeLessThan(2);
      await expect(section).toHaveAttribute('data-stack-state', '4');
      await expectSelectedTab(page, 4);
    });

    test('hovering Firebase lights only EcoBike and greys the other names', async ({ page }) => {
      await load(page, path);
      await scrollStack(page, 0);
      const section = page.locator('[data-stack]');
      await page.getByRole('tab', { name: stackCopy.groups[1]!.short, exact: true }).click();
      await waitForScrollEnd(page);
      await expect(section).toHaveAttribute('data-stack-state', '1');

      const tile = (id: string) => section.locator(`.tile[data-id="${id}"] img`);
      const groupTiles = ['narinohoy', 'steady', 'ecobike', 'andino', 'cognitios'];
      for (const id of groupTiles) await expect(tile(id)).toHaveCSS('opacity', '1');
      await expect(tile('siesa')).toHaveCSS('opacity', '0.3');

      const panel = section.locator('#stack-panel-1');
      const firebase = panel.locator('[data-stack-item]', { hasText: 'Firebase' });
      await firebase.hover();
      await expect(section).toHaveAttribute('data-stack-hover', 'ecobike');
      await expect(tile('ecobike')).toHaveCSS('opacity', '1');
      await expect(tile('ecobike')).toHaveCSS('filter', 'none');
      for (const id of ['narinohoy', 'steady', 'siesa', 'andino', 'cognitios']) {
        await expect(tile(id)).toHaveCSS('opacity', '0.3');
        await expect(tile(id)).toHaveCSS('filter', 'grayscale(1)');
      }
      await expect(firebase.locator('.name')).toHaveCSS('color', INK);
      for (const name of ['Supabase', 'PostgreSQL', 'WordPress · PHP', 'REST APIs']) {
        const item = panel.locator('[data-stack-item]', { hasText: name });
        await expect(item.locator('.name')).toHaveCSS('color', FADED);
      }

      await page.mouse.move(640, 5);
      await expect(section).toHaveAttribute('data-stack-hover', '');
      for (const id of groupTiles) await expect(tile(id)).toHaveCSS('opacity', '1');
      await expect(tile('siesa')).toHaveCSS('opacity', '0.3');
      await expect(panel.locator('.name').first()).toHaveCSS('color', INK);
    });
  });

  test.describe(`tech stack (${locale}), narrow`, () => {
    test.use({ viewport: { width: 375, height: 800 }, reducedMotion: 'no-preference' });

    test('is not pinned and a tab switches groups without scrolling', async ({ page }) => {
      await load(page, path);
      const section = page.locator('[data-stack]');
      await expect(section.locator('.stage')).not.toHaveCSS('position', 'sticky');
      expect(await section.evaluate((el) => (el as HTMLElement).offsetHeight)).toBeLessThan(
        800 * 5.6,
      );
      const tab = page.getByRole('tab', { name: stackCopy.groups[2]!.short, exact: true });
      await tab.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => window.scrollY);
      await tab.click();
      await expect(section).toHaveAttribute('data-stack-state', '2');
      await expectSelectedTab(page, 2);
      await expect(section.locator('#stack-panel-2')).toBeVisible();
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => window.scrollY)).toBe(before);
    });

    test('arrow keys, Home and End move between tabs and wrap', async ({ page }) => {
      await load(page, path);
      const section = page.locator('[data-stack]');
      const tabs = section.locator('[role="tab"]');
      await tabs.first().focus();
      for (const [key, index] of [
        ['ArrowRight', 1],
        ['End', 5],
        ['ArrowRight', 0],
        ['ArrowLeft', 5],
        ['Home', 0],
        ['ArrowLeft', 5],
        ['ArrowLeft', 4],
      ] as const) {
        await page.keyboard.press(key);
        await expect(section, key).toHaveAttribute('data-stack-state', String(index));
        await expect(tabs.nth(index), key).toBeFocused();
        await expectSelectedTab(page, index);
      }
      await expect(section.locator('#stack-panel-4')).toHaveAttribute(
        'aria-labelledby',
        'stack-tab-4',
      );
      await expect(tabs.nth(4)).toHaveAttribute('aria-controls', 'stack-panel-4');
    });
  });

  test.describe(`AI pipeline (${locale})`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'no-preference' });

    test.beforeEach(async ({ page }) => {
      // Lets a test hide the tab: `document.hidden` follows `window.__hidden`.
      await page.addInitScript(() => {
        Object.defineProperty(Document.prototype, 'hidden', {
          configurable: true,
          get: () => (window as unknown as { __hidden?: boolean }).__hidden === true,
        });
      });
    });

    test('advances from phase 1 to phase 2 only once in view', async ({ page }) => {
      await load(page, path);
      // No transitions, so each phase's colours are final the moment the state changes.
      await page.addStyleTag({
        content: '*, *::before, *::after { transition: none !important; }',
      });
      const list = page.locator('[data-pipe]');
      await expect(list.locator('li')).toHaveCount(5);
      await page.waitForTimeout(1500);
      await expect(list, 'out of view, it waits').toHaveAttribute('data-pipe-state', '0');
      await expect(list.locator('li').first()).toHaveCSS('background-color', INK);
      await expect(list.locator('li').first()).toHaveCSS('color', WHITE);

      await page.locator('#ai-title').scrollIntoViewIfNeeded();
      await expect(page.locator('#ai-title')).toHaveAttribute('data-reveal-state', 'visible');
      await expect(list).toHaveAttribute('data-pipe-state', '1', { timeout: 1600 });
      await expect(list.locator('li').nth(1)).toHaveCSS('background-color', INK);
      await expect(list.locator('li').first()).toHaveCSS('background-color', WHITE);
    });

    test('pauses while the tab is hidden', async ({ page }) => {
      await load(page, path);
      const list = page.locator('[data-pipe]');
      await page.locator('#ai-title').scrollIntoViewIfNeeded();
      await expect(page.locator('#ai-title')).toHaveAttribute('data-reveal-state', 'visible');
      await page.evaluate(() => ((window as unknown as { __hidden: boolean }).__hidden = true));
      const state = await list.getAttribute('data-pipe-state');
      await page.waitForTimeout(1600);
      await expect(list).toHaveAttribute('data-pipe-state', state!);
      await page.evaluate(() => ((window as unknown as { __hidden: boolean }).__hidden = false));
      await expect(list).not.toHaveAttribute('data-pipe-state', state!, { timeout: 1600 });
    });

    test('the BMAD image floats with the scroll and tilts on hover', async ({ page }) => {
      await load(page, path);
      const image = page.locator('.ai [data-tilt]');
      await expect(image).toHaveAttribute('alt', t(locale).ai.imageAlt);
      await image.scrollIntoViewIfNeeded();
      await expect(page.locator('.ai .float')).not.toHaveCSS('transform', 'none');
      const box = (await image.boundingBox())!;
      await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.1);
      await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.15);
      await expect(image).toHaveAttribute('data-tilt-state', 'active');
      await page.mouse.move(0, 0);
      await expect(image).toHaveAttribute('data-tilt-state', 'idle');
    });
  });

  test.describe(`tech stack and AI (${locale}) with reduced motion`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

    test('nothing pins, animates or cycles, and tabs still switch groups', async ({ page }) => {
      await load(page, path);
      const section = page.locator('[data-stack]');
      await expect(section.locator('.stage')).not.toHaveCSS('position', 'sticky');
      expect(await section.evaluate((el) => (el as HTMLElement).offsetHeight)).toBeLessThan(
        800 * 5.6,
      );
      const tab = page.getByRole('tab', { name: stackCopy.groups[4]!.short, exact: true });
      await tab.scrollIntoViewIfNeeded();
      const before = await page.evaluate(() => window.scrollY);
      await tab.click();
      await expect(section).toHaveAttribute('data-stack-state', '4');
      for (const el of [
        section.locator('.title').nth(4),
        section.locator('#stack-panel-4 [data-stack-item]').first(),
      ]) {
        const look = await el.evaluate((node) => {
          const style = getComputedStyle(node);
          return { opacity: style.opacity, transform: style.transform };
        });
        expect(look).toEqual({ opacity: '1', transform: 'none' });
        await expect(el).toHaveCSS('transition-duration', '0s');
      }
      await page.waitForTimeout(300);
      expect(await page.evaluate(() => window.scrollY)).toBe(before);

      const list = page.locator('[data-pipe]');
      await page.locator('#ai-title').scrollIntoViewIfNeeded();
      await expect(page.locator('.ai .float')).toHaveCSS('transform', 'none');
      await page.waitForTimeout(1600);
      await expect(list).toHaveAttribute('data-pipe-state', '0');
      for (const phase of await list.locator('li').all()) {
        await expect(phase).toHaveCSS('background-color', WHITE);
        await expect(phase).toHaveCSS('transform', 'none');
      }
    });
  });

  /** Every group, item and phase is listed and in its final, unhighlighted state. */
  async function expectStackAndAiListed(page: BrowserPage) {
    const panels = page.locator('#stack [data-stack-panel]');
    await expect(panels).toHaveCount(6);
    for (const [index, panel] of (await panels.all()).entries()) {
      await expect(panel).toBeVisible();
      await expect(panel.locator('h3')).toHaveText(stackCopy.groups[index]!.title);
    }
    const items = page.locator('#stack [data-stack-item]');
    await expect(items).toHaveCount(32);
    for (const item of await items.all()) {
      await expect(item).toBeVisible();
      await expect(item).toHaveCSS('opacity', '1');
    }
    for (const tile of await page.locator('#stack .tile img').all()) {
      await expect(tile).toHaveCSS('opacity', '1');
    }
    const phases = page.locator('[data-pipe] li');
    await expect(phases).toHaveCount(5);
    for (const phase of await phases.all()) {
      await expect(phase).toBeVisible();
      await expect(phase).toHaveCSS('background-color', WHITE);
    }
  }

  test.describe(`tech stack and AI (${locale}) without JavaScript`, () => {
    test.use({ javaScriptEnabled: false });

    test('lists all six groups and five phases', async ({ page }) => {
      await load(page, path);
      for (const width of [1280, 375]) {
        await page.setViewportSize({ width, height: 800 });
        await expect(page.locator('#stack [role="tablist"]')).toBeHidden();
        await expectStackAndAiListed(page);
      }
    });
  });

  test.describe(`tech stack and AI (${locale}) in print`, () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('prints all six groups and five phases', async ({ page }) => {
      await load(page, path);
      await page.emulateMedia({ media: 'print' });
      await expect(page.locator('#stack [role="tablist"]')).toBeHidden();
      await expectStackAndAiListed(page);
    });
  });
}
