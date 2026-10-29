// Fails the build when an expected page is missing from dist/ or the home page
// ships more than the gzipped JavaScript budget (AD-12, R5).
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = resolve(import.meta.dirname, '..', 'dist');

// Later stories add ecobike.html, privacy.html, 404.html and the other es/ twins.
const PAGES = ['index.html', 'es/index.html'];

// Other files the build must emit.
const FILES = ['sitemap-index.xml'];

const HOME = 'index.html';
const HOME_JS_BUDGET = 50 * 1024;

const failures = [];

for (const page of PAGES) {
  if (!existsSync(join(DIST, page))) failures.push(`missing page: dist/${page}`);
}

for (const file of FILES) {
  if (!existsSync(join(DIST, file))) failures.push(`missing file: dist/${file}`);
}

if (existsSync(join(DIST, HOME))) {
  const html = readFileSync(join(DIST, HOME), 'utf8');
  let bytes = 0;
  const counted = new Set();

  // External scripts and module preloads served from this site; each file counts once.
  const srcPattern =
    /<script\b[^>]*\bsrc="([^"]+)"[^>]*>|<link\b[^>]*\brel="modulepreload"[^>]*\bhref="([^"]+)"[^>]*>/g;
  for (const match of html.matchAll(srcPattern)) {
    const url = match[1] ?? match[2];
    if (/^(https?:)?\/\//.test(url)) {
      failures.push(`home page loads a script from another host: ${url}`);
      continue;
    }
    const file = join(DIST, url.replace(/^\//, '').split(/[?#]/)[0]);
    if (!existsSync(file)) {
      failures.push(`home page references a missing script: ${url}`);
      continue;
    }
    if (counted.has(file)) continue;
    counted.add(file);
    bytes += gzipSync(readFileSync(file)).length;
  }

  // Inline scripts (JSON-LD and other data blocks are not JavaScript).
  const inlinePattern = /<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
  for (const [, attrs, body] of html.matchAll(inlinePattern)) {
    if (/\btype="(?!module"|text\/javascript")[^"]*"/.test(attrs)) continue;
    if (body.trim()) bytes += gzipSync(body).length;
  }

  console.log(`home JS: ${bytes} B gzipped (budget ${HOME_JS_BUDGET} B)`);
  if (bytes > HOME_JS_BUDGET) {
    failures.push(
      `home page ships ${bytes} B of gzipped JavaScript, over the ${HOME_JS_BUDGET} B budget`,
    );
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`check-dist: ${failure}`);
  process.exit(1);
}

console.log(`check-dist: ${PAGES.length} page(s) and ${FILES.length} other file(s) present`);
