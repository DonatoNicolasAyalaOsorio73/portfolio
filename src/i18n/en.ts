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
    architecture: {
      open: 'View architecture',
      eyebrow: 'UNDER THE HOOD',
      close: 'Close',
      titleSuffix: ': how it’s built.',
      fields: { role: 'ROLE', tech: 'TECHNOLOGY', why: 'WHY', tradeoff: 'TRADE-OFF' },
      projects: [
        {
          id: 'narinohoy',
          intro:
            'A custom WordPress build where every editorial action is checked, logged and recoverable.',
          flow: [
            { id: 'editor', label: 'EDITOR' },
            { id: 'role-check', label: 'ROLE CHECK' },
            { id: 'action', label: 'ACTION' },
            { id: 'audit-log', label: 'AUDIT LOG' },
          ],
          nodes: [
            {
              id: 'editorial-team',
              label: 'Editorial team',
              sub: '13 users, one role each',
              role: 'Editors publish 250–350 articles a month. Each account has a role that defines what it can touch.',
              tech: 'Role-based access control (RBAC) on WordPress',
              why: 'Role-based access eliminated accidental content loss.',
            },
            {
              id: 'custom-cms',
              label: 'Custom CMS',
              sub: 'WordPress · PHP · JS · CSS',
              role: 'A custom WordPress build that runs publishing, sections and the public site.',
              tech: 'WordPress, PHP, JavaScript, CSS',
            },
            {
              id: 'traceability',
              label: 'Traceability',
              sub: 'Who did what, and when',
              role: 'A forensic timeline of every action by user, plus a weekly performance dashboard for each editor.',
              tech: 'Audit logs, custom admin dashboards',
            },
            {
              id: 'recovery',
              label: 'Recovery',
              sub: 'Backups · rollback · lockdown',
              role: 'Audit logs are backed up every 24 hours. Changes can be rolled back, and an emergency lock protocol can freeze the system.',
              tech: 'Daily backups, rollback, database-to-content integrity checks',
              why: "Integrity checks confirm that what's in the database matches what's live.",
            },
            {
              id: 'delivery-and-health',
              label: 'Delivery & health',
              sub: 'Cloudflare · smoke tests · SEO',
              role: 'Cloudflare handles DNS and the domain. Smoke tests run after every deploy, and an SEO health center flags issues automatically.',
              tech: 'Cloudflare, post-deploy smoke tests, automated SEO checks',
            },
            {
              id: 'how-it-was-built',
              label: 'How it was built',
              sub: 'BMAD · Copilot · Claude',
              role: 'Built with the BMAD method, GitHub Copilot and Claude. Every delivery went through human review.',
              tech: 'BMAD, GitHub Copilot, Claude',
            },
          ],
        },
        {
          id: 'steady',
          intro:
            'A Next.js app on Vercel over Supabase, built for a client. Anyone can verify a certificate; only the organization can issue one. The code is private; the site is live.',
          flow: [
            { id: 'admin-login', label: 'ADMIN LOGIN' },
            { id: 'new-certificate', label: 'NEW CERTIFICATE' },
            { id: 'id-qr-generated', label: 'ID + QR GENERATED' },
            { id: 'public-lookup', label: 'PUBLIC LOOKUP' },
          ],
          nodes: [
            {
              id: 'public-site',
              label: 'Public site',
              sub: 'Next.js App Router',
              role: 'Landing page, training programs, process, FAQ and contact. Pages are Server Components prerendered at build time; only interactive parts run on the client.',
              tech: 'Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind CSS, next/font',
              why: 'Static pages load fast and need no server at request time.',
              tradeoff: 'Content changes need a new deploy.',
            },
            {
              id: 'certificate-lookup',
              label: 'Certificate lookup',
              sub: 'ID · code · QR · barcode',
              role: 'Anyone can check a certificate by typing its ID or verification code, or by scanning its QR code or barcode with the camera. The format is detected automatically, so either value works in either field. A server endpoint returns one exact match with a fixed set of fields.',
              tech: 'Next.js API route, html5-qrcode, ZXing',
              why: 'The public never touches the database directly, so the registry cannot be listed or downloaded.',
              tradeoff: 'Each lookup is a serverless function call instead of a direct query.',
            },
            {
              id: 'admin-panel',
              label: 'Admin panel',
              sub: 'Private · signed session · rate-limited',
              role: 'The organization signs in to issue, edit and revoke certificates. IDs, verification codes, QR codes and barcodes are generated automatically; photos and vaccination records are attached to each certificate. Login allows 10 attempts per 15 minutes per client; the counter keeps the IP only as a keyed hash and purges it within 24 hours.',
              tech: 'API routes, JSON Web Tokens, Postgres rate limiter, pg_cron, qrcode, JsBarcode',
              why: 'One administrator and no user management: nothing extra to run or secure. The limiter blocks password guessing without a paid service.',
              tradeoff:
                'A single shared account, with no password recovery or per-user audit; if the counter is down, login fails closed.',
            },
            {
              id: 'data-and-files',
              label: 'Data & files',
              sub: 'Supabase Postgres + Storage',
              role: 'A certifications table with indexes, a trigger that keeps updated_at current, and a bucket for photos and PDFs. Row Level Security denies every direct request made with the public key; only the server reads and writes.',
              tech: 'PostgreSQL, PL/pgSQL, Row Level Security, Supabase Storage, signed upload URLs',
              why: 'Access rules hold even if the public key leaks. Signed upload URLs let large PDFs skip serverless body limits.',
              tradeoff: 'Authorization lives in server code, not in database policies per role.',
            },
            {
              id: 'delivery',
              label: 'Delivery',
              sub: 'Vercel · Cloudflare · WhatsApp',
              role: 'Serverless hosting on Vercel with a preview build for every pull request, DNS on Cloudflare, and a contact form that opens a WhatsApp message instead of storing requests. Secrets live only in server environment variables, and every change reaches main through a pull request.',
              tech: 'Vercel, Cloudflare DNS, WhatsApp links, GitHub',
              why: 'Every change is built and checked before it reaches production.',
              tradeoff: 'Depends on a serverless platform instead of free static hosting.',
            },
            {
              id: 'quality-and-ci',
              label: 'Quality & CI',
              sub: 'Vitest · Playwright · GitHub Actions',
              role: 'Every pull request runs a type check, 128 unit and integration tests and 28 end-to-end tests against a production build. Unit tests mock Supabase and Resend and fail if a public endpoint ever returns private columns.',
              tech: 'Vitest, React Testing Library, Playwright, GitHub Actions',
              why: 'Security rules are checked on every change, not remembered.',
              tradeoff:
                'End-to-end tests run against a local build, never against production data.',
            },
            {
              id: 'how-it-was-built',
              label: 'How it was built',
              sub: 'BMAD · Claude Code',
              role: 'Changes follow the BMAD method: a plan with acceptance criteria first, then implementation, then independent review passes before merge. A security review moved every read and write behind the server and rotated the keys; rate limits, a test suite and accessibility fixes followed the same way.',
              tech: 'BMAD Method, Claude Code',
              why: 'Agents draft; every change gets human review.',
            },
          ],
        },
        {
          id: 'ecobike',
          intro:
            'One Expo codebase ships to iOS, Android and the web, against one Firebase project and one serverless API. The app is local-first; anything that has value (points, roles, redemptions, stores) is written only by the server. Pick a component to see its role and the trade-off behind it.',
          flow: [
            { id: 'ride-on-device', label: 'RIDE ON DEVICE' },
            { id: 'server-scores-it', label: 'SERVER SCORES IT' },
            { id: 'points-balance', label: 'POINTS BALANCE' },
            { id: 'qr-redemption', label: 'QR REDEMPTION' },
          ],
          nodes: [
            {
              id: 'clients',
              label: 'Clients',
              sub: 'iOS · Android · Web',
              role: 'The same app on three platforms, with a sidebar layout on desktop web. A guest mode with sample data lets anyone try every screen from a link, without an account.',
              tech: 'Expo SDK 57, React Native 0.86, React 19, Expo Router, Reanimated 4, TypeScript (strict)',
              why: 'One project to build, test and ship; the web build doubles as a no-install demo.',
              tradeoff:
                'On the web, background GPS, push notifications and biometrics are not available.',
            },
            {
              id: 'layers-and-platform-pairs',
              label: 'Layers & platform pairs',
              sub: 'app → components → hooks → stores → services → domain',
              role: 'Business rules (scoring, streaks, missions, verification) live in a pure domain layer with no I/O. Platform differences go in paired files (name.ts / name.web.ts) with the same API; the bundler and the type checker pick the right one.',
              tech: 'Zustand stores, Metro platform extensions, tsconfig moduleSuffixes, 15 written architecture rules',
              why: 'Rules are testable without a phone, and screens never call Firebase directly.',
              tradeoff: 'Each platform pair is two files that must keep the same contract.',
            },
            {
              id: 'maps-and-eco-ruta',
              label: 'Maps & Eco ruta',
              sub: 'Apple Maps · MapLibre · Leaflet',
              role: 'Live GPS tracking with auto-pause, and Eco ruta: search a place, compare bike routes that avoid unpaved and busy roads, then ride with turn-by-turn directions and off-route warnings.',
              tech: 'expo-maps (iOS), MapLibre + OpenFreeMap (Android), Leaflet + OpenStreetMap (web), Photon search, Valhalla bicycle routing',
              why: 'No API keys or billing accounts anywhere, and routing that understands what a cyclist cares about.',
              tradeoff:
                'Three map implementations behind one contract; public routing servers have no SLA.',
            },
            {
              id: 'local-first-storage',
              label: 'Local-first storage',
              sub: 'SQLite · localStorage',
              role: 'Rides, tracks, achievements and redemptions are saved on the device first, so a ride is never lost without signal. Unsynced rides retry when the connection returns.',
              tech: 'expo-sqlite with in-place migrations (mobile), localStorage (web), SecureStore for settings',
              why: 'Works offline; lists and stats read summaries and never parse GPS tracks.',
              tradeoff:
                'Local and server copies need reconciling when a ride is deleted on another device.',
            },
            {
              id: 'serverless-api',
              label: 'Serverless API',
              sub: 'Vercel · Firebase Admin SDK',
              role: 'Eleven functions own every write of value: they verify the Firebase token, score the ride, cap daily points, reject overlapping or implausible rides, and issue one-time redemption codes. Admin actions (stores, users, roles, points) are audited.',
              tech: 'Vercel functions (Node), Firebase Admin SDK, Firestore transactions, per-user rate limits',
              why: 'A modified client cannot mint points or redeem for free; the service-account key never reaches the bundle.',
              tradeoff:
                'Scoring rules exist in two copies (client preview and server), kept equal by a parity test.',
            },
            {
              id: 'firebase',
              label: 'Firebase',
              sub: 'Auth · Firestore',
              role: 'Accounts (email, Google, Apple), profiles, friends, chat, rides and the partner catalog. Clients only read value fields; security rules and composite indexes are versioned with the code. Logos and avatars are small images stored inside their documents.',
              tech: 'Firebase 12 client SDK, Firestore security rules, composite indexes',
              why: 'Managed auth and data that stay on the free plan; no file storage service to pay for.',
              tradeoff:
                'Images must stay tiny (256 px), because every read of the document carries them.',
            },
            {
              id: 'quality-and-ci',
              label: 'Quality & CI',
              sub: 'node:test · Playwright · GitHub Actions',
              role: 'Every push runs the type check, lint, 174 unit and API tests (the real handlers against an in-memory Firebase Admin), the Firestore rules on the emulator, and 22 end-to-end tests on phone and desktop.',
              tech: 'node:test, Playwright, Firebase emulator, ESLint, GitHub Actions',
              why: 'Anti-fraud and security rules are checked on every change, not remembered.',
              tradeoff: 'End-to-end tests mock external services and never touch production data.',
            },
            {
              id: 'how-it-was-built',
              label: 'How it was built',
              sub: 'BMAD · Claude Code',
              role: 'Started as my thesis in 2024 and rebuilt in 2026 with the BMAD method: architecture rules first, then implementation, code review, security review and tests before each merge. Every change got human review.',
              tech: 'BMAD Method, Claude Code',
              why: 'Agents draft; I make the architectural calls and review every change.',
            },
          ],
        },
        {
          id: 'siesa',
          intro:
            'A Next.js prototype where manufacturing and quality talk to each other in both directions.',
          flow: [
            { id: 'operation-done', label: 'OPERATION DONE' },
            { id: 'inspection', label: 'INSPECTION' },
            { id: 'batch-rejected', label: 'BATCH REJECTED' },
            { id: 'order-halted', label: 'ORDER HALTED' },
          ],
          nodes: [
            {
              id: 'manufacturing',
              label: 'Manufacturing',
              sub: '8 views',
              role: 'Production orders, routings, work centers, bill of materials, cost structure, routing costs, time tracking and shop-floor progress.',
              tech: 'Next.js 14 (App Router), TypeScript, Tailwind CSS',
            },
            {
              id: 'quality',
              label: 'Quality',
              sub: 'Inspections & traceability',
              role: 'Pending inspections, non-conformities, traceability and quality KPIs.',
              tech: 'Next.js, Recharts',
            },
            {
              id: 'two-way-integration',
              label: 'Two-way integration',
              sub: 'Manufacturing ⇄ Quality',
              role: 'Completing an operation automatically triggers an inspection. Rejecting a batch halts the order on the floor.',
              tech: 'Shared application state across modules',
            },
            {
              id: 'ai-assistant',
              label: 'AI assistant',
              sub: 'Gemini + offline fallback',
              role: 'A voice or text assistant for logging defects, plus predictive risk analysis.',
              tech: 'Google Gemini, with an offline fallback',
            },
            {
              id: 'data-and-dashboard',
              label: 'Data & dashboard',
              sub: 'Google Sheets · Recharts',
              role: 'An executive dashboard with KPIs, charts and live alerts. A public Google Sheet serves as the mock backend.',
              tech: 'Recharts, Google Sheets, Vitest',
            },
            {
              id: 'how-it-was-built',
              label: 'How it was built',
              sub: 'Claude Code',
              role: 'Built end to end with Claude Code.',
              tech: 'Claude Code',
            },
          ],
        },
        {
          id: 'andino',
          intro:
            "The code is private, so this view covers structure and decisions only. It's the story of a system growing, and my role growing with it.",
          flow: [
            { id: 'v01-website', label: 'V01 WEBSITE' },
            { id: 'tests-and-docs', label: 'TESTS & DOCS' },
            { id: 'v02-crm', label: 'V02 CRM' },
            { id: 'team-of-4', label: 'TEAM OF 4' },
          ],
          nodes: [
            {
              id: 'institutional-website',
              label: 'Institutional website',
              sub: '2023 – 2024 · Junior Developer',
              role: "The school's website, built in Angular. I also wrote the technical documentation and user manuals.",
              tech: 'Angular, TypeScript, Bootstrap',
            },
            {
              id: 'testing',
              label: 'Testing',
              sub: 'Jasmine + Karma',
              role: 'Unit tests for the Angular app.',
              tech: 'Jasmine, Karma',
            },
            {
              id: 'automation-and-support',
              label: 'Automation & support',
              sub: 'VBA · networking',
              role: 'Office automation with VBA, plus network support.',
              tech: 'VBA',
            },
            {
              id: 'student-records-crm',
              label: 'Student records CRM',
              sub: '2025 · Development Lead',
              role: 'A CRM for managing student records.',
              tech: 'TypeScript, Supabase',
            },
            {
              id: 'team-and-process',
              label: 'Team & process',
              sub: 'Scrum Master · team of 4',
              role: 'I led a team of four as Scrum Master, with work tracked in Azure DevOps and code on GitHub.',
              tech: 'Scrum, Azure DevOps, GitHub',
            },
          ],
        },
        {
          id: 'cognitios',
          intro: 'An internship on a full stack team: front end, services, backend and APIs.',
          flow: [],
          nodes: [
            {
              id: 'interfaces',
              label: 'Interfaces',
              sub: 'HTML · CSS · Angular',
              role: 'Responsive interfaces and Angular components.',
              tech: 'HTML, CSS, Angular',
            },
            {
              id: 'services',
              label: 'Services',
              sub: 'Angular + RxJS',
              role: 'Angular services that consume the backend with RxJS.',
              tech: 'Angular, RxJS',
            },
            {
              id: 'backend',
              label: 'Backend',
              sub: 'JavaScript',
              role: 'CRUD operations and report generation.',
              tech: 'JavaScript',
            },
            {
              id: 'api',
              label: 'API',
              sub: 'REST, documented',
              role: 'Documented REST endpoints, tested with Postman and Insomnia.',
              tech: 'REST, Postman, Insomnia',
            },
            {
              id: 'version-control',
              label: 'Version control',
              sub: 'GitLab',
              role: 'Branches and merge requests on GitLab.',
              tech: 'GitLab',
            },
          ],
        },
      ],
    },
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
