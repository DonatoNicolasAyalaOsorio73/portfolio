/**
 * Contact data (AD-4): the address, phone, profile URLs and CV path, which are not translated.
 * The labels, the prefilled WhatsApp text and the email subject live in `contact` of the
 * dictionaries; the helpers below join them into links.
 */
export const contact = {
  email: 'donatonicolasosorio@gmail.com',
  /** The phone as shown on the page. */
  phone: '+57 318 840 1253',
  /** The same number in the international form `wa.me` expects. */
  whatsapp: '573188401253',
  linkedin: 'https://www.linkedin.com/in/donatonicolasayalaosorio',
  github: 'https://github.com/DonatoNicolasAyalaOsorio73',
  /** Served byte-for-byte from `public/assets/` (AD-11). */
  cv: '/assets/cv-donato-ayala.pdf',
} as const;

/** A `mailto:` link to the address with a prefilled subject. */
export function mailtoHref(subject: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`;
}

/** A WhatsApp chat with the number and a prefilled message. */
export function whatsappHref(text: string): string {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}
