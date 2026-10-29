/**
 * Hover tilt (AD-10 epic-1 exception): while a pointer moves over a `[data-tilt]` element, writes
 * `--tilt-x` and `--tilt-y` (degrees) on it and sets `data-tilt-state="active"`; on leave it
 * removes both and the state returns to `idle`. Nothing else. The transform and its timing are
 * CSS (`motion.css`), only on hover-capable devices without reduced motion.
 *
 * As in the legacy site: tilting back and forth up to 7° around X and 9° around Y, following
 * the pointer's position over the element.
 */
const tiltTargets = document.querySelectorAll<HTMLElement>('[data-tilt]');

if (tiltTargets.length) {
  const hover = window.matchMedia('(hover: hover)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const move = (event: PointerEvent) => {
    if (reducedMotion.matches || !hover.matches || event.pointerType === 'touch') return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--tilt-x', `${((0.5 - y) * 14).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${((x - 0.5) * 18).toFixed(2)}deg`);
    el.dataset.tiltState = 'active';
  };

  const leave = (event: PointerEvent) => {
    const el = event.currentTarget as HTMLElement;
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.dataset.tiltState = 'idle';
  };

  for (const el of tiltTargets) {
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  }
}
