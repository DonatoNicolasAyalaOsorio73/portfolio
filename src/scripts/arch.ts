/**
 * "Under the hood" dialogs (AD-10). A `[data-arch-open="<id>"]` button opens the native modal
 * `<dialog data-arch="<id>">`; opening, closing, Escape, the scrim and focus are the shared
 * behaviour in `dialog.ts`, with focus going to Close on open. The script then changes the DOM
 * only through:
 * - `data-arch-state` on the dialog: `closed`, then `in` once open (the panel fades in and rises);
 *   back to `closed` on close, which finishes 280ms later (at once with reduced motion);
 * - `data-arch-node` on the dialog and `aria-pressed` on its `[data-arch-select]` buttons: the
 *   selected node, the first one on every open;
 * - `data-flow-state` on its `[data-flow]` row: the active step, from the first on open and
 *   advancing every 1400ms while open and the tab is visible, never with reduced motion.
 *
 * Every look is CSS in `ArchDialog.astro`.
 */
import { createModal, reducedMotion } from './dialog';

const FLOW_MS = 1400;

let flowTimer = 0;

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

const modal = createModal({
  stateKey: 'archState',
  focusTarget: (dialog) => dialog.querySelector<HTMLElement>('[data-arch-close]'),
  beforeOpen: (dialog) => select(dialog, 0),
  afterOpen: startFlow,
  onClose: stopFlow,
  onClick: (dialog, target) => {
    if (target.closest('[data-arch-close]')) {
      modal.close(dialog);
      return;
    }
    const node = target.closest<HTMLElement>('[data-arch-select]');
    if (node) select(dialog, Number(node.dataset.archSelect));
  },
});

for (const dialog of document.querySelectorAll<HTMLDialogElement>('dialog[data-arch]')) {
  modal.bind(dialog);
}

document.addEventListener('click', (event) => {
  const button = (event.target as Element).closest<HTMLElement>('[data-arch-open]');
  if (!button) return;
  const dialog = document.querySelector<HTMLDialogElement>(
    `dialog[data-arch="${button.dataset.archOpen}"]`,
  );
  if (dialog) modal.open(dialog, button);
});
