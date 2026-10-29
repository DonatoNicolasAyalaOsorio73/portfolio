/**
 * Tech stack groups (AD-10). On each `[data-stack]` section it sets:
 * - On each `[data-stack-panel]`, the tabs pattern's `role="tabpanel"`, `tabindex="0"` and
 *   `aria-labelledby`, once at start: without JavaScript the panels are plain group sections.
 * - `data-stack-state`: the active group's index. On wide screens (960px and up, at least 620px
 *   tall, no reduced motion) the section is a pinned track and the group is
 *   `floor(progress × groups)`, where
 *   progress is the distance scrolled through the section over its height minus the viewport.
 *   Elsewhere only the tabs change it.
 * - `data-stack-hover`: the space-separated project ids of the hovered item, empty otherwise;
 *   cleared whenever the group changes.
 * - On each `[data-stack-tab]`, the tabs pattern's `aria-selected` and roving `tabindex`.
 *
 * Tabs: a click or ArrowLeft / ArrowRight (wrapping), Home and End pick a group, and the keys
 * move focus to its tab. On wide screens picking a group also smooth-scrolls to the middle of
 * its band of the track and holds that group for 1.5s, or until the scroll reaches its band, so
 * the groups scrolled past on the way do not flash by (the legacy `dnaLock`). Every look is CSS
 * in `StackSection.astro`.
 */
const LOCK_MS = 1500;

const wide = window.matchMedia('(min-width: 960px) and (min-height: 620px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Pinned (and scroll-driven) exactly when the CSS pins the section. */
const pinned = () => wide.matches && !reducedMotion.matches;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

for (const section of document.querySelectorAll<HTMLElement>('[data-stack]')) {
  const tabs = Array.from(section.querySelectorAll<HTMLElement>('[data-stack-tab]'));
  const count = tabs.length;
  if (!count) continue;

  for (const panel of section.querySelectorAll<HTMLElement>('[data-stack-panel]')) {
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
    panel.setAttribute('aria-labelledby', `stack-tab-${panel.dataset.stackPanel}`);
  }

  let active = Number(section.dataset.stackState ?? 0);
  let lock: number | null = null;
  let lockTimer = 0;
  let frame = 0;

  const setActive = (index: number) => {
    if (index !== active || section.dataset.stackState !== String(index)) {
      active = index;
      section.dataset.stackState = String(index);
      section.dataset.stackHover = '';
    }
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
  };

  const tick = () => {
    frame = 0;
    if (!pinned()) return;
    const rect = section.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight));
    let index = Math.min(count - 1, Math.floor(progress * count));
    if (lock !== null) {
      if (index === lock) lock = null;
      else index = active;
    }
    if (index !== active) setActive(index);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const go = (index: number) => {
    setActive(index);
    if (!pinned()) return;
    lock = index;
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(() => {
      lock = null;
      tick();
    }, LOCK_MS);
    const top = section.getBoundingClientRect().top + window.scrollY;
    const span = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (index + 0.5)) / count, behavior: 'smooth' });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => go(i));
    tab.addEventListener('keydown', (event) => {
      const next =
        event.key === 'ArrowRight'
          ? (i + 1) % count
          : event.key === 'ArrowLeft'
            ? (i + count - 1) % count
            : event.key === 'Home'
              ? 0
              : event.key === 'End'
                ? count - 1
                : null;
      if (next === null) return;
      event.preventDefault();
      go(next);
      tabs[next]?.focus({ preventScroll: true });
    });
  });

  for (const item of section.querySelectorAll<HTMLElement>('[data-stack-item]')) {
    item.addEventListener('mouseenter', () => {
      section.dataset.stackHover = item.dataset.projects ?? '';
    });
    item.addEventListener('mouseleave', () => {
      section.dataset.stackHover = '';
    });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  wide.addEventListener('change', schedule);
  reducedMotion.addEventListener('change', schedule);
  setActive(active);
  tick();
}

// A module, so its names stay out of the global scope.
export {};
