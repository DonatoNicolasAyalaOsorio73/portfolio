// Captures the legacy site and the Astro build side by side for every page × locale × width,
// so parity (R2) can be judged by eye. Output goes to the gitignored `parity/` folder.
// Serves the legacy site with Python's http.server (as AGENTS.md describes) and `dist/` with
// `astro preview`, and stops both when done. Run through `npm run parity`, which builds first.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
import { LOCALES, PAGES } from './pages.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'parity');
const WIDTHS = [375, 1280];
const HEIGHT = 800;
const LEGACY_PORT = 8765;
const ASTRO_PORT = 4323;
const START_TIMEOUT = 60_000;

/** The legacy site has one URL per page and switches to Spanish with `?lang=es`. */
const legacyPath = (/** @type {import('./pages.mjs').Page} */ page, locale) =>
  locale === 'es' ? `${page.paths.en}?lang=es` : page.paths.en;

/** @type {import('node:child_process').ChildProcess[]} */
const servers = [];

function stopServers() {
  for (const server of servers) {
    if (server.exitCode === null) server.kill();
  }
}

/** Starts `command` and resolves once `url` answers; rejects if it exits or times out first. */
async function startServer(name, command, args, url) {
  // Another server already answering would be captured instead of ours, so refuse to share.
  const busy = await fetch(url).then(
    () => true,
    () => false,
  );
  if (busy) {
    throw new Error(`${name} cannot start: ${url} is already in use; stop that server and retry.`);
  }
  const child = spawn(command, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] });
  servers.push(child);
  let output = '';
  child.stdout.on('data', (chunk) => (output += chunk));
  child.stderr.on('data', (chunk) => (output += chunk));
  let failed = null;
  child.on('error', (error) => (failed = error.message));
  child.on('exit', (code) => (failed ??= `exited with code ${code}`));

  const deadline = Date.now() + START_TIMEOUT;
  while (Date.now() < deadline) {
    if (failed) break;
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(
    `${name} did not start at ${url}: ${failed ?? `no answer after ${START_TIMEOUT / 1000} s`}` +
      (output.trim() ? `\n${output.trim()}` : ''),
  );
}

/** Scrolls to the bottom and back so scroll-triggered content is revealed, then lets it settle. */
async function settle(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}

async function capture(browser, url, width, file) {
  // A fresh context per capture: no language choice or other state carries over.
  const context = await browser.newContext({
    viewport: { width, height: HEIGHT },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor({ state: 'visible' });
    await settle(page);
    await page.screenshot({ path: join(OUT, file), fullPage: true, animations: 'disabled' });
  } finally {
    await context.close();
  }
}

function writeIndex(pairs) {
  const rows = pairs
    .map(
      ({ label, legacy, astro }) => `
    <section>
      <h2>${label}</h2>
      <div class="pair">
        <figure><figcaption>Legacy</figcaption><a href="${legacy}"><img src="${legacy}" alt="Legacy ${label}"></a></figure>
        <figure><figcaption>Astro</figcaption><a href="${astro}"><img src="${astro}" alt="Astro ${label}"></a></figure>
      </div>
    </section>`,
    )
    .join('\n');
  writeFileSync(
    join(OUT, 'index.html'),
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Parity: legacy vs Astro</title>
<style>
  body { margin: 0; padding: 24px; font: 14px/1.5 system-ui, sans-serif; background: #f4f4f5; color: #18181b; }
  h1 { margin: 0 0 4px; } p { margin: 0 0 24px; color: #52525b; }
  section { margin-bottom: 48px; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
  figure { margin: 0; background: #fff; padding: 8px; border-radius: 8px; }
  figcaption { font-weight: 600; margin-bottom: 8px; }
  img { display: block; max-width: 100%; height: auto; margin: 0 auto; border: 1px solid #e4e4e7; }
</style>
</head>
<body>
<h1>Parity: legacy vs Astro</h1>
<p>Captured ${new Date().toISOString()} with reduced motion. Click an image to open it full size.</p>
${rows}
</body>
</html>
`,
  );
}

async function main() {
  if (!existsSync(join(ROOT, 'dist', 'index.html'))) {
    throw new Error('dist/ is missing; run `npm run build` first (or use `npm run parity`).');
  }
  const python = process.platform === 'win32' ? 'python' : 'python3';
  const legacyOrigin = `http://127.0.0.1:${LEGACY_PORT}`;
  const astroOrigin = `http://localhost:${ASTRO_PORT}`;
  await startServer(
    'Legacy server (python -m http.server)',
    python,
    ['-m', 'http.server', String(LEGACY_PORT), '--bind', '127.0.0.1'],
    `${legacyOrigin}/`,
  );
  await startServer(
    'Astro preview',
    process.execPath,
    [
      join(ROOT, 'node_modules', 'astro', 'bin', 'astro.mjs'),
      'preview',
      '--port',
      String(ASTRO_PORT),
    ],
    `${astroOrigin}/`,
  );

  // Clear old captures only once both servers are up, so a failed start keeps the last run.
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const pairs = [];
  try {
    for (const page of PAGES) {
      for (const locale of LOCALES) {
        for (const width of WIDTHS) {
          const name = `${page.key}-${locale}-${width}`;
          const legacy = `${name}-legacy.png`;
          const astro = `${name}-astro.png`;
          console.log(`parity: ${name}`);
          await capture(browser, `${legacyOrigin}${legacyPath(page, locale)}`, width, legacy);
          await capture(browser, `${astroOrigin}${page.paths[locale]}`, width, astro);
          pairs.push({
            label: `${page.key} · ${locale.toUpperCase()} · ${width} px`,
            legacy,
            astro,
          });
        }
      }
    }
  } finally {
    await browser.close();
  }
  writeIndex(pairs);
  console.log(`parity: ${pairs.length * 2} PNGs and parity/index.html written to ${OUT}`);
}

try {
  await main();
} catch (error) {
  console.error(`parity: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
} finally {
  stopServers();
}
