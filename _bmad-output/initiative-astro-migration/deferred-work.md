- source_plan: `_bmad-output/initiative-astro-migration/tickets/epic-astro-site-parity/tickets/story-playwright-smoke-tests-and-parity-screenshots-plan.md`
  summary: Give the shared page list (`scripts/pages.mjs`) a way to hold the single bilingual 404 — no `es/` twin, no canonical or hreflang — so story 1.8 can add it to check-dist and the smoke tests.
  evidence: Entries require `en` and `es` paths and every smoke test asserts a self-canonical and hreflang, which AD-8 forbids on the 404; AD-12 still requires check-dist to fail without `dist/404.html`.
- source_plan: `_bmad-output/initiative-astro-migration/tickets/epic-astro-site-parity/tickets/story-under-the-hood-architecture-dialog-matches-plan.md`
  summary: `scripts/check-dist.mjs` counts only the scripts referenced from the HTML, not the chunks they import, so the home JS budget undercounts (≈1.9 KB reported vs ≈3 KB real).
  evidence: Reported by the story 1.14 implementer; the shared `scenes` chunk (885 B gzipped) is imported, not linked. Pre-existing since story 1.5.
- source_plan: `_bmad-output/initiative-astro-migration/tickets/epic-astro-site-parity/tickets/story-under-the-hood-architecture-dialog-matches-plan.md`
  summary: Three Steady Guardians architecture strings (two technology values and one "why") have no Spanish in the legacy site and stay in English in `es.ts`; constraint C4 asks for real Spanish.
  evidence: Copied word for word from legacy `ARCH.sg` for parity; needs Dona's translation or approval to translate.
