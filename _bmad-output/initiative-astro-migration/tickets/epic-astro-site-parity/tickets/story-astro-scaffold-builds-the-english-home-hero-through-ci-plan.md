---
title: 'Astro scaffold builds the English home hero through CI'
type: 'feature'
ticket: '1'
created: '2026-10-28'
status: 'built'
baseline_revision: 'e42a5e5238e3f300b0edca9bbf47ac16b522788c'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: [quick]
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The portfolio has no Astro project yet, so no later story can build sections, routes or tests, and nothing proves the spine's stack and CI gate work end to end.

**Approach:** Scaffold the Astro project at the repository root beside the legacy site, with the spine's tooling, tokens, layers, `BaseLayout`, routes and i18n skeleton, and render the current English home hero at `/`. A GitHub Actions workflow runs check, lint, format, build and the dist check on pull requests and pushes, without deploying.

## Boundaries & Constraints

**Always:**
- Follow the architecture spine: AD-1, AD-2, AD-3, AD-6, AD-11, AD-12 and its Consistency Conventions; Stack versions exactly as pinned (TypeScript 6.0.3, Node 26 in `.nvmrc`).
- The hero matches the legacy hero (`index.html` lines 84–106): eyebrow, two-line `<h1>`, photo with caption and "Open to work" dot, divider, intro, two CTAs, subline; same sizes, colors, radii, shadows, and the load reveal (fade + 40px rise, 900/1100/900 ms with 0/120/280 ms delays; photo 1400 ms from `translateY(40px) scale(0.96)` at 200 ms, image scale 1.08→1 over 1800 ms).
- The reveal is CSS only, declared inside `@media (prefers-reduced-motion: no-preference)`; with reduced motion or no animation support the hero renders in its final state.
- Spanish strings exist in `es.ts` for every key added (real translations taken from the legacy `TX`).
- The legacy site keeps working from the branch: root `index.html`, `ecobike.html`, `privacy.html`, `404.html`, `support.js`, `assets/`, `CNAME`, `.nojekyll` stay untouched.

**Never:**
- No deploy job, no Pages settings change, no `/es/` routes, `hreflang`, sitemap or inline head script (story 2).
- No UI framework integration, no Tailwind, no `style=""` attributes, no web fonts, no CDN URLs.
- Do not edit `support.js` or any legacy page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Build | `npm ci && npm run build` | `dist/index.html` holds the hero as static HTML; no `<script>` beyond Astro's none | No error expected |
| Dist check passes | `dist/index.html` exists, home JS ≤ 50 KB gzipped | `node scripts/check-dist.mjs` exits 0 | No error expected |
| Dist check fails | a listed page missing or home JS > 50 KB | exits 1 naming the missing page or the byte count | CI step fails |
| Missing Spanish key | key in `en.ts` absent from `es.ts` | `astro check` fails | CI step fails |
| Reduced motion | `prefers-reduced-motion: reduce` | hero visible at final state, no animation | — |

</frozen-after-approval>

## Code Map

- `index.html:84-106` -- legacy hero markup and inline styles to port; `index.html:44-53` -- reset, focus ring, print rules for `global.css`.
- `index.html:522-528`, `index.html:553-554` -- `TX` copy for `eyebrow`, `h1a`, `h1b`, `intro`, `sub`, `cta1`, `cta2`, `caption`, `open`, `introLabel`, `skip`; `index.html:6-7` -- English title and description for `meta.home`.
- `index.html:666`, `index.html:818-822`, `index.html:962` -- reveal timing (`R(k, d)`, `heroImg`, `heroScale`) to reproduce in CSS.
- `assets/donato.webp` (560×747) -- copy into `src/assets/`; leave the original for the legacy site.
- Do not change: `support.js`, root HTML pages, `assets/`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json`, `.nvmrc`, `astro.config.mjs`, `tsconfig.json` -- Astro 7.4.4 project, `output: 'static'`, `site: 'https://donacode.link'`, `build.format: 'file'`, `engines.node >=22.23.4`, scripts `dev`, `build`, `preview`, `check`, `lint`, `format`, `format:check`, `check:dist`; tsconfig extends `astro/tsconfigs/strict` -- AD-1, AD-12.
- [x] `.editorconfig`, `.prettierrc.json`, `.prettierignore`, `eslint.config.js`, `.gitignore` -- spine conventions; ignore `dist/`, `node_modules/`, `.astro/`, legacy files, `_bmad*`, `.claude/`, `.agents/`; ESLint `no-restricted-imports` per layer as in the spine's layer table -- Conventions.
- [x] `src/styles/tokens.css`, `src/styles/motion.css`, `src/styles/global.css` -- closed token vocabulary with header table (colors, space, radius, shadow, font, size, dur, ease from the hero), `mo-rise` keyframe in `motion.css`, reset and print in `global.css` -- AD-2, AD-9.
- [x] `src/i18n/en.ts`, `src/i18n/es.ts`, `src/i18n/index.ts`, `src/i18n/routes.ts` -- `meta.home`, `hero.*`, `chrome.skip` keys; `t(locale)`; `routes.home` and `href(route, locale)` for English -- AD-3, AD-5.
- [x] `src/layouts/BaseLayout.astro` -- props `{ locale, route }`, `<html lang>`, title, description, canonical, Open Graph with `/assets/og-image.jpg`, favicons, `global.css` -- AD-6.
- [x] `src/assets/donato.webp`, `src/sections/HeroSection.astro`, `src/views/HomeView.astro`, `src/pages/index.astro` -- hero with `<Picture formats={['avif','webp']}>` eager + `fetchpriority="high"`, scoped styles, reveal -- AD-11, AD-9.
- [x] `scripts/check-dist.mjs` -- expected pages list (`index.html` for now) and 50 KB gzipped home JS budget -- AD-12.
- [x] `.github/workflows/ci.yml` -- on `pull_request` and `push`: checkout v7, setup Node from `.nvmrc`, `npm ci`, check, lint, format check, build, dist check; `permissions: contents: read`; no deploy -- AD-12, R6.

**Acceptance Criteria:**
- Given a clean clone, when `npm ci` then every script in Verification runs, then all exit 0.
- Given `npm run preview`, when opening `/`, then the English hero matches the legacy hero at 375 and 1280 px and the page loads no JavaScript.
- Given a pull request from this branch, when CI runs, then the workflow is green and nothing is deployed; donacode.link still serves the legacy site.

## Implementation Notes

- Favicons and `og-image.jpg` are copied (not moved) into `public/` and `public/assets/` so BaseLayout's links resolve in the build; the legacy root copies stay.
- `BaseLayout` types `route` as `RouteKey` only; `'notFound'` joins with the 404 story, when `meta.notFound` exists.
- `routes.ts` already prefixes `/es` for Spanish, but no `es/` page exists yet.
- The hero `<Picture>` uses `fallbackFormat="webp"`; the default PNG fallback was 448 kB.
- Token names for durations and delays follow the closed `--dur-` prefix (`--dur-step`, `--dur-step-2`, `--dur-fast`), since the spine has no `--delay-` prefix.
- The workflow is `.github/workflows/ci.yml` (no deploy) and uses `actions/setup-node@v7`, the current major; the spine names `deploy.yml` for the later deploy story.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-28 — high 0, medium 1, low 3, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `scripts/check-dist.mjs`: a file referenced by both `<script src>` and `modulepreload` is counted twice | medium | patch | The combined regex adds every match with no dedupe; Astro emits module preloads for hoisted chunks, so a future island would inflate the budget count. Fix: a Set of resolved paths. |
| `HeroSection.astro`: CTAs point to `/#work` and `/#contact`, which have no target yet | low | rejected | Real only in preview; the site is not deployed until story 10, and stories 5–6 add both sections. The links are correct for the finished page. |
| `tokens.css`: "First used" column wrong for `--ease-out`, `--dur-fast`, `--space-12`; two rows misaligned | low | patch | Confirmed by reading `global.css` and `BaseLayout.astro`; AD-2 makes the table the token record. Direct correction. |
| `tsconfig.json`: `exclude` omits `.impeccable` | low | patch | `.prettierignore` and `eslint.config.js` ignore it; tsconfig does not. Direct correction. |

## Design Notes

The legacy reveal waits for a JS timer; here it is a load animation, so no script and no hidden base state:

```css
@media (prefers-reduced-motion: no-preference) {
  .eyebrow { animation: mo-rise var(--dur-reveal) var(--ease-out) both; }
  .title { animation: mo-rise var(--dur-reveal-lg) var(--ease-out) var(--delay-2) both; }
}
```

`check-dist.mjs` keeps its page list in one array so story 2 adds the `es/` twins by appending.

## Verification

**Commands:**
- `npm ci` -- expected: installs with no peer-dependency errors
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist` -- expected: `dist/index.html` present, budget line printed, exit 0

**Manual checks (if no CLI):**
- `npm run preview`, open `/` at 375 and 1280 px beside `python -m http.server 8765` on the legacy site: hero identical, reveal plays once, reduced motion shows it static.
