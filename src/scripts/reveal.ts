/**
 * One-time reveals (AD-10): sets `data-reveal-state="visible"` on each `[data-reveal]` once 12%
 * of it is in view, and nothing else. The hidden starting state and the transition are CSS
 * (`motion.css`), only under `html.js` with no reduced-motion preference.
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

const show = (el: HTMLElement) => {
  el.dataset.revealState = 'visible';
};

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduce || typeof IntersectionObserver === 'undefined') {
  targets.forEach(show);
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}
