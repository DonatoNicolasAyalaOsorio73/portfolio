/**
 * Contact section and "Write to me" dialog (AD-10). Every label and message is in the HTML; the
 * script only switches state attributes, and the address comes from `data-address`.
 *
 * - Copy (`[data-copy]`, its button `[data-copy-button]`): copies the address with the Clipboard
 *   API and sets `data-copy-state` to `ok` for 2s, or to `fail` for 5s and selects the address
 *   text (`[data-copy-address]`) for a manual copy; then back to `idle`.
 * - Mail (`[data-mail-open]`, a plain `mailto:` link without JavaScript): opens the native modal
 *   `<dialog data-mail-dialog>` through `dialog.ts` (state `data-mail-dialog-state`), with focus
 *   in the name field. Its form `[data-mail]` carries `data-mail-state`: `note`, `missing` after
 *   a submit without subject or message, `sent` after handing the draft to the email app. The
 *   Gmail link (`[data-mail-gmail]`) gets its `href` and loses `aria-disabled` only while the
 *   subject and message have text.
 *
 * Nothing is stored or sent: the draft leaves the page only as a `mailto:` or Gmail navigation.
 */
import { createModal } from './dialog';

const COPY_OK_MS = 2000;
const COPY_FAIL_MS = 5000;

const copy = document.querySelector<HTMLElement>('[data-copy]');
if (copy) {
  const address = copy.dataset.address ?? '';
  let timer = 0;
  let frame = 0;
  const show = (state: 'ok' | 'fail') => {
    window.clearTimeout(timer);
    window.cancelAnimationFrame(frame);
    // Back to idle for one rendered frame first, so a repeated copy re-adds its message and the
    // live region announces it again.
    copy.dataset.copyState = 'idle';
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        copy.dataset.copyState = state;
        timer = window.setTimeout(
          () => {
            copy.dataset.copyState = 'idle';
          },
          state === 'ok' ? COPY_OK_MS : COPY_FAIL_MS,
        );
      });
    });
  };
  const fail = () => {
    show('fail');
    const text = copy.querySelector('[data-copy-address]');
    const selection = window.getSelection();
    if (!text || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  copy.querySelector('[data-copy-button]')?.addEventListener('click', () => {
    try {
      navigator.clipboard.writeText(address).then(() => show('ok'), fail);
    } catch {
      fail();
    }
  });
}

const dialog = document.querySelector<HTMLDialogElement>('dialog[data-mail-dialog]');
const form = dialog?.querySelector<HTMLFormElement>('form[data-mail]');
if (dialog && form) {
  const address = form.dataset.address ?? '';
  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null;
  const gmail = form.querySelector<HTMLAnchorElement>('[data-mail-gmail]');

  /** The draft from the fields; `ok` once the subject and message have text. */
  const draft = () => {
    const name = field('name')?.value.trim() ?? '';
    const subject = field('subject')?.value.trim() ?? '';
    const message = field('message')?.value.trim() ?? '';
    const body = message + (name ? `\n\n— ${name}` : '');
    return { ok: !!(subject && message), subject, body };
  };

  const update = () => {
    if (!gmail) return;
    const { ok, subject, body } = draft();
    if (ok) {
      gmail.href =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${address}` +
        `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      gmail.removeAttribute('aria-disabled');
    } else {
      gmail.removeAttribute('href');
      gmail.setAttribute('aria-disabled', 'true');
    }
  };

  const modal = createModal({
    stateKey: 'mailDialogState',
    focusTarget: () => field('name'),
    beforeOpen: () => {
      form.dataset.mailState = 'note';
      update();
    },
    onClick: (_dialog, target) => {
      if (target.closest('[data-mail-close]')) modal.close(dialog);
    },
  });
  modal.bind(dialog);

  form.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    // Typing a name only clears the "sent" note; the other fields clear "missing" too.
    if (target.name !== 'name' || form.dataset.mailState === 'sent') {
      form.dataset.mailState = 'note';
    }
    update();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const { ok, subject, body } = draft();
    if (!ok) {
      form.dataset.mailState = 'missing';
      return;
    }
    window.location.href =
      `mailto:${address}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
    form.dataset.mailState = 'sent';
  });

  for (const opener of document.querySelectorAll<HTMLElement>('[data-mail-open]')) {
    opener.addEventListener('click', (event) => {
      // A modified click keeps the plain `mailto:` link's own behaviour.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      modal.open(dialog, opener);
    });
  }
}
