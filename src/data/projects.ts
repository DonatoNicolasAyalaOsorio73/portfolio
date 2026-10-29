/**
 * Work section data (AD-4): everything about a project that is not translated. The copy for
 * each project lives in `work.featured` / `work.others` of the dictionaries, in the same order
 * and joined by `id`.
 */
import type { ImageMetadata } from 'astro';
import logoAndino from '../assets/logo-andino.webp';
import logoCognitios from '../assets/logo-cognitios-mark.webp';
import logoEcobike from '../assets/logo-ecobike.webp';
import logoNarinohoy from '../assets/logo-narinohoy.webp';
import logoSiesa from '../assets/logo-siesa.webp';
import logoSteady from '../assets/logo-steady.webp';
import shotEcobike from '../assets/shot-ecobike.webp';
import shotNarinohoy from '../assets/shot-narinohoy.webp';
import shotSteady from '../assets/shot-steady.webp';

/** Access status shown under each project; its dot colour and ring are CSS keyed on it. */
export type Access = 'live' | 'livePriv' | 'priv' | 'intern';

/** Keys of `work.actions` in the dictionaries. */
export type ActionLabel = 'visitNarinohoy' | 'visitSite' | 'demo' | 'repo';

export interface ProjectAction {
  label: ActionLabel;
  href: string;
  /** The filled (ink) button; the others are outlined. */
  primary: boolean;
}

interface ProjectBase {
  id: string;
  /** Display number, kept from the legacy site (the others are not in sequence). */
  number: string;
  name: string;
  logo: ImageMetadata;
  /** Logo corner radius and blend mode, as in the legacy data. */
  logoRadius: string;
  blend: 'normal' | 'multiply';
  /** "When" meta value per locale, where the project has one. */
  when?: { en: string; es: string };
  stack: readonly string[];
  access: Access;
  /** External links only; every one opens in a new tab. */
  actions: readonly ProjectAction[];
}

export interface FeaturedProject extends ProjectBase {
  shot: ImageMetadata;
  domain: string;
}

export interface OtherProject extends ProjectBase {
  /** Logo height inside its row. */
  logoHeight: string;
  /** Parallax travel of the logo row, in px over the grid's pass through the viewport. */
  speed: number;
}

/** Featured projects, in display order: each is a pinned scene on wide screens. */
export const featured: readonly FeaturedProject[] = [
  {
    id: 'narinohoy',
    number: '01',
    name: 'NariñoHoy',
    logo: logoNarinohoy,
    logoRadius: '0',
    blend: 'normal',
    when: { en: 'Jan – Apr 2026', es: 'Ene – Abr 2026' },
    stack: ['WordPress', 'PHP', 'JavaScript', 'CSS', 'Cloudflare'],
    access: 'live',
    actions: [{ label: 'visitNarinohoy', href: 'https://xn--nariohoy-g3a.com/', primary: true }],
    shot: shotNarinohoy,
    domain: 'nariñohoy.com',
  },
  {
    id: 'steady',
    number: '02',
    name: 'Steady Guardians',
    logo: logoSteady,
    logoRadius: '0',
    blend: 'normal',
    when: { en: 'Aug – Oct 2025', es: 'Ago – Oct 2025' },
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'Row Level Security',
      'Vercel',
      'Cloudflare',
      'Vitest',
      'Playwright',
    ],
    access: 'livePriv',
    actions: [{ label: 'visitSite', href: 'https://www.steadyguardians.com/', primary: true }],
    shot: shotSteady,
    domain: 'steadyguardians.com',
  },
  {
    id: 'ecobike',
    number: '03',
    name: 'EcoBike',
    logo: logoEcobike,
    logoRadius: '0',
    blend: 'normal',
    when: { en: '2024 · rebuilt 2026', es: '2024 · reconstruida en 2026' },
    stack: [
      'Expo SDK 57',
      'React Native',
      'TypeScript',
      'Firebase',
      'Vercel',
      'MapLibre',
      'Leaflet',
      'Valhalla',
      'SQLite',
      'Playwright',
      'GitHub Actions',
    ],
    access: 'live',
    actions: [
      { label: 'demo', href: 'https://ecobike-demo.vercel.app/', primary: true },
      {
        label: 'repo',
        href: 'https://github.com/DonatoNicolasAyalaOsorio73/ecobike',
        primary: false,
      },
    ],
    shot: shotEcobike,
    domain: 'ecobike-demo.vercel.app',
  },
];

/** The "Other projects" grid, in display order. */
export const others: readonly OtherProject[] = [
  {
    id: 'andino',
    number: '04',
    name: 'Centro de Estudios Andino',
    logo: logoAndino,
    logoRadius: '0',
    blend: 'normal',
    logoHeight: '72%',
    speed: 80,
    when: { en: 'Aug 2023 – Jul 2025', es: 'Ago 2023 – Jul 2025' },
    stack: ['Angular', 'TypeScript', 'Bootstrap', 'Supabase', 'Azure DevOps', 'Scrum'],
    access: 'priv',
    actions: [],
  },
  {
    id: 'siesa',
    number: '05',
    name: 'Siesa MES',
    logo: logoSiesa,
    logoRadius: '22%',
    blend: 'normal',
    logoHeight: '86%',
    speed: 110,
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Gemini API', 'Vitest'],
    access: 'live',
    actions: [
      { label: 'demo', href: 'https://siesa.vercel.app/', primary: true },
      {
        label: 'repo',
        href: 'https://github.com/DonatoNicolasAyalaOsorio73/Siesa',
        primary: false,
      },
    ],
  },
  {
    id: 'cognitios',
    number: '06',
    name: 'Cognitios',
    logo: logoCognitios,
    logoRadius: '0',
    blend: 'multiply',
    logoHeight: '82%',
    speed: 60,
    when: { en: 'Feb – May 2023', es: 'Feb – May 2023' },
    stack: ['Angular', 'RxJS', 'JavaScript', 'REST', 'GitLab'],
    access: 'intern',
    actions: [],
  },
];
