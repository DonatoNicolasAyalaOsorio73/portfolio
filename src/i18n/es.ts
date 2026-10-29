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
  work: {
    heading: 'Proyectos destacados.',
    intro:
      'Sistemas en producción, productos y prototipos, cada uno con su arquitectura documentada.',
    moreHeading: 'Otros proyectos.',
    metaLabels: { client: 'Cliente', when: 'Cuándo', role: 'Rol' },
    access: {
      live: 'En línea',
      livePriv: 'En línea · código privado',
      priv: 'Código privado',
      intern: 'Práctica profesional',
    },
    actions: {
      visitNarinohoy: 'Visitar nariñohoy.com ↗',
      visitSite: 'Visitar sitio ↗',
      demo: 'Demo en vivo ↗',
      repo: 'Repositorio ↗',
    },
    featured: [
      {
        id: 'narinohoy',
        kind: 'PLATAFORMA DE NOTICIAS',
        summary:
          'CMS a medida sobre WordPress para un medio regional: acceso por roles para 13 editores, auditoría por usuario, backups diarios de registros, rollback y validación de integridad entre base de datos y contenido.',
        client: 'NariñoHoy, medio digital',
        role: 'Desarrollador Full Stack · Freelance',
        logoAlt: 'Logo de NariñoHoy',
        shotAlt: 'La página de inicio de NariñoHoy',
      },
      {
        id: 'steady',
        kind: 'PRODUCTO',
        summary:
          'Registro de certificaciones para una empresa de perros de asistencia: verificación pública por ID, código, QR o código de barras, y un panel administrativo privado. Toda lectura y escritura pasa por el servidor; la base de datos rechaza el acceso directo.',
        client: 'Steady Guardians, Colombia',
        role: 'Desarrollador Full Stack · Freelance',
        logoAlt: 'Logo de Steady Guardians',
        shotAlt: 'La página de inicio de Steady Guardians',
      },
      {
        id: 'ecobike',
        kind: 'TESIS MERITORIA',
        summary:
          'App de ciclismo para Nariño en iOS, Android y web desde un solo código Expo: recorridos GPS con pausa automática, Eco ruta con indicaciones giro a giro, puntos verificados por el servidor, premios con QR en 11 tiendas aliadas, amigos, chat, liga semanal y un panel de administración auditado.',
        client: 'Universidad Mariana · tesis',
        role: 'Autor',
        logoAlt: 'Logo de EcoBike',
        shotAlt: 'La demo web de EcoBike',
      },
    ],
    others: [
      {
        id: 'andino',
        kind: 'INSTITUCIONAL',
        summary:
          'Un sitio institucional en Angular (V01) que evolucionó a un CRM de registros estudiantiles en TypeScript y Supabase (V02), entregado con Scrum en Azure DevOps.',
        role: 'Desarrollador Junior → Líder de desarrollo',
        logoAlt: 'Logo del Centro de Estudios Andino',
      },
      {
        id: 'siesa',
        kind: 'PRUEBA TÉCNICA',
        summary:
          'Prototipo MES en Next.js 14 con integración bidireccional entre manufactura y calidad, dashboards con Recharts y un asistente de defectos con Gemini y respaldo offline.',
        client: 'Siesa',
        role: 'Desarrollador único, con Claude Code',
        logoAlt: 'Logo de Siesa MES',
      },
      {
        id: 'cognitios',
        kind: 'PRÁCTICA PROFESIONAL',
        summary:
          'Interfaces responsive en Angular, servicios con RxJS, CRUD y reportes en JavaScript, y endpoints REST documentados y probados con Postman e Insomnia.',
        role: 'Practicante Full Stack · Bogotá',
        logoAlt: 'Logo de Cognitios',
      },
    ],
  },
} as const satisfies Dictionary;
