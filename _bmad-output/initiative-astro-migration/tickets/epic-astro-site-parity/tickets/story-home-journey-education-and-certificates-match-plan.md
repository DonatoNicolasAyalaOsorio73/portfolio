---
title: 'Home journey, education and certificates match'
type: 'feature'
ticket: '15'
created: '2026-10-29'
status: 'built'
baseline_revision: 'e71cd1721cf044c7cb26846b41f92da3bc3eab30'
route: 'full'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: [quick]
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/initiative-astro-migration/architecture-astro-migration/architecture-astro-migration.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Astro home lacks the three "about me" sections that follow the AI section: the year-by-year journey timeline, the education cards and the certificates grid.

**Approach:** Port the three sections with copy in the dictionaries and data in `src/data/`, reusing `reveal.ts` for their staggered entrances and `scenes.ts`/`tilt.ts` for logo parallax and hover tilt. No new script.

## Boundaries & Constraints

**Always:**
- Journey parity (`index.html:341-363`, data `index.html:914-928`, copy `index.html:540`): heading "Experience, / year by year." and eight entries (year, stage, note) on a timeline. Each entry reveals once in view: year slides from −24px and turns from grey to ink, the dot pops in with an overshoot (`cubic-bezier(.34,1.56,.64,1)`, 700 ms) while a ring expands to 3.2× and fades (1400 ms), the connecting line draws down (1200 ms, `cubic-bezier(.65,0,.35,1)`), the stage rises 18px and unblurs from 6px, the note rises 14px; delays 0, 140 and 300 ms as in legacy.
- Education parity (`index.html:365-388`, data `index.html:929-933`, copy `index.html:541`): eyebrow "ABOUT ME", heading "Education.", two cards (Javeriana Cali, Universidad Mariana) each with its logo floating with `translateY((0.5 − --p) × speed)` (110, 70) and tilting on hover, school name, and degrees with years; cards enter from `translateY(80px) rotateX(20deg) scale(0.9)` (1000 ms opacity, 1200 ms transform, 120 ms stagger) under a 1200px perspective.
- Certificates parity (`index.html:390-414`, data `index.html:934-941`): heading "Certifications." and four certificates (GitHub Foundations, Scrum Fundamentals Certified, Foundational C# with Microsoft, AWS Well-Architected Foundations) each with a coloured radial halo growing from 0.3×, the logo springing in from `scale(0.55) rotate(-10deg)` (1500 ms, `cubic-bezier(.34,1.35,.64,1)`), parallax speeds 140/100/60/120, hover tilt, the black badge popping in last, issuer · year, name, and a "View certificate ↗" link with the accessible label "<name> — View certificate"; cards enter from `translateY(120px) rotateX(28deg) scale(0.85)` with a 160 ms stagger (badge +750 ms). Logo area links carry `tabindex="-1"` and `aria-hidden="true"` as in legacy so each certificate has one keyboard stop.
- Links open in a new tab with `rel="noopener"`; they are outbound navigation only (no third-party resource is loaded), so C1 holds.
- Hidden starting states only under `html.js` inside the no-preference query; without JavaScript or with reduced motion every entry, card, logo, halo and badge is in its final state and logos rest without parallax offset.
- Copy in both dictionaries (stages, notes, degree titles, headings, badge and link labels); data in `src/data/about.ts` (years, school names, certificate names, issuers, URLs, logos, speeds, halo colours) joined by `id`. Images through `<Picture>`, lazy, with `sizes`.

**Never:**
- No contact section or mail dialog (story 16); no change to earlier sections.
- No new script; no `style=""` beyond the build-time `define:vars` pattern already used for per-item values; no storage.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Journey entry in view | entry 12% visible | `data-reveal-state="visible"`; year ink, dot and line drawn, text in place | No error expected |
| Education in view | cards 12% visible | both cards in place, second 120 ms later | — |
| Certificates in view | grid 12% visible | four cards in, badges last | — |
| Certificate link | Tab through the certificates | one stop per certificate, on its "View certificate" link, which opens in a new tab | — |
| Hover tilt | pointer over a logo, hover device | logo tilts | Touch: none |
| Reduced motion / no JS | either | everything visible in final state, no parallax offset | — |

</frozen-after-approval>

## Code Map

- `index.html:341-363`, `:914-928`, `:540` -- journey markup, entries and per-entry transforms.
- `index.html:365-388`, `:929-933`, `:541` -- education markup, data and `card()` entry transform.
- `index.html:390-414`, `:934-941`, `:541` -- certificates markup, `CERT_LINKS`, `GLOW`, data and transforms; `viewCert`.
- `index.html:626-627` -- logo dimensions (`DIM`).
- `assets/logo-javeriana.webp`, `assets/logo-mariana.webp`, `assets/cert-*.webp` -- copy into `src/assets/`.
- `src/styles/motion.css` -- existing `data-reveal` variants; add the journey, card and certificate variants there or in the sections' own styles per AD-9.
- `src/components/OtherProject.astro` -- reference for the parallax `.float` pattern and `define:vars` per item.
- `src/views/HomeView.astro` -- render after the AI section.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/about.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- data and copy.
- [x] `src/assets/` -- the two school logos and four certificate images.
- [x] `src/sections/JourneySection.astro`, `src/sections/EducationSection.astro`, `src/sections/CertificatesSection.astro`.
- [x] `src/styles/motion.css`, `src/styles/tokens.css`, `src/views/HomeView.astro`.
- [x] `tests/smoke.spec.ts` -- every matrix row in EN and ES.

**Acceptance Criteria:**
- Given the smoke tests, when they run, then every matrix row passes in both languages.
- Given `npm run parity`, when comparing the home captures, then the three sections match the legacy site at 375 and 1280 px.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 1, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| Unrevealed journey years print grey | low | patch | The hidden-year colour is not covered by the print reset in `global.css`. |
| Three new `--size-*` tokens duplicate existing values | low | patch | AD-2 reuse rule; 72px, 1200px and 420px already exist. |
| Education parallax assertion cannot fail; certificates untested | medium | patch | The calc always computes to a matrix, so `not 'none'` always passes. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass (if another session's `astro preview` holds the project, run Playwright against `dist/` served by `python -m http.server` with a temporary uncommitted config; never stop that server)

**Manual checks (if no CLI):**
- `npm run preview` beside the legacy site: scroll the three sections at 1280 and 375 px; hover logos; tab through certificates; repeat with reduced motion and JavaScript off.
