---
title: 'Nav, footer and language switch match the current site'
type: 'feature'
ticket: '4'
created: '2026-10-28'
status: 'built'
baseline_revision: '0051e1fff4e219347f253990f571a23cdc66aa1f'
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

**Problem:** The Astro pages have no nav, footer or way to change language, so they cannot match the current site and visitors on `/es/` cannot get back to English.

**Approach:** Port the legacy header (with its scroll morph and hide-on-scroll), the footer and the EN/ES toggle into components that `BaseLayout` renders once on every page, with the toggle as two plain links to the twin URL and the scroll behaviour driven by one small script that only sets `data-nav-state`.

## Boundaries & Constraints

**Always:**
- Visual and motion parity with the legacy header (`index.html:59-78`, state from `index.html:704-708` and `index.html:824-825`): at the top a full-width black bar (white text, links at 78% white, CTA white on black); after 40px of scroll a centred white translucent pill (`max-width: 900px`, radius 999px, blur, hairline border, soft shadow); when scrolling down past 400px it slides up out of view (`translateY(-120%)`) and returns on any upward scroll of more than 4px or when anything inside it gets focus. Transitions keep the legacy durations and easing (700 ms shape, 500 ms colour and slide, 250 ms toggle, 200 ms CTA scale); AD-9's epic-1 exception covers the non-composite properties.
- Nav links (Work, Stack, Journey, About → `#work`, `#stack`, `#journey`, `#about` on the home page) show only on wide screens; the brand link, the EN/ES toggle and the Contact CTA always show.
- The toggle is two `<a>` elements built with `twin()`/`href()`, the current one marked `aria-current="true"` and styled as the legacy pressed pill; nothing is stored.
- Footer matches `index.html:434-439`: name in bold, role, "© 2026".
- One script, `src/scripts/nav.ts`, sets `data-nav-state` (`top`, `scrolled`, `hidden`) on the header; all looks come from CSS on that attribute. Without JavaScript the header stays in its top state and the page works.
- All copy (nav label, link labels, language-group label, Contact, role) lives in both dictionaries; every `href` comes from `routes.ts`.
- `Nav` and `Footer` are imported only by `BaseLayout`.
- Decision (Dona, 2026-10-28): the nav links show at `@media (min-width: 960px)` per AD-2; the legacy 900px width and 620px height conditions are not kept.

**Never:**
- No privacy link in the footer yet (story 8 adds the privacy route and the link together, since `routes.ts` and the page list must stay in step).
- No mobile menu or new behaviour the legacy site lacks; no change to the hero.
- No `style=""`, no inline script, no storage.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Top of page | `scrollY ≤ 40` | `data-nav-state="top"`, black full-width bar | No error expected |
| Scrolled | `40 < scrollY`, moving up or still | `scrolled`, white pill | — |
| Scrolling down | `scrollY > 400`, delta > 4px down | `hidden`, header off-screen | Focus inside the header shows it again |
| Scrolling up | delta > 4px up | back to `scrolled` | — |
| Language switch | click ES on `/` | navigates to `/es/`; nothing stored | — |
| Reduced motion | `prefers-reduced-motion: reduce` | states still change, without transitions | — |
| No JavaScript | script disabled | header stays in `top` state, links work | — |

</frozen-after-approval>

## Code Map

- `index.html:56-78` -- legacy skip link and header markup; `index.html:434-439` -- footer.
- `index.html:704-708` -- `tick()`: `scrolled = y > 40`; `hidden` rule; rAF-throttled scroll listener at `index.html:646-650`.
- `index.html:824-825` -- every colour, padding, radius and shadow of both nav states and the toggle pills.
- `index.html:631` -- legacy wide test: `innerWidth >= 900 && innerHeight >= 620`.
- `index.html:553-558`, `index.html:961` -- copy for `navLabel`, `langLabel`, `contact`, `role`, `privacy`, nav link labels.
- `src/layouts/BaseLayout.astro` -- already renders the skip link and `<main id="top">`; add `<Nav>` before `<main>` and `<Footer>` after it.
- `src/i18n/routes.ts` -- `href()`, `twin()`; `src/i18n/en.ts`/`es.ts` -- add `chrome.*` keys.
- `src/styles/tokens.css` -- add tokens through its header table (AD-2).
- `tests/smoke.spec.ts` -- extend: switch link targets the twin; no storage after clicking it.

## Tasks & Acceptance

**Execution:**
- [ ] `src/i18n/en.ts`, `src/i18n/es.ts` -- `chrome.navLabel`, `chrome.langLabel`, `chrome.contact`, `chrome.links.{work,stack,journey,about}`, `chrome.role`.
- [ ] `src/components/Nav.astro`, `src/components/LangSwitch.astro` -- header markup, scoped styles for both states and `hidden`, `:focus-within` reveal; `LangSwitch` takes `locale` and `route`.
- [ ] `src/scripts/nav.ts` -- passive, rAF-throttled scroll listener setting `data-nav-state` per the matrix.
- [ ] `src/components/Footer.astro` -- legacy footer.
- [ ] `src/layouts/BaseLayout.astro` -- render `Nav` and `Footer` once.
- [ ] `src/styles/tokens.css` -- new tokens with table rows.
- [ ] `tests/smoke.spec.ts` -- language-switch link and nav-state tests.

**Acceptance Criteria:**
- Given `npm run parity`, when comparing the home captures, then the header and footer match the legacy site in EN and ES at 375 and 1280 px.
- Given the smoke tests, when they run, then the switch on each page links to its twin and scrolling sets `scrolled` then `hidden`.
- Given the dist check, when run, then the home page stays far under 50 KB of JavaScript.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-28 — high 0, medium 2, low 1, false 0, maybe-false 1.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| AC 1: `npm run parity` not re-run after the chrome landed | maybe-false | defer to Dona's review | The implementer compared header and footer crops against the legacy server already on 8765 (EN/ES, 375/1280) but the full parity run refuses while that foreign server holds the port. Settled by rerunning `npm run parity` once 8765 is free; Dona reviews all captures before cutover (story 10). |
| `chrome.fullName`, `chrome.copyright`, `chrome.langNames` in the dictionaries break AD-4 | medium | patch | Same value in both locales; AD-4 puts non-translatable data in `src/data/`. Move to `src/data/chrome.ts`. |
| `tokens.css` consumer column stale for reused tokens | low | patch | Confirmed for `--color-line`, `--font-size-17` and others; AD-2 makes the table the record. Direct correction. |
| Smoke "header scroll state" depends on the hero's height | medium | patch | ~980px document at 1280×400 clamps `scrollTo(600/700)`; passes by accident. Test must make the page tall enough itself. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass

**Manual checks (if no CLI):**
- `npm run preview`: scroll down and up, tab into the hidden header, switch language; repeat with reduced motion and with JavaScript disabled.
