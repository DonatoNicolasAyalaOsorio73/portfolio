/**
 * Header scroll state (AD-10): sets `data-nav-state` on `[data-nav]` and nothing else.
 * `top` within 40px of the top; `scrolled` below that; `hidden` while scrolling down past
 * 400px, until an upward scroll of more than 4px or focus inside the header. All looks are
 * CSS on the attribute (`Nav.astro`).
 */
const SCROLLED_AFTER = 40;
const HIDE_AFTER = 400;
const MIN_DELTA = 4;

const header = document.querySelector<HTMLElement>('[data-nav]');

if (header) {
  let lastY = window.scrollY;
  let hidden = false;
  let frame = 0;

  const render = () => {
    const y = window.scrollY;
    header.dataset.navState = hidden ? 'hidden' : y > SCROLLED_AFTER ? 'scrolled' : 'top';
  };

  const tick = () => {
    frame = 0;
    const y = window.scrollY;
    const delta = y - lastY;
    lastY = y;
    if (y <= HIDE_AFTER) hidden = false;
    else if (delta > MIN_DELTA) hidden = true;
    else if (delta < -MIN_DELTA) hidden = false;
    render();
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(tick);
    },
    { passive: true },
  );

  header.addEventListener('focusin', () => {
    if (!hidden) return;
    hidden = false;
    render();
  });

  tick();
}
