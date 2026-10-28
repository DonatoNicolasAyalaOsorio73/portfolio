---
type: initiative
title: "Portfolio rebuilt on Astro: faster, bilingual URLs, modern motion"
sources: []
companions: []
after: []
risk: medium
---

# Portfolio rebuilt on Astro: faster, bilingual URLs, modern motion

## Description

donacode.link today is static HTML whose `<x-dc>` templates are compiled in the visitor's browser by `support.js`, which loads React 18 and Babel from unpkg on every visit; Spanish is a `?lang=` switch that crawlers cannot index. This initiative rebuilds the same site on Astro so every page ships as prebuilt HTML, gives Spanish its own `/es/` URLs, and upgrades the motion with View Transitions and scroll-driven effects, deployed from `main` by GitHub Actions. Input: the user's request of 2026-10-28 and the current repository (`index.html`, `ecobike.html`, `privacy.html`, `404.html`, `AGENTS.md`).

## Outcome

Visitors and recruiters get a portfolio that loads near-instantly on mobile, reads natively in English or Spanish at its own URL, and moves with modern, smooth motion; shown by the Lighthouse budget, indexable `/es/` pages and a jank-free scroll trace.

## Requirements

- R1: Every page (home, EcoBike, privacy, 404) ships as prebuilt static HTML; no page compiles templates in the browser or loads React/Babel from a CDN.
- R2: At launch each page shows the same content, sections, links, images, CV download and EN/ES copy as the current site, checked page by page against production.
- R3: Each page has an English URL and a Spanish URL under `/es/`, each with hreflang alternates and a self-canonical, and the sitemap lists both.
- R4: Current URLs keep working: `/?lang=es`, `/ecobike.html` and `/privacy.html` (EN and `?lang=es`) land on their equivalent page.
- R5: Home and EcoBike, EN and ES, meet the performance budget in a Lighthouse mobile run: Performance ≥ 95, LCP ≤ 2.0 s, CLS ≤ 0.05, and under 50 KB of gzipped JavaScript on the home page.
- R6: Navigating between pages animates with the View Transitions API where the browser supports it and falls back to a normal page load elsewhere.
- R7: The current motion (hero reveal, nav morph on scroll, statement sequence, section reveals) is present and upgraded with scroll-driven effects, and a performance trace while scrolling on a throttled mobile profile shows no dropped-frame runs or long tasks caused by animation.
- R8: With `prefers-reduced-motion` set, non-essential motion is off and every piece of content is visible without scroll triggers.
- R9: Merging to `main` builds the site and deploys it to donacode.link through GitHub Actions; a pull request runs the build without deploying.
- R10: `AGENTS.md` describes the new stack: how to run, build and preview, where copy and pages live, and the conventions that replace the x-dc runtime rules.
- R11: The site stores nothing in the visitor's browser; the language comes from the URL alone, `/` never redirects to `/es/` by itself, and `privacy.html` EN and ES say so.

## Constraints

- C1 (AGENTS.md Policy): `privacy.html` stays true: no cookies, no analytics, no third-party requests; fonts, scripts and images are served from donacode.link. A change in stored data updates the EN and ES privacy text in the same change.
- C2 (AGENTS.md Policy): never push to `main`; every change lands through a pull request, and merging to `main` deploys.
- C3 (repo `CNAME`): stays on GitHub Pages at donacode.link; DNS is not changed.
- C4 (AGENTS.md Conventions): every visible string has a real Spanish translation; images ship as WebP or AVIF with explicit width and height, no full-size PNGs committed.

## Done when

- donacode.link serves the Astro build, deployed from `main` by GitHub Actions, with every page at content parity (R1, R2, R9).
- Lighthouse mobile on home and EcoBike, EN and ES, meets the performance budget (R5).
- Every page has an indexable `/es/` twin with hreflang and sitemap entries, and every old URL resolves (R3, R4).
- View Transitions and scroll-driven motion are live, a throttled scroll trace is clean, and reduced-motion shows all content (R6, R7, R8).
- A network log of each page shows no third-party request, the browser holds no site storage, and `privacy.html` EN and ES say so (R11, C1).
- `AGENTS.md` documents the new stack (R10).

## Boundaries

- Out: a visual redesign, new sections or content, a blog or CMS, analytics, any backend or form service.
- Out: changing the domain or DNS.
- Touch point: GitHub repository settings — Pages source switched from branch to GitHub Actions; owner: epic-astro-site-parity (a person does it).
- Tracer path: an Astro build of the English home page, deployed by Actions to donacode.link → its `/es/` twin with hreflang → the motion layer on top.

## References

- current site — `index.html`, `ecobike.html`, `privacy.html`, `404.html`
- project rules — `AGENTS.md`, sections Policy and Conventions that differ from defaults

## Notes

- Open question: Which animation library, if any, beyond native CSS and View Transitions (GSAP, Motion, none)? Waits: `bmad-architecture`, before epic 2.
- Decision: 2026-10-28 — Parity first: the visual design stays and the motion layer upgrades it; a redesign is out of scope.
- Decision: 2026-10-28 — Performance budget approved as written in R5.
- Decision: 2026-10-28 — Drop `localStorage['da-lang']`; the URL alone sets the language, with no auto-redirect (R11).
- Decision: 2026-10-28 — Sliced into 2 epics by the rule "one capability delivered and deployed together", not the 3 first proposed: `/es/` routing joins the migration epic, because Spanish must work at launch and a separate epic would need a throwaway `?lang=` mechanism on Astro.
- Decision: 2026-10-28 — Epic 1 ports the current motion as it is (CSS), so production never loses it; epic 2 upgrades it.
