/**
 * Epic-1 scroll scenes (AD-10 exception): writes the scroll-progress custom properties `--p`,
 * `--a`, `--b` and `--c` on each `[data-scene]` element, and nothing else. Epic 2 replaces it
 * with `animation-timeline` and deletes it.
 *
 * `pass` scenes measure how far the element has travelled through the viewport,
 * `(vh − top) ÷ (vh + height)`; `sticky` scenes measure the distance scrolled through the
 * element, `−top ÷ (height − vh)`. `--a`, `--b` and `--c` ease that progress over three
 * overlapping windows. With reduced motion every property is written at its final value, 1.
 */
const scenes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));

/** The windows of progress over which `--a`, `--b` and `--c` run from 0 to 1. */
const WINDOWS = [
  ['--a', 0.04, 0.38],
  ['--b', 0.28, 0.66],
  ['--c', 0.5, 0.82],
] as const;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Cubic ease-in-out, as in the legacy scenes. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

if (scenes.length) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const write = (scene: HTMLElement, name: string, value: number) => {
    scene.style.setProperty(name, value.toFixed(4));
  };

  const tick = () => {
    frame = 0;
    const vh = window.innerHeight;
    const reduce = reducedMotion.matches;
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      // Far off screen: nothing visible changes, so skip the writes.
      if (!reduce && (rect.bottom < -vh || rect.top > vh * 2)) continue;
      const raw =
        scene.dataset.scene === 'sticky'
          ? -rect.top / Math.max(1, rect.height - vh)
          : (vh - rect.top) / (vh + rect.height);
      const p = reduce ? 1 : clamp(raw);
      write(scene, '--p', p);
      for (const [name, start, end] of WINDOWS) {
        write(scene, name, reduce ? 1 : ease(clamp((p - start) / (end - start))));
      }
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  tick();
}
