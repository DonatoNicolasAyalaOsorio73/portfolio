---
title: 'Home stack and AI sections match'
type: 'feature'
ticket: '6'
created: '2026-10-29'
status: 'built'
baseline_revision: '658e7c705f5130c593b7b6601cf45ce8ef4cc3a4'
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

**Problem:** After the work section the Astro home stops; the tech stack section (six capability groups driven by scroll and tabs, with the projects of each group lit) and the AI-assisted engineering section (BMAD image and a five-phase pipeline that cycles) are missing.

**Approach:** Port both sections with their copy in the dictionaries and data in `src/data/`. The stack section keeps its pinned scroll-driven group change on wide screens, its accessible tabs everywhere, and its per-project highlighting; the AI section keeps its reveal, parallax image with hover tilt, and cycling pipeline. One `src/scripts/stack.ts` and one `src/scripts/pipeline.ts` set only state attributes; parallax and tilt reuse `scenes.ts` and `tilt.ts`.

## Boundaries & Constraints

**Always:**
- Stack parity (`index.html:257-308`, data `index.html:883-904`, logic `index.html:733-755`): eyebrow "TECH STACK", six groups (Frontend, Backend & data, Cloud & delivery, Testing & quality, Security & reliability, AI-assisted engineering) each with its big title, short tab label and items (name, purpose, project chips), and the "Projects in this layer" row of six project tiles. Active group title in place; others moved ±40px and faded (600 ms opacity, 800 ms transform). Tabs show a bar (active 48px ink, passed ink, others 12% black; 500 ms) and label. Items of the active group fade up 28px with a 120 ms + 60 ms × index stagger; hovering an item greys the names of items in other projects and lights only that item's projects; leaving restores the group's projects. Lit tiles are full colour, lifted 4px on a light background; unlit tiles are greyscale at 30% (450 ms).
- On wide screens (`min-width: 960px`, motion allowed) the section is 560vh with a sticky 100vh stage and the active group is `floor(progress × 6)`; clicking a tab smooth-scrolls to that group's band and holds that group for 1.5 s while the scroll settles (legacy `dnaLock`). Elsewhere the section is not pinned and tabs switch groups directly.
- Tabs follow the ARIA tabs pattern: `role="tablist"/"tab"/"tabpanel"`, `aria-selected`, `aria-controls`, roving `tabindex`, ArrowLeft/ArrowRight wrapping, Home/End, focus moves to the new tab.
- AI parity (`index.html:310-339`, `index.html:537-539`, `index.html:906-913`, `index.html:969`): eyebrow, two-line heading (reveal), paragraph, BMAD image with drop shadow floating with `translateY((0.5 − --p) × 140px) rotate((0.5 − --p) × −10deg)` and hover tilt, caption, four tool chips, and five phases (number, phase, agent, artifact, "✓" what I do). While the section is in view and has been revealed, the active phase advances every 1400 ms (ink background, white text, shadow, shifted 8px; 550 ms); paused when the tab is hidden or under reduced motion.
- Scripts set only `data-stack-state` (active group), `data-stack-hover` (hovered project ids), `data-pipe-state` (active phase), and the ARIA attributes the tabs pattern needs; looks come from CSS on those attributes (project tiles carry `data-id` and `data-groups`, matched with `~=`).
- Without JavaScript every group is listed with its items and every phase is shown in its final, unhighlighted state; with reduced motion nothing animates or cycles and tabs still switch groups. Print shows all groups (legacy `data-print-dna`).
- Copy in both dictionaries, data in `src/data/` (`stack.ts`; tool names), joined by `id`; project tiles reuse `src/data/projects.ts` logos.

**Never:**
- No journey, education, certificates or contact (stories 15–16); no change to earlier sections.
- No `style=""`, no inline script, no storage.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Wide scroll | progress 0.5 through the stack section | group 3 active (`data-stack-state="3"`) | No error expected |
| Tab click, wide | click the "SECURITY" tab | scrolls to group 4's band; group 4 stays active while scrolling | — |
| Tab click, narrow | width < 960px, click a tab | group switches, no scroll | — |
| Keyboard | focus a tab, press ArrowRight / End | next / last group active, focus moves | Wraps at the ends |
| Hover item | hover "Firebase" | only EcoBike tile lit, other names greyed | Leave restores the group's tiles |
| Pipeline | AI section in view 1.5 s | active phase moves 1 → 2 | Hidden tab: paused |
| Reduced motion | either section | no pinning, no animation, no cycling; tabs still work | — |
| No JavaScript | page loads | all six groups and five phases visible | — |

</frozen-after-approval>

## Code Map

- `index.html:257-308` -- stack markup; `index.html:535-536` -- `dnaEyebrow`, `dnaP`, `usedIn`; `index.html:883-904` -- groups (`groups`), short names, `dnaGroups`, `activeSet`, `dnaProjects`.
- `index.html:733-736` -- stack index from scroll and `dnaLock`; `index.html:740-755` -- `goDna` (smooth scroll to `top + span × (i + 0.5) ÷ 6`, 1500 ms lock) and `dnaKey`.
- `index.html:310-339` -- AI markup; `index.html:537-539` -- AI copy; `index.html:906-913` -- phases `B` and `bmad` state; `index.html:969` -- `aiTools`; `index.html:667-674` -- pipeline timer (1400 ms, only when revealed and in view).
- `assets/bmad.webp` (580×580) -- copy into `src/assets/`.
- `src/data/projects.ts` -- logos, radii, blend modes for the tiles; `src/scripts/scenes.ts`, `tilt.ts`, `reveal.ts` -- reuse.
- `src/views/HomeView.astro` -- render after the work section.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/stack.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- groups, items, project links per item, AI phases and copy.
- [x] `src/assets/bmad.webp`.
- [x] `src/sections/StackSection.astro`, `src/sections/AiSection.astro` -- markup and styles for every state, no-JS and print layouts.
- [x] `src/scripts/stack.ts`, `src/scripts/pipeline.ts`.
- [x] `src/styles/tokens.css`, `src/views/HomeView.astro`.
- [x] `tests/smoke.spec.ts` -- every matrix row in EN and ES.

**Acceptance Criteria:**
- Given the smoke tests, when they run, then every matrix row passes in both languages.
- Given `npm run parity` with port 8765 free, when comparing the home captures, then both sections match the legacy site at 375 and 1280 px.
- Given the dist check, when run, then the home page stays under 50 KB of JavaScript.

## Implementation Notes

- Data in `src/data/stack.ts` (groups with item names and project ids, tile short names, AI image, tool names, phase ids); copy in `stack` and `ai` of both dictionaries, joined by `id`. Item names stay untranslated, as in legacy.
- One group at a time is CSS on `data-stack-state` with enumerated `:nth-child` selectors (6 groups). Inactive titles and panels use `visibility: hidden` (transitioned 800 ms so they fade out), which also removes them from the accessibility tree and tab order, in place of legacy `aria-hidden`.
- Hover greying matches legacy exact project-set equality with 12 static `~=` rules (some id in one set but not the other). Tiles are lit by `[data-stack-state='g'][data-stack-hover=''] .tile[data-groups~='g']` or `[data-stack-hover~='id'] .tile[data-id='id']`; lit/unlit looks pass to the logo and name through local `--tile-*` properties.
- Base CSS (no JS, and print, since every interactive rule is inside `@media screen`) lists every group with an `h3` title per panel and all tiles lit. The big title stack and the tablist exist only with JS.
- Pinned only at `min-width: 960px` without reduced motion (legacy used 900×620 via `isWide`); the script's `pinned()` uses the same media queries.
- The BMAD image's parallax is applied only without reduced motion, like the other-projects logo rows, so under reduced motion it rests unrotated (legacy showed its p=1 offset, −70px and 5°). This is the only visible difference in the parity captures.
- `<source>` elements inside a `display: contents` `<picture>` became flex items and added the tile `gap` twice; hidden with `display: none`.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 4, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| Outgoing panel takes the pointer for 800 ms and lights wrong tiles | medium | patch | Panels share one grid cell; legacy set `pointer-events: none` on inactive panels. |
| Print keeps `min-height: 100vh` on the stack stage | low | patch | Legacy print reset `[data-dna]>div` min-height and position. |
| Pinning has no minimum height | medium | patch | Legacy pinned only at `innerHeight ≥ 620`; short wide screens push the tile row below the fold. |
| Inactive panels hidden under reduced motion, against AD-10's wording | low | rejected (spine clarified) | Tabs must hide inactive panels in every motion setting; AD-10 now states that content hidden by an interactive control is not a motion state. |
| Tab roles and tabindex present without JavaScript | medium | patch | Six "tab panels" with no tablist for assistive tech; the script should add the pattern. |
| Pipeline colour assertion can miss its ~850 ms window | medium | patch | Exact background only holds between transition end and next tick. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass

**Manual checks (if no CLI):**
- `npm run preview` beside the legacy site: scroll the stack at 1280 px, use tabs by mouse and keyboard, hover items, watch the pipeline; repeat at 375 px, with reduced motion and with JavaScript off.
