/**
 * Pinned statement sequence (AD-10): sets `data-seq-state` on each `[data-seq]` to the index of
 * the active `[data-seq-item]`, and nothing else. The index is `floor(progress × items)`, clamped
 * to the last item, where progress is the distance scrolled through the section divided by its
 * height minus the viewport. Every look hangs off the attribute in `StatementSequence.astro`.
 */
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-seq]'));

if (sections.length) {
  let frame = 0;

  const tick = () => {
    frame = 0;
    const vh = window.innerHeight;
    for (const section of sections) {
      const count = section.querySelectorAll('[data-seq-item]').length;
      if (!count) continue;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - vh)));
      const state = String(Math.min(count - 1, Math.floor(progress * count)));
      if (section.dataset.seqState !== state) section.dataset.seqState = state;
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  tick();
}
