---
title: 'Spanish twins, head tags and legacy links work'
type: 'feature'
ticket: '2'
created: '2026-10-28'
status: 'built'
baseline_revision: '7d14422907671a3e7a19c595e236e5afffdb4f37'
route: 'full'
route_source: 'auto'
risk: 'high'
review: 'quick'
review_source: 'pinned'
lenses_ran: [quick]
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Astro site has only an English home page, so Spanish has no URL of its own, crawlers cannot pair the languages, and old `?lang=es` links would land on English.

**Approach:** Add the Spanish home at `/es/`, make `BaseLayout` emit `hreflang` alternates, self-canonical and the single inline head script (legacy `?lang=es` redirect plus the `js` class), give `routes.ts` its `twin()`, generate a bilingual sitemap with `robots.txt` pointing at it, and put the files that must keep their URLs under `public/assets/`.

## Boundaries & Constraints

**Always:**
- Spine AD-5, AD-6, AD-7 and AD-11 rule: every internal URL comes from `routes.ts`; only `BaseLayout` writes `<head>`; the inline script is the site's only inline script and does nothing but the redirect (English pages) and the `js` class (all pages).
- `hreflang` lists `en`, `es` and `x-default` (the English URL) with absolute URLs; each page's canonical is itself.
- Nothing is written to cookies, `localStorage` or `sessionStorage`.
- The redirect keeps the hash: `/?lang=es#work` → `/es/#work`.
- The legacy root files stay untouched; `public/` gets copies.
- Decision (Dona, 2026-10-28): `build.format: 'preserve'`, so `src/pages/es/index.astro` builds to `es/index.html` (URL `/es/`); AD-5 is amended to match.

**Never:**
- No language switch UI (story 4), no ecobike, privacy or 404 pages (stories 7–8), no deploy.
- No `getRelativeLocaleUrl`, no `/es/` written literally outside `routes.ts`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Spanish home | `GET /es/` | Spanish hero, `<html lang="es">`, canonical `https://donacode.link/es/` | No error expected |
| Alternates | either home | `hreflang="en"` → `/`, `"es"` → `/es/`, `"x-default"` → `/` | No error expected |
| Legacy link | `/?lang=es` | replaced by `/es/` (no history entry) | — |
| Legacy link with hash | `/?lang=es#contact` | `/es/#contact` | — |
| No parameter | `/` or `/?lang=en` | stays on English | — |
| Spanish page with param | `/es/?lang=es` | stays (Spanish pages do not redirect) | — |
| JS class | any page, JS on | `<html>` has class `js` | Without JS the page renders normally |
| Sitemap | build | `sitemap-index.xml` lists `/` and `/es/` with `xhtml:link` alternates | — |
| Stable assets | `GET /assets/cv-donato-ayala.pdf` | served from `public/assets/` | — |

</frozen-after-approval>

## Code Map

- `astro.config.mjs` -- `build.format: 'file'` today; add `@astrojs/sitemap`.
- `src/i18n/routes.ts` -- `routes`, `href()`; `href('home','es')` already returns `/es/`. Add `twin(pathname)`.
- `src/layouts/BaseLayout.astro` -- head owner; add alternates and the inline script; canonical and `og:url` already use `href()`.
- `src/views/HomeView.astro` -- render with `locale="es"` from a new `src/pages/es/index.astro`.
- `src/i18n/es.ts` -- already holds `meta.home` and `hero` in Spanish.
- `scripts/check-dist.mjs` -- `PAGES` array to append to; it already counts inline scripts toward the budget.
- `robots.txt` (root, legacy) -- points at `/sitemap.xml`; leave it; `public/robots.txt` is the Astro copy.
- `assets/cv-donato-ayala.pdf`, `assets/ecobike-demo.mp4`, `assets/ecobike-demo-poster.webp`, `assets/shot-ecobike.webp` (EcoBike's OG image) -- copy into `public/assets/`.
- Probe run on this branch: with `build.format: 'file'`, `src/pages/es/index.astro` builds to `dist/es.html` (URL `/es`, so `/es/` 404s on Pages) while `es/ecobike.astro` builds to `dist/es/ecobike.html`; with `build.format: 'preserve'` the output is `index.html`, `es/index.html`, `es/ecobike.html` — the URL shapes AD-5 lists.

## Tasks & Acceptance

**Execution:**
- [x] `astro.config.mjs`, `package.json`, `package-lock.json` -- `build.format: 'preserve'`; `@astrojs/sitemap` 3.7.4 with `i18n: { defaultLocale: 'en', locales: { en: 'en', es: 'es' } }` and a `filter` dropping any `404` page.
- [x] `src/i18n/routes.ts` -- `twin(pathname)` swapping `/x` ↔ `/es/x` for known routes; `routeOf(pathname)` if the layout needs it.
- [x] `src/layouts/BaseLayout.astro` -- three `<link rel="alternate" hreflang>`; `<script is:inline>` adding `js` to `<html>` and, on English pages, `location.replace(href(route,'es') + location.hash)` when `URLSearchParams(location.search).get('lang') === 'es'`; target URL rendered from `routes.ts` at build time, not computed in the browser.
- [x] `src/pages/es/index.astro` -- thin wrapper rendering `HomeView` with `locale="es"`.
- [x] `public/robots.txt`, `public/assets/*` -- robots pointing at `https://donacode.link/sitemap-index.xml`; the four asset copies.
- [x] `scripts/check-dist.mjs` -- append `es/index.html` and `sitemap-index.xml` to the expected files.

**Acceptance Criteria:**
- Given the build, when reading `dist/index.html` and `dist/es/index.html`, then each has its own canonical, both alternates plus `x-default`, and exactly one inline script.
- Given `npm run preview`, when opening each matrix URL, then the behavior in the matrix holds and DevTools Application shows no site storage.
- Given the dist check, when run, then it lists 2 pages and the home JS stays far under 50 KB.

## Implementation Notes

- `@astrojs/sitemap` 3.7.4 went into `dependencies` next to `astro`. With `build.format: 'preserve'` it lists the Spanish home as `https://donacode.link/es` (no slash), which 404s on Pages; a `serialize` hook in `astro.config.mjs` adds the trailing slash to extension-less URLs in `loc` and in the `xhtml:link` alternates. `.html` URLs are untouched.
- The inline script is `<script is:inline define:vars={{ legacyTarget }}>`: `legacyTarget` is `href(route, 'es')` on English pages and `null` on Spanish ones, so the target comes from `routes.ts` at build time.
- `twin()` falls back to the other language's home for an unknown path; `routeOf()` is exported for story 4's switch.
- `check-dist.mjs` checks `sitemap-index.xml` in a separate `FILES` list so the page count stays 2.
- Verified in `npm run preview` with iframes: `/?lang=es` → `/es/` and `/?lang=es#contact` → `/es/#contact` with `history.length` 1; `/`, `/?lang=en`, `/es/?lang=es` stay; `js` class on all; no cookies, localStorage or sessionStorage; `/assets/cv-donato-ayala.pdf` 200; no console errors.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-28 — high 0, medium 0, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `routes.ts` `twin('/es')` returns `/es/` instead of `/`; `/es-foo` counts as Spanish | low | patch | Confirmed: `'/es'.startsWith('/es/')` is false. Pages normally 301s `/es` to `/es/`, so rare, but story 4's switch will call `twin()`; direct correction. |
| `HomeView.astro` doc comment says `es/index.astro` comes "later" | low | patch | The diff adds that page; stale comment, direct correction. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist` -- expected: `index.html`, `es/index.html`, `sitemap-index.xml` present; exit 0
- `grep -c 'hreflang' dist/index.html dist/es/index.html` -- expected: 3 each

**Manual checks (if no CLI):**
- `npm run preview`: walk every matrix row in the browser; confirm no storage in DevTools.
