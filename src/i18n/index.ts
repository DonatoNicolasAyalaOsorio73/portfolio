import { en, type Dictionary } from './en';
import { es } from './es';

export type { Dictionary };

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, Dictionary> = { en, es };

/** The copy for one locale. Sections and components read every visible string through it. */
export function t(locale: Locale): Dictionary {
  return dictionaries[locale];
}
