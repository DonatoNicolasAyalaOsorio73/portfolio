---
title: 'Home statement sequence and philosophy section match'
type: 'feature'
ticket: '5'
created: '2026-10-29'
status: 'built'
baseline_revision: '4112de3bb88a331b4e768daa11f34cd30c68a2ad'
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

**Problem:** After the hero, the Astro home stops: the pinned "How I work" statement sequence and the philosophy section with its scroll-drawn five-step timeline are missing, so the page cannot match the legacy site.

**Approach:** Port both sections with their copy in the dictionaries and their motion intact: the sequence's active statement comes from a `data-seq-state` set on scroll, the philosophy heading and intro reveal once in view, and the timeline steps draw with scroll progress written by the epic-1 scene script that AD-10 allows. The scene and reveal scripts are written generally, since the work section (story 13) and later sections reuse them.

## Boundaries & Constraints

**Always:**
- Statement sequence parity (`index.html:111-127`, logic `index.html:826-830`, scroll math in `tick()` `index.html:704-713`): a 300vh section with a sticky 100vh stage; four statements at the same place, the active one shown, earlier ones moved up 60px and later ones down 60px at 0.97 scale, faded out (700 ms opacity, 900 ms transform); four progress bars (active 48px wide, passed and active ink, others 12% black; 500 ms) with monospace labels (RELIABILITY, SCALABILITY, ALIGNMENT, SPEED / CONFIABILIDAD, ESCALABILIDAD, ALINEACIÓN, VELOCIDAD). The active index is `floor(progress × 4)` clamped to 0–3, where progress = scrolled distance through the section ÷ (section height − viewport).
- Philosophy parity (`index.html:129-150`): heading and intro fade up 40px when 12% visible (900 ms; intro delayed 120 ms); five steps ("01"–"05") each with the word filling from grey to ink left to right, sliding in from −60px and from 30% to full opacity, a dot scaling in, a vertical line drawing down (not after the last step), and note and "How:" line fading up 20px. Progress per step follows the legacy `pass` scene: `p = (vh − top) ÷ (vh + height)`; `--a` eases over 0.04–0.38, `--b` over 0.28–0.66, `--c` over 0.5–0.82 with the legacy cubic in-out easing.
- AD-10 holds: `src/scripts/scenes.ts` writes only `--p --a --b --c` (and later `--lx --ly --ls`) on `[data-scene]`; `src/scripts/sequence.ts` sets only `data-seq-state`; `src/scripts/reveal.ts` sets only `data-reveal-state="visible"`; scripts are rAF-throttled and passive.
- Content is never hidden without JavaScript or under reduced motion: CSS defaults are the final state (`var(--c, 1)` and so on); hidden starting states exist only under `html.js` inside `prefers-reduced-motion: no-preference`. Without JavaScript, or with reduced motion, the sequence renders as a static stacked list of the four statements with all bars and labels in their final state, like the legacy reduced-motion layout.
- Print shows both sections fully, as the legacy print rules do.
- All copy in both dictionaries: section labels, statements, labels, heading, intro, five steps (word, note, how) and the "How:" label; lists are arrays with stable `id`s.

**Never:**
- No work section, scenes for other sections, or new motion beyond the legacy behaviour.
- No `style=""`, no inline script, no storage; no scroll listener per element.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Sequence start | section top at viewport top | `data-seq-state="0"`, first statement and bar active | No error expected |
| Sequence middle | progress 0.6 | state `2` | — |
| Sequence end | progress ≥ 1 | state `3` | — |
| Step in view | a step half through the viewport | `--a`, `--b`, `--c` between 0 and 1 per the eased windows | — |
| Reduced motion | `prefers-reduced-motion: reduce` | sequence stacked and static; steps fully drawn; reveals shown | — |
| No JavaScript | scripts disabled | same as reduced motion | — |

</frozen-after-approval>

## Code Map

- `index.html:111-127` -- sequence markup; `index.html:826-830` -- statements, labels, per-item state and stage sizes (`seqS`, sticky vs relative under reduced motion).
- `index.html:129-150` -- philosophy markup; `index.html:529-531`, `index.html:554` -- `seqLabel`, `philH`, `philP`, `philLabel`; `index.html:831-834` -- the five steps (`W`) EN/ES and `howL`.
- `index.html:704-722` -- `tick()`: sequence index, `pass` scene progress, `seg()` windows and `ease()`.
- `index.html:657-661` -- reveal observer: threshold 0.12, rootMargin `0px 0px -6% 0px`, unobserve after first reveal.
- `index.html:53` -- print rules for `[data-reveal]` and `[data-print-seq]`.
- `src/views/HomeView.astro` -- add the two sections after `HeroSection`.
- `src/styles/motion.css` -- `[data-reveal]` rules belong here (AD-9); `src/styles/tokens.css` -- new tokens via the table.
- `src/scripts/nav.ts` -- pattern for a passive, rAF-throttled listener.
- `tests/smoke.spec.ts` -- add sequence-state and no-JS visibility tests.

## Tasks & Acceptance

**Execution:**
- [ ] `src/i18n/en.ts`, `src/i18n/es.ts` -- `sequence.{label,items[{id,statement,label}]}`, `philosophy.{label,heading,intro,howLabel,steps[{id,word,note,how}]}`.
- [ ] `src/sections/StatementSequence.astro` -- markup, scoped styles for every state, reduced-motion/no-JS layout, print.
- [ ] `src/sections/PhilosophySection.astro` -- markup with `data-reveal` and `data-scene="pass"`, styles driven by the custom properties.
- [ ] `src/scripts/sequence.ts`, `src/scripts/scenes.ts`, `src/scripts/reveal.ts` -- per the Always bullets.
- [ ] `src/styles/motion.css`, `src/styles/global.css`, `src/styles/tokens.css` -- reveal rules, print rules, tokens.
- [ ] `src/views/HomeView.astro` -- render both sections.
- [ ] `tests/smoke.spec.ts` -- sequence state at start, middle and end; with JavaScript off and with reduced motion, all statements and steps visible.

**Acceptance Criteria:**
- Given `npm run parity` with port 8765 free, when comparing the home captures, then both sections match the legacy site in EN and ES at 375 and 1280 px.
- Given the dist check, when run, then the home page stays far under 50 KB of JavaScript.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 0, low 1, false 0, maybe-false 0. Matrix audit before review added the missing "Step in view" test.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `tokens.css` "Used by" misses PhilosophySection on `--space-24` and StatementSequence on `--dur-reveal` | low | patch | Confirmed at `PhilosophySection.astro:58` and `StatementSequence.astro:133`; corrected the two cells. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass

**Manual checks (if no CLI):**
- `npm run preview` beside the legacy site: scroll through both sections at 1280 and 375 px; repeat with reduced motion and with JavaScript off.
