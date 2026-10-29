---
type: epic
title: "The portfolio runs on Astro, in English and /es/, deployed by Actions"
parent: initiative-astro-migration
covers: [R1, R2, R3, R4, R5, R9, R10, R11]
sources: []
companions: [_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md]
after: []
refined: true
risk: medium
---

# The portfolio runs on Astro, in English and /es/, deployed by Actions

## Description

Rebuilds home, EcoBike, privacy and 404 as an Astro project that prebuilds every page in English and under `/es/`, keeping today's content and motion as they are, and switches donacode.link to deploy from `main` through GitHub Actions. It opens the initiative with the platform baseline (scaffold, CI, deployment), and hands epic 2 the shared layout, page components and `/es/` routes the motion layer builds on.

## Outcome

Every visitor gets the same portfolio as today, served as prebuilt HTML in their language at its own URL and within the performance budget; shown by the Lighthouse run and a page-by-page parity check against the current production site.

## Requirements

- R1 (parent R1): Every page builds from the Astro project as static HTML; no page needs `support.js`, React or Babel.
- R2 (parent R2): Home, EcoBike, privacy and 404 match the current site in English and Spanish, current motion included, shown by the parity screenshots at 375 and 1280 px that Dona approves before cutover.
- R3 (parent R3): Every page except 404 has its `/es/` twin with self-canonical, `hreflang` en, es and x-default, and the sitemap lists both locales.
- R4 (parent R4): `/?lang=es`, `/ecobike.html?lang=es` and `/privacy.html?lang=es` land on the `/es/` twin; `/ecobike.html` and `/privacy.html` keep their paths; `/assets/` files keep their URLs.
- R5 (parent R5): Home and EcoBike, EN and ES, meet the Lighthouse mobile budget before cutover, and CI fails a build that ships more than 50 KB of gzipped JavaScript on the home page.
- R6 (parent R9): Every pull request runs `astro check`, ESLint, Prettier, the build, the dist check and the smoke tests; after cutover a merge to `main` deploys to donacode.link, and until cutover the legacy site stays live.
- R7 (parent R10): `AGENTS.md` describes running, building, testing and previewing the Astro project and the conventions of the architecture spine, and drops the x-dc rules.
- R8 (parent R11): No page writes cookies, `localStorage` or `sessionStorage`, and the privacy page says so in English and Spanish.
- R9 (parent R2, R3, R4, R11): Playwright smoke tests in CI prove every URL renders, `hreflang` and canonical are right, `?lang=es` redirects, storage stays empty and no request leaves donacode.link.

## Constraints

- Parent C1–C4 bind here: no third parties, PRs only, GitHub Pages at donacode.link, real Spanish for every string.
- Architecture AD-1 to AD-8, AD-11 and AD-12 bind every story; AD-9's epic-1 exception lets the current transitions be ported as they are.

## Done when

- donacode.link serves the Astro build, deployed by GitHub Actions on merge to `main`; a pull request builds and tests without deploying (R1, R6).
- Dona approves the parity screenshots of every page in English and Spanish (R2).
- The smoke tests pass in CI on production URLs' shapes: `/es/` twins, `hreflang`, legacy links, empty storage, no third-party requests (R3, R4, R8, R9).
- Lighthouse mobile on home and EcoBike, EN and ES, meets the R5 budget (R5).
- `AGENTS.md` documents the Astro stack and the legacy x-dc site is gone (R1, R7).

## Boundaries

- Out: View Transitions, scroll-driven effects and any motion beyond what the site has today — epic-motion-layer.
- Must not change: the visual design, copy, images and CV download of the current site.
- Touch point: GitHub repository settings — Pages source switched to GitHub Actions, branch ruleset on `main`, auto-delete head branches; owned here, done by a person.

## References

- parent — `_bmad-output/initiative-astro-migration/initiative-astro-migration.md`, section Requirements
- architecture — `_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md`, AD-1 to AD-8, AD-11, AD-12, Conventions, repository settings
- current site — `index.html`, `ecobike.html`, `privacy.html`, `404.html`, `assets/`

## Notes

- Decision: 2026-10-28 — Small PRs to `main`, one per story, no long-lived integration branch; deploying is switched on only in the cutover story, and Pages keeps serving the legacy site from the branch until then.
- Decision: 2026-10-28 — Playwright smoke tests in CI plus a parity screenshot comparison that Dona reviews before cutover.
- Decision: 2026-10-28 — No PRD, UX or research run for this epic.
- Decision: 2026-10-28 — Tracer bullet is story 1: Astro scaffold, tooling, CI and the English home hero building end to end.
- Decision: 2026-10-29 — Story 5 split three ways at Dona's choice (too large for one session): 5 keeps the statement sequence and the philosophy section, new 13 takes the work section, new 14 the 'Under the hood' dialog; 6 also takes the AI section and the contact mail dialog, which no entry owned. Lane: 4 → 5 → 13 → 14 → 6 → 7 → 8.
- Decision: 2026-10-29 — Epic-1 scroll scenes keep exact parity through one scene script writing scroll-progress custom properties (architecture AD-10 exception); epic 2 replaces it.
- Decision: 2026-10-28 — Stories 4 to 8 run in one lane because each adds to `en.ts`, `es.ts` and `tokens.css`; parallel branches would conflict there.
