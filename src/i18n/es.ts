import type { Dictionary } from './en';

/** Spanish copy. `satisfies` makes a missing or extra key fail `astro check` (AD-3). */
export const es = {
  meta: {
    siteName: 'Donato Ayala',
    ogImageAlt: 'Donato Ayala, Ingeniero de Software · Full Stack',
    home: {
      title: 'Donato Ayala — Ingeniero de Software',
      description:
        'Donato Nicolás Ayala Osorio. Magíster en Ingeniería de Software. Full Stack, arquitectura de software, web y móvil.',
    },
  },
  chrome: {
    skip: 'Saltar al contenido',
    navLabel: 'Principal',
    langLabel: 'Idioma',
    contact: 'Contacto',
    links: { work: 'Trabajo', stack: 'Stack', journey: 'Trayectoria', about: 'Sobre mí' },
    role: 'Ingeniero de Software',
  },
  hero: {
    label: 'Introducción',
    eyebrow: 'MAGÍSTER EN INGENIERÍA DE SOFTWARE',
    titleLine1: 'De problemas de negocio',
    titleLine2: 'a soluciones de software.',
    photoAlt: 'Donato Nicolás Ayala Osorio',
    caption: 'Colombia · ES / EN (B2)',
    openToWork: 'Disponible',
    intro:
      'Soy Donato Nicolás Ayala Osorio, Ingeniero de Sistemas con una Maestría en Ingeniería de Software de la Pontificia Universidad Javeriana Cali. Disfruto transformar ideas ambiguas y necesidades de negocio en soluciones de software claras y prácticas que generan valor tangible, combinando un enfoque ágil con buenas prácticas de ingeniería de software orientadas a la calidad del código, la seguridad y la mantenibilidad. Mi experiencia abarca el desarrollo full-stack de aplicaciones web y móviles, utilizando tecnologías como TypeScript, React, Next.js, Angular, Supabase, PostgreSQL, Firebase, Vercel y Cloudflare. Incorporo el desarrollo asistido por IA mediante harness engineering dentro de un flujo de trabajo estructurado, guiado por lineamientos claros y buenas prácticas de ingeniería.',
    primaryCta: 'Ver proyectos',
    secondaryCta: 'Contactar',
    subline: 'Full Stack · Arquitectura de software · Web y móvil',
  },
} as const satisfies Dictionary;
