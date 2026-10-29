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
  sequence: {
    label: 'How I work',
    items: [
      { id: 'reliability', statement: 'Reliable software, built to last.', label: 'RELIABILITY' },
      {
        id: 'scalability',
        statement: 'Software that grows with your business.',
        label: 'SCALABILITY',
      },
      { id: 'alignment', statement: 'Technology shaped around your goals.', label: 'ALIGNMENT' },
      { id: 'speed', statement: 'Fast prototypes to validate your idea.', label: 'SPEED' },
    ],
  },
  philosophy: {
    label: 'Philosophy',
    heading: 'Great software starts before the first commit.',
    intro:
      'I treat product, architecture, engineering and experience as one system: a decision in one layer changes the others.',
    howLabel: 'How:',
    steps: [
      {
        id: 'discovery',
        word: 'Discovery',
        note: 'Understand the business context, the users, and the objective behind the initiative.',
        how: 'Stakeholder interviews · User research · Process mapping · Business analysis',
      },
      {
        id: 'requirements',
        word: 'Requirements',
        note: 'Turn ambiguity into a scoped, prioritized, and verifiable definition of what to build.',
        how: 'Requirements elicitation · Root-cause analysis · User stories · Acceptance criteria · Non-functional requirements · Wireframing · Prototyping · User flows',
      },
      {
        id: 'architecture',
        word: 'Architecture',
        note: 'Define the structure of the solution against scalability, security, and maintainability constraints.',
        how: 'System design · Architecture patterns · Data modeling · API design · Architecture decision records',
      },
      {
        id: 'delivery',
        word: 'Delivery',
        note: 'Build in short iterations, with practices that keep the codebase reviewable, secure, and releasable.',
        how: 'Git · Code review · CI/CD · Automated testing · Authentication & authorization · Secure coding practices (OWASP) · AI-assisted development (BMAD) with human review',
      },
      {
        id: 'operation',
        word: 'Operation and evolution',
        note: 'Confirm the solution meets the need, keep it reliable in production, and improve it based on real usage.',
        how: 'Acceptance testing · User feedback · Performance analysis · Observability · Technical documentation · Knowledge transfer · Iterative improvement',
      },
    ],
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
