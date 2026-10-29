---
title: 'Playwright smoke tests and parity screenshots'
type: 'feature'
ticket: '3'
created: '2026-10-28'
status: 'built'
baseline_revision: '358e36b6c8bc2b5f21b1395fa43e1108b941c965'
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

**Problem:** Nothing proves in CI that the built pages keep their head tags, legacy redirects, empty storage and same-host requests, and parity with the legacy site (epic R2) can only be judged by eye with no repeatable captures.

**Approach:** Add Playwright with Chromium. Smoke tests run in CI against `astro preview` over every built page. A local script captures the legacy and Astro pages at 375 and 1280 px in English and Spanish and writes them as side-by-side pairs Dona can review.

## Boundaries & Constraints

**Always:**
- The list of pages lives in one place, shared by `scripts/check-dist.mjs`, the smoke tests and the parity script; later stories add a page by adding one entry.
- Smoke tests cover every page in that list, in both locales: HTTP 200 and a visible `<h1>`; canonical equals the page's own absolute URL; `hreflang` `en`, `es`, `x-default` point at the right absolute URLs; English pages with `?lang=es` (with and without `#hash`) land on the Spanish twin; Spanish pages with `?lang=es` stay; after load, cookies, `localStorage` and `sessionStorage` are empty; every request goes to the preview origin.
- Tests run against the built site (`astro preview`), never the dev server.
- Parity captures go to a gitignored folder, never committed; the script serves the legacy site itself (Python `http.server` on 8765, as `AGENTS.md` describes) and the Astro build with `astro preview`, and stops both when done.
- Legacy Spanish is captured at `?lang=es`; Astro Spanish at `/es/`.
- Animations are allowed to finish (or reduced motion is emulated) before each capture, so pairs compare final states.

**Never:**
- No visual-diff assertions or committed baseline images; parity is judged by Dona.
- No browsers other than Chromium; no test of the legacy site in CI.
- No change to pages, layouts or copy.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| All green | current build (`/`, `/es/`) | every smoke test passes | No error expected |
| Missing hreflang | a page without its `es` alternate | the hreflang test fails naming the page | CI fails |
| Redirect broken | `/?lang=es` stays English | the redirect test fails | CI fails |
| Storage written | a script sets `localStorage` | the storage test fails | CI fails |
| Third-party request | a page requests another host | the request test fails naming the URL | CI fails |
| Parity run | `npm run parity` | `parity/` holds legacy and Astro PNGs for each page × locale × width, plus an `index.html` showing each pair side by side | A server that fails to start stops the script with a message |

</frozen-after-approval>

## Code Map

- `scripts/check-dist.mjs` -- holds `PAGES` (`index.html`, `es/index.html`) and `FILES`; move the page list to a shared module and import it here.
- `src/i18n/routes.ts` -- `routes`, `href()`, `twin()`; the shared page list may be derived from it, but scripts under `scripts/` run in plain Node, so keep the shared list in a `.mjs` file both can read.
- `src/layouts/BaseLayout.astro` -- the canonical, `hreflang` links and inline redirect under test.
- `.github/workflows/ci.yml` -- append Playwright install (`npx playwright install --with-deps chromium`) and the smoke run after `check:dist`.
- `.gitignore`, `.prettierignore`, `eslint.config.js` -- ignore `parity/`, `test-results/`, `playwright-report/`.
- Legacy site: root `index.html` served by `python -m http.server 8765`; Spanish via `?lang=es`.

## Tasks & Acceptance

**Execution:**
- [ ] `package.json`, `package-lock.json` -- `@playwright/test` 1.64.1 in devDependencies; scripts `test:smoke` and `parity`.
- [ ] `scripts/pages.mjs` -- the single page list: for each page, its route key, English path and Spanish path; `scripts/check-dist.mjs` imports it.
- [ ] `playwright.config.ts` -- Chromium only, `webServer` running `npm run preview` on a fixed port, `testDir: 'tests'`.
- [ ] `tests/smoke.spec.ts` -- one test group per page × locale covering every Always bullet.
- [ ] `scripts/parity.mjs` -- starts both servers, captures every page × locale × {375, 1280} full-page with reduced motion emulated, writes `parity/<page>-<locale>-<width>-{legacy,astro}.png` and `parity/index.html`, stops the servers.
- [ ] `.github/workflows/ci.yml`, `.gitignore`, `.prettierignore`, `eslint.config.js` -- CI steps and ignores.

**Acceptance Criteria:**
- Given a pull request, when CI runs, then the smoke tests run against the build and pass.
- Given `npm run parity` on Dona's machine, when it finishes, then `parity/index.html` shows the legacy and Astro home side by side for EN and ES at both widths.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-28 — high 0, medium 2, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `pages.mjs`: the 404 (one file, no `es/` twin, no canonical/hreflang per AD-8) cannot join the list as one entry | medium | defer | Confirmed: entries require `en`/`es` paths and every smoke test asserts canonical and hreflang. No 404 exists yet; the fix shapes story 8's page, so it is recorded for that story rather than guessing its shape now. |
| `pages.mjs` not tied to `routes.ts`; a new route could go untested | medium | patch | Confirmed: no check compares them. One test comparing keys and paths closes it. |
| `playwright.config.ts`: local runs may reuse a dev server or stale preview on 4322 | low | patch | Confirmed `reuseExistingServer: !process.env.CI`. Direct correction to `false`. |
| `parity.mjs`: a failed capture leaves `parity/` half-written after clearing the last run | low | rejected | Real but a local review aid; captures are regenerated by rerunning, and keeping the last run needs a temp-folder swap (added complexity). |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass
- `npm run parity` -- expected: 8 PNGs and `parity/index.html`

**Manual checks (if no CLI):**
- Break one thing at a time (remove an `hreflang`, set `localStorage` in the inline script) and confirm the matching smoke test fails; revert.
