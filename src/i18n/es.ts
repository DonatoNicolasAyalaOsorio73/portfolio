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
    architecture: {
      open: 'Ver arquitectura',
      eyebrow: 'POR DENTRO',
      close: 'Cerrar',
      titleSuffix: ': cómo está hecho.',
      fields: { role: 'FUNCIÓN', tech: 'TECNOLOGÍA', why: 'POR QUÉ', tradeoff: 'COMPROMISO' },
      projects: [
        {
          id: 'narinohoy',
          intro:
            'Un WordPress a medida donde cada acción editorial se verifica, se registra y se puede recuperar.',
          flow: [
            { id: 'editor', label: 'EDITOR' },
            { id: 'role-check', label: 'VERIFICACIÓN DE ROL' },
            { id: 'action', label: 'ACCIÓN' },
            { id: 'audit-log', label: 'REGISTRO DE AUDITORÍA' },
          ],
          nodes: [
            {
              id: 'editorial-team',
              label: 'Equipo editorial',
              sub: '13 usuarios, cada uno con su rol',
              role: 'Los editores publican entre 250 y 350 noticias al mes. Cada cuenta tiene un rol que define qué puede tocar.',
              tech: 'Control de acceso por roles (RBAC) sobre WordPress',
              why: 'El control por roles eliminó la pérdida accidental de contenido.',
            },
            {
              id: 'custom-cms',
              label: 'CMS a medida',
              sub: 'WordPress · PHP · JS · CSS',
              role: 'Un WordPress personalizado que gestiona la publicación, las secciones y el sitio público.',
              tech: 'WordPress, PHP, JavaScript, CSS',
            },
            {
              id: 'traceability',
              label: 'Trazabilidad',
              sub: 'Quién hizo qué, y cuándo',
              role: 'Una cronología forense de cada acción por usuario y un panel semanal de desempeño por editor.',
              tech: 'Registros de auditoría, paneles de administración a medida',
            },
            {
              id: 'recovery',
              label: 'Recuperación',
              sub: 'Backups · rollback · bloqueo',
              role: 'Los registros de auditoría se respaldan cada 24 horas. Los cambios se pueden revertir y un protocolo de bloqueo de emergencia puede congelar el sistema.',
              tech: 'Backups diarios, rollback, validación de integridad entre base de datos y contenido',
              why: 'Las validaciones confirman que lo que hay en la base de datos coincide con lo publicado.',
            },
            {
              id: 'delivery-and-health',
              label: 'Entrega y salud',
              sub: 'Cloudflare · smoke tests · SEO',
              role: 'Cloudflare gestiona el DNS y el dominio. Tras cada despliegue corren smoke tests, y un centro de salud SEO detecta problemas automáticamente.',
              tech: 'Cloudflare, smoke tests post-despliegue, revisión SEO automática',
            },
            {
              id: 'how-it-was-built',
              label: 'Cómo se construyó',
              sub: 'BMAD · Copilot · Claude',
              role: 'Construido con el método BMAD, GitHub Copilot y Claude. Cada entrega pasó por revisión humana.',
              tech: 'BMAD, GitHub Copilot, Claude',
            },
          ],
        },
        {
          id: 'steady',
          intro:
            'Una app en Next.js sobre Vercel y Supabase, construida para un cliente. Cualquiera puede verificar un certificado; solo la organización puede emitirlo. El código es privado; el sitio está en línea.',
          flow: [
            { id: 'admin-login', label: 'LOGIN ADMIN' },
            { id: 'new-certificate', label: 'NUEVO CERTIFICADO' },
            { id: 'id-qr-generated', label: 'ID + QR GENERADOS' },
            { id: 'public-lookup', label: 'VERIFICACIÓN PÚBLICA' },
          ],
          nodes: [
            {
              id: 'public-site',
              label: 'Sitio público',
              sub: 'Next.js App Router',
              role: 'Landing, programas de entrenamiento, proceso, preguntas frecuentes y contacto. Las páginas son Server Components prerenderizados en el build; solo las partes interactivas corren en el cliente.',
              tech: 'Next.js 14 (App Router), React 18, TypeScript (estricto), Tailwind CSS, next/font',
              why: 'Las páginas estáticas cargan rápido y no necesitan servidor en cada visita.',
              tradeoff: 'Cambiar el contenido requiere un nuevo despliegue.',
            },
            {
              id: 'certificate-lookup',
              label: 'Verificación de certificados',
              sub: 'ID · código · QR · código de barras',
              role: 'Cualquiera puede consultar un certificado escribiendo su ID o código de verificación, o escaneando su QR o código de barras con la cámara. El formato se detecta solo, así que cualquiera de los dos valores funciona en cualquier campo. Un endpoint del servidor devuelve una sola coincidencia exacta con un conjunto fijo de campos.',
              tech: 'Ruta API de Next.js, html5-qrcode, ZXing',
              why: 'El público nunca toca la base de datos directamente, así que el registro no se puede listar ni descargar.',
              tradeoff:
                'Cada consulta es una llamada a una función serverless en lugar de una consulta directa.',
            },
            {
              id: 'admin-panel',
              label: 'Panel administrativo',
              sub: 'Privado · sesión firmada · intentos limitados',
              role: 'La organización inicia sesión para emitir, editar y revocar certificados. Los IDs, códigos de verificación, QR y códigos de barras se generan solos; las fotos y los registros de vacunas se adjuntan a cada certificado. El login admite 10 intentos cada 15 minutos por cliente; el contador guarda la IP solo como hash con clave y la borra en menos de 24 horas.',
              tech: 'Rutas API, JSON Web Tokens, limitador en Postgres, pg_cron, qrcode, JsBarcode',
              why: 'Un administrador y sin gestión de usuarios: nada extra que operar ni proteger. El limitador frena la adivinación de contraseñas sin un servicio de pago.',
              tradeoff:
                'Una sola cuenta compartida, sin recuperación de contraseña ni auditoría por usuario; si el contador falla, el login se bloquea.',
            },
            {
              id: 'data-and-files',
              label: 'Datos y archivos',
              sub: 'Supabase Postgres + Storage',
              role: 'Una tabla de certificaciones con índices, un trigger que mantiene updated_at y un bucket para fotos y PDFs. Row Level Security rechaza toda petición directa con la clave pública; solo el servidor lee y escribe.',
              tech: 'PostgreSQL, PL/pgSQL, Row Level Security, Supabase Storage, URLs de subida firmadas',
              why: 'Las reglas se mantienen aunque la clave pública se filtre. Las URLs firmadas permiten subir PDFs grandes sin el límite de las funciones serverless.',
              tradeoff:
                'La autorización vive en el código del servidor, no en políticas de base de datos por rol.',
            },
            {
              id: 'delivery',
              label: 'Entrega',
              sub: 'Vercel · Cloudflare · WhatsApp',
              role: 'Hosting serverless en Vercel con un build de prueba por cada pull request, DNS en Cloudflare y un formulario de contacto que abre un mensaje de WhatsApp en lugar de guardar solicitudes. Los secretos viven solo en variables de entorno del servidor, y cada cambio llega a main por un pull request.',
              tech: 'Vercel, Cloudflare DNS, enlaces de WhatsApp, GitHub',
              why: 'Cada cambio se compila y revisa antes de llegar a producción.',
              tradeoff:
                'Depende de una plataforma serverless en lugar de hosting estático gratuito.',
            },
            {
              id: 'quality-and-ci',
              label: 'Calidad y CI',
              sub: 'Vitest · Playwright · GitHub Actions',
              role: 'Cada pull request corre la verificación de tipos, 128 pruebas unitarias y de integración y 28 pruebas end-to-end contra un build de producción. Las pruebas unitarias simulan Supabase y Resend y fallan si un endpoint público llega a devolver columnas privadas.',
              tech: 'Vitest, React Testing Library, Playwright, GitHub Actions',
              why: 'Las reglas de seguridad se comprueban en cada cambio, no se recuerdan.',
              tradeoff:
                'Las pruebas end-to-end corren contra un build local, nunca contra datos de producción.',
            },
            {
              id: 'how-it-was-built',
              label: 'Cómo se construyó',
              sub: 'BMAD · Claude Code',
              role: 'Los cambios siguen el método BMAD: primero un plan con criterios de aceptación, luego la implementación y después revisiones independientes antes de integrar. Una revisión de seguridad llevó toda lectura y escritura al servidor y rotó las claves; el límite de intentos, la suite de pruebas y las mejoras de accesibilidad siguieron el mismo camino.',
              tech: 'Método BMAD, Claude Code',
              why: 'Los agentes proponen; cada cambio pasa por revisión humana.',
            },
          ],
        },
        {
          id: 'ecobike',
          intro:
            'Un solo código Expo para iOS, Android y web, contra un proyecto de Firebase y una API serverless. La app es local-first; todo lo que tiene valor (puntos, roles, canjes, tiendas) lo escribe solo el servidor. Elige un componente para ver su función y el trade-off detrás.',
          flow: [
            { id: 'ride-on-device', label: 'RECORRIDO EN EL TELÉFONO' },
            { id: 'server-scores-it', label: 'EL SERVIDOR LO PUNTÚA' },
            { id: 'points-balance', label: 'SALDO DE PUNTOS' },
            { id: 'qr-redemption', label: 'CANJE CON QR' },
          ],
          nodes: [
            {
              id: 'clients',
              label: 'Clientes',
              sub: 'iOS · Android · Web',
              role: 'La misma app en tres plataformas, con barra lateral en la web de escritorio. Un modo invitado con datos de ejemplo permite probar todas las pantallas desde un enlace, sin cuenta.',
              tech: 'Expo SDK 57, React Native 0.86, React 19, Expo Router, Reanimated 4, TypeScript (estricto)',
              why: 'Un solo proyecto que compilar, probar y publicar; la web sirve también como demo sin instalación.',
              tradeoff: 'En la web no hay GPS en segundo plano, notificaciones push ni biometría.',
            },
            {
              id: 'layers-and-platform-pairs',
              label: 'Capas y pares por plataforma',
              sub: 'app → components → hooks → stores → services → domain',
              role: 'Las reglas de negocio (puntaje, rachas, misiones, verificación) viven en una capa de dominio pura, sin I/O. Las diferencias por plataforma van en archivos pareados (name.ts / name.web.ts) con la misma API; el empaquetador y el verificador de tipos eligen el correcto.',
              tech: 'Stores con Zustand, extensiones por plataforma de Metro, moduleSuffixes en tsconfig, 15 reglas de arquitectura escritas',
              why: 'Las reglas se prueban sin un teléfono y las pantallas nunca llaman a Firebase directamente.',
              tradeoff:
                'Cada par por plataforma son dos archivos que deben mantener el mismo contrato.',
            },
            {
              id: 'maps-and-eco-ruta',
              label: 'Mapas y Eco ruta',
              sub: 'Apple Maps · MapLibre · Leaflet',
              role: 'Seguimiento GPS en vivo con pausa automática, y Eco ruta: busca un lugar, compara rutas en bici que evitan vías destapadas y con tráfico, y recórrela con indicaciones giro a giro y aviso de fuera de ruta.',
              tech: 'expo-maps (iOS), MapLibre + OpenFreeMap (Android), Leaflet + OpenStreetMap (web), búsqueda con Photon, rutas en bici con Valhalla',
              why: 'Sin claves de API ni cuentas de facturación, y rutas que entienden lo que le importa a un ciclista.',
              tradeoff:
                'Tres implementaciones de mapa detrás de un contrato; los servidores públicos de rutas no tienen SLA.',
            },
            {
              id: 'local-first-storage',
              label: 'Almacenamiento local-first',
              sub: 'SQLite · localStorage',
              role: 'Recorridos, trazados, logros y canjes se guardan primero en el dispositivo, así un recorrido nunca se pierde sin señal. Los que no se sincronizaron se reintentan al volver la conexión.',
              tech: 'expo-sqlite con migraciones en el lugar (móvil), localStorage (web), SecureStore para ajustes',
              why: 'Funciona sin conexión; listas y estadísticas leen resúmenes y nunca procesan trazados GPS.',
              tradeoff:
                'Las copias local y del servidor deben conciliarse cuando se borra un recorrido en otro dispositivo.',
            },
            {
              id: 'serverless-api',
              label: 'API serverless',
              sub: 'Vercel · Firebase Admin SDK',
              role: 'Once funciones hacen toda escritura con valor: verifican el token de Firebase, puntúan el recorrido, limitan los puntos diarios, rechazan recorridos superpuestos o inverosímiles y emiten códigos de canje de un solo uso. Las acciones de administración (tiendas, usuarios, roles, puntos) quedan auditadas.',
              tech: 'Funciones de Vercel (Node), Firebase Admin SDK, transacciones de Firestore, límites por usuario',
              why: 'Un cliente modificado no puede crear puntos ni canjear gratis; la clave de servicio nunca llega al bundle.',
              tradeoff:
                'Las reglas de puntaje existen en dos copias (vista previa en el cliente y servidor), igualadas por una prueba de paridad.',
            },
            {
              id: 'firebase',
              label: 'Firebase',
              sub: 'Auth · Firestore',
              role: 'Cuentas (correo, Google, Apple), perfiles, amigos, chat, recorridos y el catálogo de aliados. Los clientes solo leen los campos con valor; las reglas de seguridad y los índices compuestos se versionan con el código. Logos y avatares son imágenes pequeñas guardadas dentro de sus documentos.',
              tech: 'SDK cliente de Firebase 12, reglas de seguridad de Firestore, índices compuestos',
              why: 'Autenticación y datos gestionados dentro del plan gratuito; sin servicio de archivos que pagar.',
              tradeoff:
                'Las imágenes deben ser pequeñas (256 px), porque cada lectura del documento las incluye.',
            },
            {
              id: 'quality-and-ci',
              label: 'Calidad y CI',
              sub: 'node:test · Playwright · GitHub Actions',
              role: 'Cada push corre la verificación de tipos, lint, 174 pruebas unitarias y de API (los handlers reales contra un Firebase Admin en memoria), las reglas de Firestore en el emulador y 22 pruebas end-to-end en teléfono y escritorio.',
              tech: 'node:test, Playwright, emulador de Firebase, ESLint, GitHub Actions',
              why: 'Las reglas antifraude y de seguridad se comprueban en cada cambio, no se recuerdan.',
              tradeoff:
                'Las pruebas end-to-end simulan los servicios externos y nunca tocan datos de producción.',
            },
            {
              id: 'how-it-was-built',
              label: 'Cómo se construyó',
              sub: 'BMAD · Claude Code',
              role: 'Empezó como mi tesis en 2024 y se reconstruyó en 2026 con el método BMAD: primero las reglas de arquitectura, luego la implementación, revisión de código, revisión de seguridad y pruebas antes de cada integración. Cada cambio pasó por revisión humana.',
              tech: 'Método BMAD, Claude Code',
              why: 'Los agentes proponen; yo tomo las decisiones de arquitectura y reviso cada cambio.',
            },
          ],
        },
        {
          id: 'siesa',
          intro:
            'Un prototipo en Next.js donde manufactura y calidad se comunican en ambas direcciones.',
          flow: [
            { id: 'operation-done', label: 'OPERACIÓN TERMINADA' },
            { id: 'inspection', label: 'INSPECCIÓN' },
            { id: 'batch-rejected', label: 'LOTE RECHAZADO' },
            { id: 'order-halted', label: 'ORDEN DETENIDA' },
          ],
          nodes: [
            {
              id: 'manufacturing',
              label: 'Manufactura',
              sub: '8 vistas',
              role: 'Órdenes de producción, rutas, centros de trabajo, lista de materiales, estructura de costos, costeo de rutas, registro de tiempos y avance en planta.',
              tech: 'Next.js 14 (App Router), TypeScript, Tailwind CSS',
            },
            {
              id: 'quality',
              label: 'Calidad',
              sub: 'Inspecciones y trazabilidad',
              role: 'Inspecciones pendientes, no conformidades, trazabilidad e indicadores de calidad.',
              tech: 'Next.js, Recharts',
            },
            {
              id: 'two-way-integration',
              label: 'Integración bidireccional',
              sub: 'Manufactura ⇄ Calidad',
              role: 'Completar una operación dispara automáticamente una inspección. Rechazar un lote detiene la orden en planta.',
              tech: 'Estado compartido entre módulos',
            },
            {
              id: 'ai-assistant',
              label: 'Asistente de IA',
              sub: 'Gemini + modo offline',
              role: 'Un asistente por voz o texto para registrar defectos, más un análisis predictivo de riesgo.',
              tech: 'Google Gemini, con respaldo offline',
            },
            {
              id: 'data-and-dashboard',
              label: 'Datos y dashboard',
              sub: 'Google Sheets · Recharts',
              role: 'Un dashboard ejecutivo con KPIs, gráficas y alertas en vivo. Una hoja pública de Google Sheets hace de backend simulado.',
              tech: 'Recharts, Google Sheets, Vitest',
            },
            {
              id: 'how-it-was-built',
              label: 'Cómo se construyó',
              sub: 'Claude Code',
              role: 'Construido de principio a fin con Claude Code.',
              tech: 'Claude Code',
            },
          ],
        },
        {
          id: 'andino',
          intro:
            'El código es privado, así que esta vista cubre solo estructura y decisiones. Es la historia de un sistema que creció, y de mi rol creciendo con él.',
          flow: [
            { id: 'v01-website', label: 'V01 SITIO WEB' },
            { id: 'tests-and-docs', label: 'PRUEBAS Y DOCS' },
            { id: 'v02-crm', label: 'V02 CRM' },
            { id: 'team-of-4', label: 'EQUIPO DE 4' },
          ],
          nodes: [
            {
              id: 'institutional-website',
              label: 'Sitio institucional',
              sub: '2023 – 2024 · Desarrollador Junior',
              role: 'El sitio web del centro, construido en Angular. También escribí la documentación técnica y los manuales de usuario.',
              tech: 'Angular, TypeScript, Bootstrap',
            },
            {
              id: 'testing',
              label: 'Pruebas',
              sub: 'Jasmine + Karma',
              role: 'Pruebas unitarias para la app en Angular.',
              tech: 'Jasmine, Karma',
            },
            {
              id: 'automation-and-support',
              label: 'Automatización y soporte',
              sub: 'VBA · redes',
              role: 'Automatización de tareas con VBA y soporte de red.',
              tech: 'VBA',
            },
            {
              id: 'student-records-crm',
              label: 'CRM de registros estudiantiles',
              sub: '2025 · Líder de desarrollo',
              role: 'Un CRM para gestionar los registros de estudiantes.',
              tech: 'TypeScript, Supabase',
            },
            {
              id: 'team-and-process',
              label: 'Equipo y proceso',
              sub: 'Scrum Master · equipo de 4',
              role: 'Lideré un equipo de cuatro como Scrum Master, con el trabajo en Azure DevOps y el código en GitHub.',
              tech: 'Scrum, Azure DevOps, GitHub',
            },
          ],
        },
        {
          id: 'cognitios',
          intro: 'Una práctica en un equipo full stack: front end, servicios, backend y APIs.',
          flow: [],
          nodes: [
            {
              id: 'interfaces',
              label: 'Interfaces',
              sub: 'HTML · CSS · Angular',
              role: 'Interfaces responsive y componentes en Angular.',
              tech: 'HTML, CSS, Angular',
            },
            {
              id: 'services',
              label: 'Servicios',
              sub: 'Angular + RxJS',
              role: 'Servicios de Angular que consumen el backend con RxJS.',
              tech: 'Angular, RxJS',
            },
            {
              id: 'backend',
              label: 'Backend',
              sub: 'JavaScript',
              role: 'Operaciones CRUD y generación de reportes.',
              tech: 'JavaScript',
            },
            {
              id: 'api',
              label: 'API',
              sub: 'REST, documentada',
              role: 'Endpoints REST documentados, probados con Postman e Insomnia.',
              tech: 'REST, Postman, Insomnia',
            },
            {
              id: 'version-control',
              label: 'Control de versiones',
              sub: 'GitLab',
              role: 'Ramas y merge requests en GitLab.',
              tech: 'GitLab',
            },
          ],
        },
      ],
    },
  },
  stack: {
    eyebrow: 'STACK TECNOLÓGICO',
    intro: 'Organizado por capa. Cada tecnología muestra para qué la usé y en qué proyectos.',
    usedIn: 'PROYECTOS EN ESTA CAPA',
    groups: [
      {
        id: 'frontend',
        title: 'Frontend.',
        short: 'FRONTEND',
        items: [
          { id: 'react', purpose: 'Interfaces por componentes' },
          { id: 'nextjs', purpose: 'App Router, SSR y rutas API' },
          { id: 'angular', purpose: 'Apps institucionales, servicios RxJS' },
          { id: 'typescript', purpose: 'Código tipado en todo el stack' },
          { id: 'react-native-expo', purpose: 'iOS, Android y web desde un solo código' },
          { id: 'tailwind-css', purpose: 'Estilos utility-first' },
        ],
      },
      {
        id: 'data',
        title: 'Backend y datos.',
        short: 'DATOS',
        items: [
          { id: 'supabase', purpose: 'Postgres, Auth y APIs' },
          { id: 'postgresql', purpose: 'Esquemas relacionales, índices, triggers' },
          { id: 'firebase', purpose: 'Auth, Firestore y reglas de seguridad' },
          { id: 'wordpress-php', purpose: 'Desarrollo de CMS a medida' },
          { id: 'rest-apis', purpose: 'Endpoints documentados y probados' },
        ],
      },
      {
        id: 'cloud',
        title: 'Cloud y entrega.',
        short: 'CLOUD',
        items: [
          { id: 'vercel', purpose: 'Hosting y funciones serverless' },
          { id: 'cloudflare', purpose: 'DNS, SSL y HSTS' },
          { id: 'github', purpose: 'Control de versiones y revisión de código' },
          { id: 'azure-devops', purpose: 'Tableros, sprints y repositorios' },
          { id: 'gitlab', purpose: 'Merge requests' },
          { id: 'scrum', purpose: 'Entrega por sprints' },
        ],
      },
      {
        id: 'quality',
        title: 'Pruebas y calidad.',
        short: 'CALIDAD',
        items: [
          { id: 'vitest', purpose: 'Pruebas unitarias y de integración' },
          { id: 'react-testing-library', purpose: 'Pruebas de componentes' },
          { id: 'jasmine-karma', purpose: 'Pruebas unitarias en Angular' },
          { id: 'playwright', purpose: 'QA end-to-end en CI' },
          { id: 'smoke-tests', purpose: 'Verificación post-despliegue' },
          { id: 'postman-insomnia', purpose: 'Pruebas de API' },
        ],
      },
      {
        id: 'security',
        title: 'Seguridad y confiabilidad.',
        short: 'SEGURIDAD',
        items: [
          { id: 'rbac', purpose: 'Control de acceso por roles' },
          { id: 'row-level-security', purpose: 'Permisos a nivel de base de datos' },
          { id: 'token-verification', purpose: 'Firebase Admin SDK en el servidor' },
          { id: 'audit-logs', purpose: 'Cronología forense por usuario' },
          { id: 'backups-rollback', purpose: 'Backups diarios y recuperación' },
        ],
      },
      {
        id: 'ai',
        title: 'Ingeniería con IA.',
        short: 'IA',
        items: [
          { id: 'bmad-method', purpose: 'Entrega por fases con agentes' },
          { id: 'claude-code', purpose: 'Análisis, documentación y código' },
          { id: 'github-copilot', purpose: 'Asistencia en el editor' },
          { id: 'gemini-api', purpose: 'Funciones de IA en el producto' },
        ],
      },
    ],
  },
  ai: {
    eyebrow: 'INGENIERÍA ASISTIDA POR IA',
    headingLine1: 'La IA acelera la entrega.',
    headingLine2: 'Las decisiones siguen siendo de ingeniería.',
    intro:
      'Uso el método BMAD para estructurar el desarrollo asistido por IA en fases con artefactos explícitos. Los agentes redactan briefs, PRDs, documentos de arquitectura, historias y código; yo valido el alcance, tomo las decisiones de arquitectura, reviso cada cambio y ejecuto las pruebas antes de publicar.',
    imageAlt: 'Método BMAD',
    caption: 'Método BMAD: fases guiadas por agentes, del análisis a QA. Aplicado en NariñoHoy.',
    phases: [
      {
        id: 'analysis',
        phase: 'Análisis',
        agent: 'AGENTE ANALISTA',
        artifact: 'Brief del proyecto: problema, usuarios, restricciones',
        me: 'Valido el problema y el alcance',
      },
      {
        id: 'planning',
        phase: 'Planeación',
        agent: 'AGENTE PM',
        artifact: 'PRD con requisitos funcionales y no funcionales',
        me: 'Apruebo requisitos y prioridades',
      },
      {
        id: 'solutioning',
        phase: 'Solución',
        agent: 'AGENTE ARQUITECTO',
        artifact: 'Documento de arquitectura: stack, límites, modelo de datos',
        me: 'Tomo las decisiones de arquitectura',
      },
      {
        id: 'implementation',
        phase: 'Implementación',
        agent: 'AGENTES SM + DEV',
        artifact: 'Historias de usuario y código funcional',
        me: 'Reviso cada cambio antes de integrarlo',
      },
      {
        id: 'quality-assurance',
        phase: 'Aseguramiento de calidad',
        agent: 'AGENTE QA',
        artifact: 'Resultados de pruebas y notas de revisión',
        me: 'Ejecuto las pruebas y doy el visto bueno',
      },
    ],
  },
  journey: {
    headingLine1: 'Trayectoria,',
    headingLine2: 'año a año.',
    entries: [
      {
        id: 'systems-engineering',
        stage: 'Ingeniería de Sistemas',
        note: 'Universidad Mariana: algoritmos, estructuras de datos, bases de datos y diseño de software. Certificación Scrum Fundamentals en 2022.',
      },
      {
        id: 'first-interfaces',
        stage: 'Primeras interfaces en producción',
        note: 'Práctica full stack en Cognitios: Angular, APIs REST, GitLab. Editorial UNIMAR publica EcoBike como capítulo de libro.',
      },
      {
        id: 'institutional-software',
        stage: 'Software institucional',
        note: 'Centro de Estudios Andino: sitio en Angular, pruebas, documentación y automatización.',
      },
      {
        id: 'thesis',
        stage: 'Tesis meritoria',
        note: 'EcoBike. AWS Well-Architected Foundations.',
      },
      {
        id: 'team-lead',
        stage: 'Liderando un equipo',
        note: 'Scrum Master de un equipo de cuatro, construyendo un CRM con Supabase y Azure DevOps.',
      },
      {
        id: 'shipping-products',
        stage: 'Entregando productos',
        note: 'Steady Guardians: Next.js, Supabase, Vercel y pruebas automatizadas.',
      },
      {
        id: 'masters',
        stage: 'Maestría',
        note: 'Especialización (2025) y maestría (2026) en Ingeniería de Software en la Javeriana Cali.',
      },
      {
        id: 'reliability-ai',
        stage: 'Confiabilidad e ingeniería con IA',
        note: 'NariñoHoy: control de acceso, auditoría, backups y rollback. BMAD con revisión humana.',
      },
    ],
  },
  education: {
    eyebrow: 'SOBRE MÍ',
    heading: 'Formación académica.',
    schools: [
      {
        id: 'javeriana',
        logoAlt: 'Logo de la Pontificia Universidad Javeriana Cali',
        degrees: [
          { id: 'masters', title: 'Magíster en Ingeniería de Software' },
          { id: 'specialization', title: 'Especialista en Ingeniería de Software' },
        ],
      },
      {
        id: 'mariana',
        logoAlt: 'Logo de la Universidad Mariana',
        degrees: [
          { id: 'systems-engineering', title: 'Ingeniero de Sistemas' },
          { id: 'thesis', title: 'Tesis meritoria · EcoBike' },
        ],
      },
    ],
  },
  certificates: {
    heading: 'Certificaciones.',
    verified: 'Verificado',
    view: 'Ver certificado ↗',
    viewLabel: 'Ver certificado',
    items: [
      { id: 'github', logoAlt: 'Insignia de GitHub Foundations' },
      { id: 'scrum', logoAlt: 'Insignia de Scrum Fundamentals Certified' },
      { id: 'csharp', logoAlt: 'Certificado de Foundational C# with Microsoft' },
      { id: 'aws', logoAlt: 'Insignia de AWS Well-Architected Foundations' },
    ],
  },
  contact: {
    heading: 'Construyamos algo bien pensado.',
    intro:
      'Disponible para cargos de tiempo completo y proyectos freelance. La forma más rápida de contactarme es por correo o WhatsApp.',
    email: 'Enviar correo',
    whatsapp: 'WhatsApp',
    cv: 'Descargar CV',
    emailSubject: 'Hola Donato',
    whatsappText: 'Hola Donato, vi tu portafolio.',
    linkedin: 'LinkedIn ↗',
    github: 'GitHub ↗',
    copy: {
      idle: 'Copiar',
      ok: 'Copiado ✓',
      fail: 'No se pudo copiar',
      okMessage: 'Correo copiado.',
      failMessage:
        'No se pudo copiar. La dirección quedó seleccionada para que la copies manualmente.',
    },
  },
  mail: {
    title: 'Escríbeme.',
    to: 'Para:',
    close: 'Cerrar',
    name: 'Tu nombre (opcional)',
    subject: 'Asunto',
    subjectPlaceholder: 'p. ej. Cargo full stack en Acme',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntame sobre el cargo, el proyecto o los tiempos.',
    send: 'Abrir en mi correo',
    gmail: 'Enviar con Gmail',
    note: 'Tu mensaje se redacta aquí y se abre en tu cliente de correo. Este sitio no guarda ni envía nada.',
    missing: 'Escribe un asunto y un mensaje para continuar.',
    sent: 'Tu app de correo debería abrirse con el mensaje listo. Si no pasó nada, usa Gmail o copia la dirección.',
  },
} as const satisfies Dictionary;
