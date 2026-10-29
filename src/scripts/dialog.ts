/**
 * Shared behaviour of the site's native modal dialogs (AD-10), used by `arch.ts` and
 * `contact.ts`. `showModal()` makes the page behind inert; the dialog's open state is one
 * `data-*-state` attribute (`closed`, then `in` once open) whose look is CSS in the component.
 *
 * As in the legacy site: the chosen control takes focus on open and focus goes back to the
 * opening control on close; Escape closes; a click on the scrim (the dialog element itself)
 * closes only when both the press and the release happen on it. Closing switches the state to
 * `closed` at once and closes the dialog 280ms later, or at once with reduced motion.
 */
const CLOSE_MS = 280;

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export interface ModalOptions {
  /** The `dataset` key of the open state on the dialog, e.g. `archState`. */
  stateKey: string;
  /** The control that takes focus once the dialog is open. */
  focusTarget: (dialog: HTMLDialogElement) => HTMLElement | null;
  /** Resets the dialog's own state before it shows. */
  beforeOpen?: (dialog: HTMLDialogElement) => void;
  /** Starts what runs while the dialog is open, once it is in. */
  afterOpen?: (dialog: HTMLDialogElement) => void;
  /** Stops what `afterOpen` started; may run more than once per close. */
  onClose?: (dialog: HTMLDialogElement) => void;
  /** Handles a click inside the dialog that did not close it from the scrim. */
  onClick?: (dialog: HTMLDialogElement, target: Element) => void;
}

export interface Modal {
  open(dialog: HTMLDialogElement, from: HTMLElement): void;
  close(dialog: HTMLDialogElement): void;
  /** Wires Escape, the scrim and `onClick` to one dialog. */
  bind(dialog: HTMLDialogElement): void;
}

export function createModal(options: ModalOptions): Modal {
  let current: HTMLDialogElement | null = null;
  /** The control that opened each dialog, so every close returns focus to its own control. */
  const openers = new WeakMap<HTMLDialogElement, HTMLElement>();
  let closeTimer = 0;
  let pressOnScrim = false;
  let releaseOnScrim = false;

  const setState = (dialog: HTMLDialogElement, state: 'closed' | 'in') => {
    dialog.dataset[options.stateKey] = state;
  };

  function open(dialog: HTMLDialogElement, from: HTMLElement) {
    window.clearTimeout(closeTimer);
    closeTimer = 0;
    if (current && current !== dialog && current.open) current.close();
    current = dialog;
    openers.set(dialog, from);
    options.beforeOpen?.(dialog);
    setState(dialog, 'closed');
    if (!dialog.open) dialog.showModal();
    options.focusTarget(dialog)?.focus();
    // Commit the closed look before switching to `in`, so the panel transitions in.
    void dialog.getBoundingClientRect();
    setState(dialog, 'in');
    options.afterOpen?.(dialog);
  }

  function close(dialog: HTMLDialogElement) {
    if (dialog.dataset[options.stateKey] === 'closed' && closeTimer) return;
    options.onClose?.(dialog);
    setState(dialog, 'closed');
    window.clearTimeout(closeTimer);
    if (reducedMotion.matches) {
      closeTimer = 0;
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
    setState(dialog, 'closed');
    const target = openers.get(dialog);
    openers.delete(dialog);
    // A dialog closed because another one opened leaves that one's timers and focus alone.
    if (current && current !== dialog) return;
    window.clearTimeout(closeTimer);
    closeTimer = 0;
    options.onClose?.(dialog);
    current = null;
    target?.focus();
  }

  function bind(dialog: HTMLDialogElement) {
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
      options.onClick?.(dialog, event.target as Element);
    });
  }

  return { open, close, bind };
}
