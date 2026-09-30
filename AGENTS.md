<!-- bmad:context -->
<!-- Verified 2026-09-30 against 2f3b64d. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## portfolio (donacode.link)

Donato Ayala's bilingual (EN/ES) personal portfolio, published as static files from the `main` root by GitHub Pages (`CNAME`, `.nojekyll`). No build step, package manager, or tests. Pages are `<x-dc>` templates rendered in the browser by `support.js`, which loads React 18.3.1 and Babel from unpkg. BMad planning output goes to `_bmad-output/`.

## Policy

- Never push to `main`; every change goes through a pull request. Merging to `main` deploys donacode.link.
- Never edit `support.js`: it is generated from `dc-runtime/src/*.ts`, which is not in this repo. Work around runtime limits in the page's logic block instead.
- Keep `privacy.html` true: no cookies, no analytics, only `localStorage['da-lang']`. A change that adds storage, tracking, or third-party requests updates both the EN and ES text of `privacy.html` in the same change.

## Where things are

- Markup: the `<x-dc>` block of `index.html` / `privacy.html`. Logic, copy (`TX`) and data: the `<script type="text/x-dc" data-dc-script>` block at the end of each file.
- Images and CV: `assets/`.

## Running and verifying

- Preview with `python -m http.server 8765` from the repo root, then open http://localhost:8765/.
- After a change, read the browser console: the runtime catches logic errors and only logs them, so the page still looks fine.

## Conventions that differ from defaults

- Templates use dc-runtime syntax, not JSX: `{{ expr }}`, `<sc-if value="">`, `<sc-for list="" as="">`, `style-hover=""`. They only see the values returned by the render data object in the logic block.
- Styles are inline `style=""` attributes; do not add stylesheets or CSS files. The only `<style>` is the reset and print rules inside `<helmet>`.
- Every visible string goes in `TX` as `L('en', 'es')` with a real Spanish translation; if `es` is missing, `L` silently shows English.
- Add images as WebP at twice their largest displayed size, with explicit `width`/`height`; never commit full-size PNGs — the page carried over 10 MB of images before.

## Known pitfalls

- The runtime calls `componentDidUpdate(prevProps)` without `prevState` (`support.js:1013`); keep your own copy of the previous state to compare.
- Do not add `hreflang` or per-language canonicals for `?lang=` URLs: the static `<head>` cannot vary by query, so crawlers treat the Spanish URL as a duplicate. `?lang=` is only a shareable language switch.

<!-- /bmad:context -->
