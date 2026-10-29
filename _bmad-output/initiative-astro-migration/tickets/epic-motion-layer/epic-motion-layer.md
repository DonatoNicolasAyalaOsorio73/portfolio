---
type: epic
title: "Pages move with View Transitions and scroll-driven motion"
parent: initiative-astro-migration
covers: [R6, R7, R8]
sources: []
companions: [_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md]
after: []
refined: false
risk: medium
---

# Pages move with View Transitions and scroll-driven motion

## Description

Upgrades the motion of the Astro site from epic-astro-site-parity: page-to-page View Transitions, and the hero reveal, nav morph, statement sequence and section reveals rebuilt on scroll-driven effects, all of it off under reduced motion. It builds on the shared layout, page components and `/es/` routes that epic 1 delivers, and must not push the site past the R5 performance budget epic 1 met.

## Outcome

Visitors moving through the portfolio see smooth, modern motion that never stutters on a mid-range phone and disappears for anyone who asks for reduced motion; shown by a clean throttled scroll trace and a reduced-motion pass.

## Done when

- Navigating between pages on donacode.link animates with View Transitions where supported and loads normally elsewhere (R6).
- The current motion is present and upgraded with scroll-driven effects, and a throttled mobile scroll trace shows no dropped-frame runs or long tasks caused by animation (R7).
- With `prefers-reduced-motion`, non-essential motion is off and every piece of content is visible (R8).
- Lighthouse mobile on home and EcoBike, EN and ES, still meets the R5 budget, deployed to production.

## Boundaries

- Out: the Astro migration, routing, content and deployment — epic-astro-site-parity.
- Must not change: content, copy, layout and the R5 budget met by epic 1.

## References

- parent — `_bmad-output/initiative-astro-migration/initiative-astro-migration.md`, section Requirements
- architecture — `_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md`, AD-9, AD-10, AD-2 (tokens), AD-11 (budget)
