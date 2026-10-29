---
title: 'Under-the-hood architecture dialog matches'
type: 'feature'
ticket: '14'
created: '2026-10-29'
status: 'built'
baseline_revision: '37b45924d6d96208b445a353789e26c03c3f9524'
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

**Problem:** Every project on the legacy home has a "View architecture" button that opens an "Under the hood" dialog with its build flow and architecture nodes; the Astro work section has neither, so the most technical part of the portfolio is missing.

**Approach:** Prerender one native `<dialog>` per project (NariñoHoy, Steady Guardians, EcoBike, Siesa MES, Centro de Estudios Andino, Cognitios) with all its copy in the dictionaries, add the "View architecture" buttons to the featured scenes, the narrow cards and the other-project cards, and drive opening, node selection and the cycling flow with one script that sets only state attributes.

## Boundaries & Constraints

**Always:**
- Parity with `index.html:441-488`, data `index.html:562-620` (`ARCH`: intro, optional four-step flow, nodes with code, label, sub, role, tech, optional why and trade-off) and logic `index.html:755-780`, `index.html:946-958`: black rounded panel up to 1240px wide and 94vh tall, scrollable, anchored to the bottom over a blurred scrim that darkens to 45% black; panel fades in and rises from 60px (500 ms opacity, 600 ms transform; scrim 400 ms); header with the logo tile, "UNDER THE HOOD" / "POR DENTRO" and the title "<name>: how it's built." / "<name>: cómo está hecho."; Close button; intro; flow steps where the active one turns white and lifts 4px, advancing every 1400 ms while open (not under reduced motion); node list with the first node selected, the selected one blue-tinted with a `#6FA8FF` border, and connector lines between nodes; a sticky detail card showing the selected node's code, label, ROLE, TECHNOLOGY, and WHY and TRADE-OFF when present, announced politely.
- Native `<dialog>` opened with `showModal()`: the page behind is inert, Escape closes, focus goes to Close on open and returns to the button that opened it on close; clicking the scrim closes only when both press and release happen on the scrim (legacy `scrimDown`/`scrimArch`); the page does not scroll behind the open dialog.
- One script, `src/scripts/arch.ts`, changes the DOM only through `data-arch-state` (closed / in), `data-arch-node` (selected index), `data-flow-state` (active flow step), the native dialog open/close calls, and the matching `aria-pressed` on node buttons; every look comes from CSS on those attributes. Scripts carry no visible strings: each dialog's text is in its HTML.
- "View architecture" / "Ver arquitectura" buttons in the three layouts from story 13, styled as in legacy (`index.html:181`, `:223`, `:248`); they show only when JavaScript runs (`html.js`), since the dialog needs it.
- Reduced motion: no transitions, no flow cycling, closing is immediate (legacy waits 280 ms otherwise).
- All copy in both dictionaries, joined to `src/data/projects.ts` by project `id`; node and flow lists are arrays with stable ids.

**Never:**
- No change to the scenes, cards or grid beyond adding the button; no contact mail dialog (story 6).
- No `style=""`, no inline script, no storage.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Open | click "View architecture" on EcoBike | EcoBike dialog open, first node selected, focus on Close, page behind inert | No error expected |
| Select node | click node 3 | node 3 pressed and highlighted; detail card shows node 3 | — |
| Flow | dialog open 1.5 s, motion allowed | active flow step moves from 1 to 2 | — |
| Escape | press Escape | dialog closes; focus back on the opening button | — |
| Scrim click | press and release on the scrim | closes | Press inside, release on scrim: stays open |
| Reduced motion | open and close | no animation, no cycling, immediate close | — |
| No JavaScript | page loads | no architecture buttons shown | — |
| Project without flow | Cognitios | no flow row | — |

</frozen-after-approval>

## Code Map

- `index.html:441-488` -- dialog markup; `index.html:181`, `:223`, `:248` -- the three button styles.
- `index.html:559` -- `fRole`, `fTech`, `fWhy`, `fTrade`; `index.html:558` -- `uth`, `close`; `index.html:534` -- `archBtn`.
- `index.html:562-620` -- `ARCH` per project (37 nodes in all, built with `N(code, label, sub, role, tech, why?, tradeoff?)`).
- `index.html:649` -- Escape; `index.html:667-674` -- flow cycling every 1400 ms, paused when hidden or reduced motion; `index.html:755-780` -- open/close timing, focus return, scrim click rule.
- `src/data/projects.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- extend with architecture data and copy.
- `src/components/FeaturedScene.astro`, `FeaturedCard.astro`, `OtherProject.astro` -- add the button.
- `src/sections/WorkSection.astro` -- render the six dialogs (a new `src/components/ArchDialog.astro`).
- `tests/smoke.spec.ts` -- matrix rows.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/projects.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- architecture data and copy for all six projects, word for word.
- [x] `src/components/ArchDialog.astro` -- one dialog per project with scoped styles for every state.
- [x] `src/components/FeaturedScene.astro`, `FeaturedCard.astro`, `OtherProject.astro`, `src/sections/WorkSection.astro` -- buttons and dialogs.
- [x] `src/scripts/arch.ts` -- open, close, scrim rule, focus return, node selection, flow cycling.
- [x] `src/styles/tokens.css` -- tokens via the table.
- [x] `tests/smoke.spec.ts` -- every matrix row in EN and ES.

**Acceptance Criteria:**
- Given the smoke tests, when they run, then every matrix row passes in both languages.
- Given keyboard only, when tabbing to a "View architecture" button, opening, moving through nodes and pressing Escape, then focus never leaves the dialog while open and returns to the button after.
- Given the dist check, when run, then the home page stays under 50 KB of JavaScript.

## Implementation Notes

- Copy extracted programmatically from `index.html` `ARCH` (37 nodes) into `work.architecture.projects` in both dictionaries; non-translatable ids, node codes and flow step ids live on each project's `architecture` in `src/data/projects.ts`. Strings legacy had only in English (three Steady Guardians `tech`/`why` values) stay English in `es.ts`, as `L()` showed them. Node ids are slugs of the English label, since codes repeat (Andino's V01/V02).
- The `<dialog>` element itself is the scrim (full screen, blurred); `::backdrop` is transparent, so a click whose target is the dialog is a scrim click. Escape goes through `cancel` (prevented, then the 280 ms close); a forced browser close is handled by the `close` event.
- One detail pane per node is prerendered; `data-arch-node` picks the visible one with enumerated selectors (up to 8 nodes), and flow steps likewise (4). The active flow step look exists only under `prefers-reduced-motion: no-preference`, as legacy showed none with reduced motion.
- Scroll lock is `html:has(dialog[data-arch][open]) { overflow: hidden }` (on `html`, since `html` has `overflow-x: clip` and body overflow would not propagate).
- Other-project rows with no external links (Andino, Cognitios) now always render the actions row for the button; it is hidden without `html.js`.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 2, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `ArchDialog.astro` lacks `-webkit-backdrop-filter`; Safari ≤17 shows no blur | medium | patch | No autoprefixer in the build; legacy and `Nav.astro` set both. |
| Press on scrim, release in panel closes the dialog | low | patch | `click` targets the common ancestor (the dialog); legacy has the same gap, but the plan's rule requires both on the scrim. |
| Keyboard test passes when focus escapes to `body` and never tabs to the button | medium | patch | `focusInside` returns true for `body`; button focused with `.focus()`. |
| Shared `opener` misused when one dialog closes as another opens | low | patch | Queued `close` event clears the new opener; latent today (page inert), direct fix with a per-dialog map. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass

**Manual checks (if no CLI):**
- `npm run preview` beside the legacy site: open each project's dialog in EN and ES, compare panel, flow and nodes; repeat with reduced motion.
