---
type: epic
title: "The portfolio runs on Astro, in English and /es/, deployed by Actions"
parent: initiative-astro-migration
covers: [R1, R2, R3, R4, R5, R9, R10, R11]
sources: []
companions:
  - _bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md
after: []
refined: false
risk: medium
---

# The portfolio runs on Astro, in English and /es/, deployed by Actions

## Description

Rebuilds home, EcoBike, privacy and 404 as an Astro project that prebuilds every page in English and under `/es/`, keeping today's content and motion as they are, and switches donacode.link to deploy from `main` through GitHub Actions. It opens the initiative with the platform baseline (scaffold, CI, deployment), and hands epic 2 the shared layout, page components and `/es/` routes the motion layer builds on.

## Outcome

Every visitor gets the same portfolio as today, served as prebuilt HTML in their language at its own URL and within the performance budget; shown by the Lighthouse run and a page-by-page parity check against the current production site.

## Done when

- donacode.link serves the Astro build, deployed by GitHub Actions on merge to `main`; a pull request builds without deploying (R9).
- Home, EcoBike, privacy and 404 match the current site page by page in English and Spanish, current motion included (R1, R2).
- Each page has its `/es/` twin with hreflang, self-canonical and sitemap entries, and `/?lang=es`, `/ecobike.html` and `/privacy.html` land on their equivalent page (R3, R4).
- Lighthouse mobile on home and EcoBike, EN and ES, meets the R5 budget; the browser holds no site storage and `privacy.html` EN and ES say so (R5, R11).
- `AGENTS.md` documents the Astro stack (R10).

## Boundaries

- Out: View Transitions, scroll-driven effects and any motion beyond what the site has today — epic-motion-layer.
- Must not change: the visual design, copy, images and CV download of the current site.
- Touch point: GitHub repository settings — Pages source switched to GitHub Actions; owned here, done by a person.

## References

- parent — `_bmad-output/initiative-astro-migration/initiative-astro-migration.md`, section Requirements
- architecture — `_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md`, AD-1 to AD-8, AD-11, AD-12, Conventions, repository settings
