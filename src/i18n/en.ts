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
  work: {
    heading: 'Featured projects.',
    intro: 'Production systems, products and prototypes, each with its architecture documented.',
    moreHeading: 'Other projects.',
    metaLabels: { client: 'Client', when: 'When', role: 'Role' },
    access: {
      live: 'Live',
      livePriv: 'Live · private codebase',
      priv: 'Private codebase',
      intern: 'Internship',
    },
    actions: {
      visitNarinohoy: 'Visit nariñohoy.com ↗',
      visitSite: 'Visit site ↗',
      demo: 'Live demo ↗',
      repo: 'Repository ↗',
    },
    featured: [
      {
        id: 'narinohoy',
        kind: 'NEWS PLATFORM',
        summary:
          'Custom WordPress CMS for a regional newsroom: role-based access for 13 editors, per-user audit trails, daily log backups, rollback and database-to-content integrity checks.',
        client: 'NariñoHoy, digital news outlet',
        role: 'Full Stack Developer · Freelance',
        logoAlt: 'NariñoHoy logo',
        shotAlt: 'The NariñoHoy home page',
      },
      {
        id: 'steady',
        kind: 'PRODUCT',
        summary:
          'Certification registry for an assistance-dog trainer: public verification by ID, code, QR or barcode, and a private admin panel. Every read and write goes through the server; the database rejects direct access.',
        client: 'Steady Guardians, Colombia',
        role: 'Full Stack Developer · Freelance',
        logoAlt: 'Steady Guardians logo',
        shotAlt: 'The Steady Guardians home page',
      },
      {
        id: 'ecobike',
        kind: 'THESIS WITH DISTINCTION',
        summary:
          'Cycling app for Nariño on iOS, Android and the web from one Expo codebase: GPS rides with auto-pause, Eco ruta bike routing with turn-by-turn directions, server-verified points, QR rewards at 11 partner stores, friends, chat, a weekly league and an audited admin panel.',
        client: 'Universidad Mariana · thesis',
        role: 'Author',
        logoAlt: 'EcoBike logo',
        shotAlt: 'The EcoBike web demo',
      },
    ],
    others: [
      {
        id: 'andino',
        kind: 'INSTITUTIONAL',
        summary:
          'An Angular institutional website (V01) that evolved into a TypeScript and Supabase student records CRM (V02), delivered with Scrum on Azure DevOps.',
        role: 'Junior Developer → Development Lead',
        logoAlt: 'Centro de Estudios Andino logo',
      },
      {
        id: 'siesa',
        kind: 'TECHNICAL ASSESSMENT',
        summary:
          'Next.js 14 MES prototype with two-way integration between manufacturing and quality, Recharts dashboards and a Gemini-powered defect assistant with an offline fallback.',
        client: 'Siesa',
        role: 'Sole developer, built with Claude Code',
        logoAlt: 'Siesa MES logo',
      },
      {
        id: 'cognitios',
        kind: 'INTERNSHIP',
        summary:
          'Responsive Angular interfaces, RxJS services, JavaScript CRUD and reporting, and documented REST endpoints tested with Postman and Insomnia.',
        role: 'Full Stack Intern · Bogotá',
        logoAlt: 'Cognitios logo',
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
