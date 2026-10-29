---
title: 'Home work section matches'
type: 'feature'
ticket: '13'
created: '2026-10-29'
status: 'built'
baseline_revision: '3b9dcf509f00087456393abdbbef94baac417b4c'
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

**Problem:** The Astro home has no work section, which is the core of the portfolio: the three featured projects with their pinned scroll scenes and the grid of other projects are missing.

**Approach:** Port the work section with project data in `src/data/projects.ts` and copy in the dictionaries: on wide screens each featured project is a pinned 300vh scene where the logo flies from the centre into its slot and the browser-framed screenshot rises in; on narrow screens the featured projects are stacked cards that reveal in view; below, the "Other projects" grid reveals with a stagger, floats with parallax and tilts its logos on hover. Motion reuses `scenes.ts` and `reveal.ts`.

## Boundaries & Constraints

**Always:**
- Parity with `index.html:152-255` and data/logic at `index.html:836-880`: heading "Featured projects." and intro (reveal); featured order NariñoHoy, Steady Guardians, EcoBike; others Centro de Estudios Andino, Siesa MES, Cognitios; every number, kind, name, summary, client/when/role meta, stack chip, access status (dot colours and the dashed ring for private codebases), action button, screenshot and domain as in the legacy data, EN and ES.
- Wide scenes (`@media (min-width: 960px)`, per the 1.4 decision): sticky 100vh stage; giant white background name rising and fading with `--p`/`--c`; text column fading up with `--c`; screenshot rising from 70vh with a 26° tilt-back easing to flat with `--b`; flying logo moving from the stage centre to its target slot and shrinking to the slot's size with `--a`, rotated −5° at the start; all values from the legacy styles. `scenes.ts` also writes `--lx`, `--ly`, `--ls` (measured as in `index.html:724-729`) on sticky scenes, as AD-10's epic-1 exception allows.
- Narrow layout: stacked cards with logo, meta, actions and screenshot revealing once in view (logo from `scale(0.7) rotate(-6deg)`, screenshot from 40px down at 0.96, legacy durations).
- Others grid: reveal from 48px with 0/110/220 ms stagger; logo row floats with `translateY((0.5 − --p) × speed)` (speeds 80, 110, 60 as in the data); logos tilt on hover.
- External links open in a new tab with `rel="noopener"`; images through `<Picture>` (AVIF/WebP, explicit sizes, lazy, `sizes` set); logo alt text and screenshot alt from the dictionaries; non-translatable data (URLs, domains, stack names, image imports, dates kept per locale where they differ, speeds) in `src/data/projects.ts` joined to dictionary entries by `id`.
- Decision (Dona, 2026-10-29): the hover tilt keeps parity through `src/scripts/tilt.ts`, which writes only `--tilt-x` and `--tilt-y` on `[data-tilt]`; CSS turns them into `perspective(900px) rotateX rotateY scale(1.06)` (120 ms ease-out while moving, 700 ms back on leave), only on hover-capable devices and without reduced motion. AD-10's epic-1 exception is extended to match.
- Hidden starting states only under `html.js` inside `prefers-reduced-motion: no-preference`; without JS or with reduced motion every card, screenshot and logo shows in its final place.

**Never:**
- No "View architecture" buttons and no dialog (story 14), no "More about EcoBike" link to the EcoBike page (story 7 adds it with the route).
- No `style=""`; no script writing anything but the allowed custom properties and `data-*-state`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Wide, scene start | featured scene top at viewport top | logo centred, large; text and shot hidden | No error expected |
| Wide, scene end | scene progress ≥ 0.82 | logo in its slot at slot size; text and shot in place | — |
| Narrow | width < 960px | stacked cards, no pinned scenes | — |
| Others in view | grid 12% visible | cards revealed with stagger | — |
| Hover tilt | pointer over an "other" logo, hover-capable device | logo tilts toward the pointer, eases back on leave | Touch devices: no tilt |
| Reduced motion / no JS | either | everything visible, no pinning, no tilt | — |

</frozen-after-approval>

## Code Map

- `index.html:152-255` -- work section markup (wide scenes 160-210, narrow cards 212-230, others grid 233-254).
- `index.html:836-880` -- `btn`, `ACC` access statuses, `mk` meta labels, `repo` label, project data `P`, `base`, `featured`, `others`.
- `index.html:532-534` -- `workH`, `workP`, `moreH`.
- `index.html:714-729` -- sticky scene progress and logo target measurement; `index.html:805-812` -- tilt.
- `index.html:626-627` -- logo and certificate image sizes (`DIM`).
- `assets/logo-*.webp`, `assets/shot-*.webp` -- copy into `src/assets/`.
- `src/scripts/scenes.ts`, `src/scripts/reveal.ts`, `src/styles/motion.css` -- extend; `src/views/HomeView.astro` -- render after the philosophy section.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/projects.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- project data and copy per the Always bullets.
- [x] `src/assets/` -- logos and screenshots.
- [x] `src/sections/WorkSection.astro` (and small components under `src/components/` if they keep it readable) -- heading, wide scenes, narrow cards, others grid, styles.
- [x] `src/scripts/scenes.ts` -- add `--lx --ly --ls` for sticky scenes; `src/scripts/tilt.ts` per the tilt decision.
- [x] `src/styles/motion.css`, `src/styles/tokens.css`, `src/views/HomeView.astro`.
- [x] `tests/smoke.spec.ts` -- every matrix row; external links carry `target="_blank"` and `rel="noopener"`.

**Acceptance Criteria:**
- Given `npm run parity` with port 8765 free, when comparing the home captures, then the work section matches the legacy site in EN and ES at 375 and 1280 px.
- Given the dist check, when run, then the home page stays under 50 KB of JavaScript.

## Implementation Notes

- Wide scenes and narrow cards are both rendered; CSS shows one at 960px. The flying logo (`[data-logo]`) exists only under `html.js` + no reduced motion; otherwise the same logo sits statically in its `[data-logo-target]` slot, so the final state needs no measurement.
- Per-project style values (logo radius, blend, height, parallax speed) reach CSS through `ProjectVars.astro`, a `display: contents` wrapper with `define:vars` (AD-2's exception), so the values sit on one element per project instead of on every element.
- `motion.css` reveal variants: `data-reveal` (empty value, 40px), `data-reveal="far"` (48px, 110ms stagger by `data-index`), `data-reveal="parts"` (children `[data-reveal-part="pop"|"rise"]`). The tilt CSS also lives in `motion.css`.
- Logo and screenshot alt text are descriptive ("NariñoHoy logo", "The NariñoHoy home page") rather than the bare name the legacy site used.
- `npm run parity` captures with reduced motion; the legacy full-page capture shows the scenes in their starting state (a capture artefact: in the browser the legacy page writes `--a..--c = 1` with reduced motion), so the 1280 px work-section capture differs there by design.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 2, low 1, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `FeaturedScene.astro` screenshot `sizes` undersizes the column on wide screens | medium | patch | `.layout` has no max-width; at 1920px the 1.1fr column is ≈930px but `sizes` says 680px, so 1× screens stretch the 700w file. |
| `scenes.ts` measures and writes hidden scenes every frame and interleaves reads/writes | medium | patch | `display:none` scenes give all-zero rects that pass the off-screen skip; forced layout per scene. |
| `.float` rests at −speed/2 under reduced motion, not its final place | low | patch | `--p:1` under reduced motion vs fallback 0.5 without JS; the plan requires both at the final place; direct correction. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass

**Manual checks (if no CLI):**
- `npm run preview` beside the legacy site: scroll the three scenes at 1280 px and the cards at 375 px; hover the other projects' logos; repeat with reduced motion and JavaScript off.
