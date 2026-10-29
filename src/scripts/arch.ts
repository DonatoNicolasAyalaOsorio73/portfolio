/**
 * "Under the hood" dialogs (AD-10). A `[data-arch-open="<id>"]` button opens the native modal
 * `<dialog data-arch="<id>">` with `showModal()`, so the page behind is inert. The script then
 * changes the DOM only through:
 * - `data-arch-state` on the dialog: `closed`, then `in` once open (the panel fades in and rises);
 *   back to `closed` on close, which finishes 280ms later (at once with reduced motion);
 * - `data-arch-node` on the dialog and `aria-pressed` on its `[data-arch-select]` buttons: the
 *   selected node, the first one on every open;
 * - `data-flow-state` on its `[data-flow]` row: the active step, from the first on open and
 *   advancing every 1400ms while open and the tab is visible, never with reduced motion.
 *
 * As in the legacy site: focus goes to Close on open and back to the opening button on close;
 * Escape closes; a click on the scrim (the dialog element itself) closes only when both the press
 * and the release happen on it. Every look is CSS in `ArchDialog.astro`.
 */
const CLOSE_MS = 280;
const FLOW_MS = 1400;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let current: HTMLDialogElement | null = null;
/** The button that opened each dialog, so every close returns focus to its own button. */
const openers = new WeakMap<HTMLDialogElement, HTMLElement>();
let flowTimer = 0;
let closeTimer = 0;
let pressOnScrim = false;
let releaseOnScrim = false;

function select(dialog: HTMLDialogElement, index: number) {
  dialog.dataset.archNode = String(index);
  for (const button of dialog.querySelectorAll<HTMLElement>('[data-arch-select]')) {
    button.setAttribute('aria-pressed', String(button.dataset.archSelect === String(index)));
  }
}

function stopFlow() {
  window.clearInterval(flowTimer);
  flowTimer = 0;
}

function startFlow(dialog: HTMLDialogElement) {
  stopFlow();
  const flow = dialog.querySelector<HTMLElement>('[data-flow]');
  if (!flow) return;
  flow.dataset.flowState = '0';
  const count = flow.children.length;
  if (!count) return;
  flowTimer = window.setInterval(() => {
    if (reducedMotion.matches || document.hidden) return;
    flow.dataset.flowState = String((Number(flow.dataset.flowState ?? 0) + 1) % count);
  }, FLOW_MS);
}

function open(dialog: HTMLDialogElement, from: HTMLElement) {
  window.clearTimeout(closeTimer);
  if (current && current !== dialog && current.open) current.close();
  current = dialog;
  openers.set(dialog, from);
  select(dialog, 0);
  dialog.dataset.archState = 'closed';
  if (!dialog.open) dialog.showModal();
  dialog.querySelector<HTMLElement>('[data-arch-close]')?.focus();
  // Commit the closed look before switching to `in`, so the panel transitions in.
  void dialog.getBoundingClientRect();
  dialog.dataset.archState = 'in';
  startFlow(dialog);
}

function close(dialog: HTMLDialogElement) {
  if (dialog.dataset.archState === 'closed' && closeTimer) return;
  stopFlow();
  dialog.dataset.archState = 'closed';
  window.clearTimeout(closeTimer);
  if (reducedMotion.matches) {
    dialog.close();
    return;
  }
  closeTimer = window.setTimeout(() => {
    closeTimer = 0;
    if (dialog.open) dialog.close();
  }, CLOSE_MS);
}

/** Runs however the dialog ends up closed, including a forced close by the browser. */
function closed(dialog: HTMLDialogElement) {
  dialog.dataset.archState = 'closed';
  const target = openers.get(dialog);
  openers.delete(dialog);
  // A dialog closed because another one opened leaves that one's timers and focus alone.
  if (current && current !== dialog) return;
  window.clearTimeout(closeTimer);
  closeTimer = 0;
  stopFlow();
  current = null;
  target?.focus();
}

for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[data-arch]')) {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close(dialog);
  });
  dialog.addEventListener('close', () => closed(dialog));
  dialog.addEventListener('mousedown', (event) => {
    pressOnScrim = event.target === dialog;
  });
  dialog.addEventListener('mouseup', (event) => {
    releaseOnScrim = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    // Both the press and the release must land on the scrim (the dialog element itself).
    const hit = event.target === dialog && pressOnScrim && releaseOnScrim;
    pressOnScrim = false;
    releaseOnScrim = false;
    if (hit) {
      close(dialog);
      return;
    }
    const target = event.target as Element;
    if (target.closest('[data-arch-close]')) {
      close(dialog);
      return;
    }
    const node = target.closest<HTMLElement>('[data-arch-select]');
    if (node) select(dialog, Number(node.dataset.archSelect));
  });
}

document.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLElement>('[data-arch-open]');
  if (!button) return;
  const dialog = document.querySelector<HTMLDialogElement>(
    `dialog[data-arch="${button.dataset.archOpen}"]`,
  );
  if (dialog) open(dialog, button);
});

// A module, so its names stay out of the global scope (`openers`, `closed`).
export {};
