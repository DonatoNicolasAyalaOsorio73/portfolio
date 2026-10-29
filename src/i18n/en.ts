/** English copy. The source of truth for the dictionary's shape (AD-3). */
export const en = {
  meta: {
    siteName: 'Donato Ayala',
    ogImageAlt: 'Donato Ayala, Software Engineer · Full Stack',
    home: {
      title: 'Donato Ayala — Software Engineer',
      description:
        "Donato Nicolás Ayala Osorio. Master's in Software Engineering. Full Stack, software architecture, web and mobile.",
    },
  },
  chrome: {
    skip: 'Skip to content',
    navLabel: 'Primary',
    langLabel: 'Language',
    contact: 'Contact',
    links: { work: 'Work', stack: 'Stack', journey: 'Journey', about: 'About' },
    role: 'Software Engineer',
  },
  hero: {
    label: 'Introduction',
    eyebrow: "MASTER'S IN SOFTWARE ENGINEERING",
    titleLine1: 'From business problems',
    titleLine2: 'to engineered software.',
    photoAlt: 'Donato Nicolás Ayala Osorio',
    caption: 'Colombia · ES / EN (B2)',
    openToWork: 'Open to work',
    intro:
      "I'm Donato Nicolás Ayala Osorio, a Systems Engineer with a Master's in Software Engineering from Pontificia Universidad Javeriana Cali. I enjoy turning ambiguous ideas and business needs into clear, practical software that delivers tangible value, combining an agile approach with strong software engineering practices focused on code quality, security, and maintainability. My experience spans full-stack web and mobile development, using technologies such as TypeScript, React, Next.js, Angular, Supabase, PostgreSQL, Firebase, Vercel, and Cloudflare. I incorporate AI-assisted development through harness engineering within a structured workflow, guided by clear guidelines and sound engineering practices.",
    primaryCta: 'View projects',
    secondaryCta: 'Get in touch',
    subline: 'Full Stack · Software Architecture · Web & Mobile',
  },
} as const;

/** Turns the literal types of `en` into `string`, keeping the key structure. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { readonly [K in keyof T]: Widen<T[K]> };

/** Every locale must provide exactly these keys; `es.ts` checks itself against it. */
export type Dictionary = Widen<typeof en>;
