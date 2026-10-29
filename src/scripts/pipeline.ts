/**
 * BMAD pipeline (AD-10): sets `data-pipe-state` on each `[data-pipe]` list to the index of the
 * active phase, and nothing else. Every 1400ms the active phase advances, wrapping, while the
 * list's section is on screen and its `[data-reveal]` heading has been revealed; never while the
 * tab is hidden or with reduced motion. Every look is CSS in `AiSection.astro`.
 */
const STEP_MS = 1400;

const lists = Array.from(document.querySelectorAll<HTMLElement>('[data-pipe]'));

if (lists.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Any part of the element is inside the viewport. */
  const inView = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  window.setInterval(() => {
    if (reducedMotion.matches || document.hidden) return;
    for (const list of lists) {
      const section = list.closest('section') ?? list;
      const heading = section.querySelector<HTMLElement>('[data-reveal]');
      if (heading && heading.dataset.revealState !== 'visible') continue;
      if (!inView(section)) continue;
      const count = list.children.length;
      if (!count) continue;
      list.dataset.pipeState = String((Number(list.dataset.pipeState ?? 0) + 1) % count);
    }
  }, STEP_MS);
}

// A module, so its names stay out of the global scope.
export {};
