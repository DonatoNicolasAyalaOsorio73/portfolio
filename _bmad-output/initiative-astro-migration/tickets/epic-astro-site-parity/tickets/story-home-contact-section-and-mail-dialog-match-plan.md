---
title: 'Home contact section and mail dialog match'
type: 'feature'
ticket: '16'
created: '2026-10-29'
status: 'built'
baseline_revision: '322c948cb4bf64e442faf78702bf4bc859884f9b'
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

**Problem:** The Astro home ends without its contact section, so visitors cannot email, message on WhatsApp, download the CV or copy the address, and the mail-drafting dialog is missing; the nav's Contact button and the hero's "Get in touch" point at nothing.

**Approach:** Port the contact section and the "Write to me" dialog with copy in the dictionaries and contact data in `src/data/contact.ts`, as progressive enhancement: without JavaScript "Send an email" is a plain `mailto:` link; with it, the link opens a native `<dialog>` that drafts the message and hands it to the visitor's email app or Gmail. One `src/scripts/contact.ts` drives the dialog and the copy button, sharing the dialog open/close/scrim/focus behaviour with `arch.ts` through a small module.

## Boundaries & Constraints

**Always:**
- Contact parity (`index.html:416-430`, copy `index.html:547-551`, data `index.html:625`, `index.html:964-968`): `#contact` section, heading "Let's build something worth engineering." revealing (1100 ms), paragraph, three pill buttons — "Send an email" (ink), WhatsApp (`#25D366`, opens `wa.me/573188401253` with the prefilled "Hi Donato, I saw your portfolio." / "Hola Donato, vi tu portafolio."), "Download CV" (`/assets/cv-donato-ayala.pdf`, `download`) — with their icons and hover scale; then the email link (`mailto:` with subject "Hello Donato" / "Hola Donato"), the Copy button, the phone link to WhatsApp, LinkedIn ↗ and GitHub ↗.
- Copy button: copies the address with the Clipboard API; on success shows "Copied ✓" (ink background, white text) for 2 s and announces "Email address copied."; on failure shows "Copy failed" in `#B42318` for 5 s, selects the address text and announces the manual-copy message; announcements in a polite live region. Shown only with JavaScript.
- Mail dialog parity (`index.html:490-516`, copy `index.html:542-546`, logic `index.html:790-798`, `index.html:969-975`): white panel up to 620px centred over a 40% black blurred scrim, entering from 40px down at 0.97; title "Write to me.", "To: <address>", round close button; fields name (optional, `autocomplete="name"`), subject and message (required, placeholders from legacy); "Open in email app" submits to `mailto:` with the subject and the body plus "\n\n— <name>" when a name is given; "Send with Gmail" opens Gmail's compose URL with the same fields; both look disabled (40% opacity) until subject and message have text, and Gmail is not activatable then; the note under the buttons reads the privacy note, the missing-fields message after an empty submit, or the "sent" message after opening the email app.
- Dialog behaviour as in story 14: `showModal()`, inert page, Escape, focus to the name field on open and back to the opener on close, press-and-release scrim rule, no page scroll behind, immediate close under reduced motion. The shared logic lives in one module both scripts import; `arch.ts` keeps its tests green.
- Scripts carry no visible strings: every label and message is in the HTML, chosen by `data-copy-state` (idle / ok / fail) and `data-mail-state` (note / missing / sent); the address comes from a `data-*` attribute. The script may also set the Gmail link's `href` and `aria-disabled`, which are navigation and accessibility state, not style.
- Nothing is stored or sent by the site; the privacy note stays true. Links leave the site only by navigation.
- Nav "Contact" and hero "Get in touch" anchors land on `#contact`.

**Never:**
- No form submission to any server, no third-party script, no storage.
- No change to earlier sections beyond what anchoring needs.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No JavaScript | click "Send an email" | browser follows the `mailto:` link | Copy button hidden |
| Open dialog | click "Send an email" with JS | dialog open, focus in the name field, page inert | — |
| Empty submit | subject or message empty, submit | missing-fields note; no navigation | — |
| Valid submit | subject + message (+ name) | navigates to `mailto:` with encoded subject and body ending "— <name>"; "sent" note | — |
| Gmail | fields valid | Gmail link enabled with the same encoded fields | Disabled and not focusable-activatable while invalid |
| Copy ok | clipboard allowed | "Copied ✓" for 2 s, announced | — |
| Copy fails | clipboard rejected | "Copy failed" for 5 s, address selected, announced | — |
| Escape / scrim | inside the open dialog | closes, focus back on the opener | Drag from panel to scrim: stays open |
| Reduced motion | open and close | no animation, immediate close | — |

</frozen-after-approval>

## Code Map

- `index.html:416-430` -- contact markup with the button icons (inline SVG); `index.html:490-516` -- mail dialog.
- `index.html:542-551` -- dialog and contact copy; `index.html:625` -- `EMAIL`; `index.html:782-798` -- `copyEmail`, `mailParts`, `sendMail`; `index.html:945`, `:964-975` -- `mailHref`, `waHref`, copy states, mail states, `gmailHref`.
- `src/scripts/arch.ts` -- dialog logic to extract into a shared module (`src/scripts/dialog.ts`).
- `src/components/ArchDialog.astro` -- dialog styling patterns to mirror.
- `public/assets/cv-donato-ayala.pdf` -- already in place.
- `src/views/HomeView.astro` -- render after the certificates section.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/contact.ts`, `src/i18n/en.ts`, `src/i18n/es.ts` -- address, phone, profile URLs, prefilled texts and all copy.
- [x] `src/sections/ContactSection.astro`, `src/components/MailDialog.astro`.
- [x] `src/scripts/dialog.ts` (shared), `src/scripts/contact.ts`; `src/scripts/arch.ts` -- switch to the shared module.
- [x] `src/styles/tokens.css`, `src/views/HomeView.astro`.
- [x] `tests/smoke.spec.ts` -- every matrix row in EN and ES (stub the clipboard and intercept `mailto:` navigations in the tests).

**Acceptance Criteria:**
- Given the smoke tests, when they run, then every matrix row passes in both languages and the architecture-dialog tests still pass.
- Given `npm run parity`, when comparing the home captures, then the contact section matches the legacy site at 375 and 1280 px.
- Given the dist check, when run, then the home page stays under 50 KB of JavaScript.

## Implementation Notes

- The mail dialog's open state is `data-mail-dialog-state` on `<dialog data-mail-dialog>`, because `data-mail-state` (note / missing / sent) is on the form `[data-mail]`.
- `dialog.ts` exports `createModal({ stateKey, focusTarget, beforeOpen, afterOpen, onClose, onClick })`; `arch.ts` keeps its attributes and behaviour.
- The form is `novalidate` so an empty or whitespace-only submit reaches the script and shows the missing-fields note; `required` stays for assistive technology.
- The send button's 40% look follows the Gmail link's `aria-disabled` through `:has()`, so no extra state.
- Heading reveal is a new `data-reveal="slow"` look in `motion.css` (40px, 1100 ms).
- Inputs keep the global `:focus-visible` ring (legacy removed the outline); the only visible parity difference.
- Token values equal to existing ones reuse them (`--dur-tile` 450ms, `--size-photo-column` 200px, `--color-line-hover` 40% black, `--size-journey-dot` 12px blur); the token table was re-padded to fit the longer "Used by" lists.
- Tests read `mailto:` navigations through the DevTools protocol (`Page.frameRequestedNavigation`) and stub `navigator.clipboard` with an init script.

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens), 2026-10-29 — high 0, medium 1, low 2, false 0, maybe-false 0.

| Finding | Verdict | Route | Evidence |
| --- | --- | --- | --- |
| `--size-textarea` duplicates `--size-bmad-travel` (140px) | low | patch | AD-2 reuse rule. |
| Copy timing tests measure from the wrong moment and can hang | medium | patch | `untilIdle` starts after several awaited checks; observer may attach after the state returns to idle. |
| A repeated successful copy is not re-announced | low | patch | Setting `ok` while already `ok` changes nothing in the live region; legacy had the same gap, but the plan states the announcement unconditionally. |

## Verification

**Commands:**
- `npm run check && npm run lint && npm run format:check` -- expected: 0 errors
- `npm run build && npm run check:dist && npm run test:smoke` -- expected: all pass (if another session's `astro preview` holds the project, run Playwright against `dist/` served by `python -m http.server` with a temporary uncommitted config; never stop that server)

**Manual checks (if no CLI):**
- `npm run preview`: send a draft through the email app and Gmail, copy the address, use the dialog by keyboard; repeat with reduced motion and JavaScript off.
