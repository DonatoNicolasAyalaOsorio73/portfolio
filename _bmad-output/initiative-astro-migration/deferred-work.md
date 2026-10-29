- source_plan: `_bmad-output/initiative-astro-migration/tickets/epic-astro-site-parity/tickets/story-playwright-smoke-tests-and-parity-screenshots-plan.md`
  summary: Give the shared page list (`scripts/pages.mjs`) a way to hold the single bilingual 404 — no `es/` twin, no canonical or hreflang — so story 1.8 can add it to check-dist and the smoke tests.
  evidence: Entries require `en` and `es` paths and every smoke test asserts a self-canonical and hreflang, which AD-8 forbids on the 404; AD-12 still requires check-dist to fail without `dist/404.html`.
