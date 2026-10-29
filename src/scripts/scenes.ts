/**
 * Epic-1 scroll scenes (AD-10 exception): writes the scroll-progress custom properties `--p`,
 * `--a`, `--b` and `--c` on each `[data-scene]` element, plus `--lx`, `--ly` and `--ls` on sticky
 * scenes that fly a logo, and nothing else. Epic 2 replaces it with `animation-timeline` and
 * deletes it.
 *
 * `pass` scenes measure how far the element has travelled through the viewport,
 * `(vh − top) ÷ (vh + height)`; `sticky` scenes measure the distance scrolled through the
 * element, `−top ÷ (height − vh)`. `--a`, `--b` and `--c` ease that progress over three
 * overlapping windows. With reduced motion every progress property is written at its final
 * value, 1.
 *
 * A sticky scene with a `[data-stage]`, a `[data-logo-target]` slot and a flying `[data-logo]`
 * also gets the slot's centre relative to the stage (`--lx`, `--ly`, in px) and the slot's width
 * as a fraction of the logo's (`--ls`), so CSS can move the logo from the stage centre into
 * the slot as `--a` runs.
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

  /** Where the flying logo lands: the target slot's centre and its size relative to the logo. */
  const measureLogo = (scene: HTMLElement) => {
    const stage = scene.querySelector<HTMLElement>('[data-stage]');
    const target = scene.querySelector<HTMLElement>('[data-logo-target]');
    const logo = scene.querySelector<HTMLElement>('[data-logo]');
    if (!stage || !target || !logo) return null;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    return {
      x: targetRect.left + targetRect.width / 2 - stageRect.left,
      y: targetRect.top + targetRect.height / 2 - stageRect.top,
      s: targetRect.width / Math.max(1, logo.offsetWidth),
    };
  };

  const tick = () => {
    frame = 0;
    const vh = window.innerHeight;
    const reduce = reducedMotion.matches;
    // Read every rect for this frame first, then write, so the writes never force a layout.
    const updates = [];
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      // Not rendered (`display: none`, e.g. the wide scenes below 960px): nothing to drive.
      if (!rect.width && !rect.height) continue;
      // Far off screen: nothing visible changes, so skip the writes.
      if (!reduce && (rect.bottom < -vh || rect.top > vh * 2)) continue;
      const sticky = scene.dataset.scene === 'sticky';
      const raw = sticky
        ? -rect.top / Math.max(1, rect.height - vh)
        : (vh - rect.top) / (vh + rect.height);
      updates.push({ scene, p: reduce ? 1 : clamp(raw), logo: sticky ? measureLogo(scene) : null });
    }
    for (const { scene, p, logo } of updates) {
      write(scene, '--p', p);
      for (const [name, start, end] of WINDOWS) {
        write(scene, name, reduce ? 1 : ease(clamp((p - start) / (end - start))));
      }
      if (logo) {
        scene.style.setProperty('--lx', `${logo.x.toFixed(1)}px`);
        scene.style.setProperty('--ly', `${logo.y.toFixed(1)}px`);
        write(scene, '--ls', logo.s);
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
