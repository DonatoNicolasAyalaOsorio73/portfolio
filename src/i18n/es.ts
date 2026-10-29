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
  sequence: {
    label: 'Cómo trabajo',
    items: [
      {
        id: 'reliability',
        statement: 'Software confiable, hecho para perdurar.',
        label: 'CONFIABILIDAD',
      },
      {
        id: 'scalability',
        statement: 'Software que crece junto con tu negocio.',
        label: 'ESCALABILIDAD',
      },
      {
        id: 'alignment',
        statement: 'Tecnología diseñada en torno a tus objetivos.',
        label: 'ALINEACIÓN',
      },
      { id: 'speed', statement: 'Prototipos rápidos para validar tu idea.', label: 'VELOCIDAD' },
    ],
  },
  philosophy: {
    label: 'Filosofía',
    heading: 'El gran software empieza antes del primer commit.',
    intro:
      'Trato producto, arquitectura, ingeniería y experiencia como un solo sistema: una decisión en una capa cambia las demás.',
    howLabel: 'Cómo:',
    steps: [
      {
        id: 'discovery',
        word: 'Descubrimiento',
        note: 'Comprender el contexto de negocio, los usuarios y el objetivo que motiva la iniciativa.',
        how: 'Entrevistas con stakeholders · Investigación de usuarios · Mapeo de procesos · Análisis de negocio',
      },
      {
        id: 'requirements',
        word: 'Requerimientos',
        note: 'Convertir la ambigüedad en una definición acotada, priorizada y verificable de lo que se debe construir.',
        how: 'Levantamiento de requerimientos · Análisis de causa raíz · Historias de usuario · Criterios de aceptación · Requerimientos no funcionales · Wireframing · Prototipado · Flujos de usuario',
      },
      {
        id: 'architecture',
        word: 'Arquitectura',
        note: 'Definir la estructura de la solución según las exigencias de escalabilidad, seguridad y mantenibilidad.',
        how: 'Diseño de sistemas · Patrones de arquitectura · Modelado de datos · Diseño de APIs · Registros de decisiones de arquitectura (ADR)',
      },
      {
        id: 'delivery',
        word: 'Entrega',
        note: 'Construir en iteraciones cortas, con prácticas que mantienen el código revisable, seguro y listo para desplegar.',
        how: 'Git · Revisión de código · CI/CD · Pruebas automatizadas · Autenticación y autorización · Prácticas de codificación segura (OWASP) · Desarrollo asistido por IA (método BMAD) con revisión humana',
      },
      {
        id: 'operation',
        word: 'Operación y evolución',
        note: 'Confirmar que la solución atiende la necesidad, mantenerla confiable en producción y mejorarla a partir del uso real.',
        how: 'Pruebas de aceptación · Retroalimentación de usuarios · Análisis de rendimiento · Observabilidad · Documentación técnica · Transferencia de conocimiento · Mejora iterativa',
      },
    ],
  },
} as const satisfies Dictionary;
