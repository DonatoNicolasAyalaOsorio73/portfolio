/**
 * Journey, education and certificates data (AD-4): everything that is not translated. The copy
 * lives in `journey`, `education` and `certificates` of the dictionaries, in the same order and
 * joined by `id`.
 */
import type { ImageMetadata } from 'astro';
import certAws from '../assets/cert-aws.webp';
import certCsharp from '../assets/cert-csharp.webp';
import certGithub from '../assets/cert-github.webp';
import certScrum from '../assets/cert-scrum.webp';
import logoJaveriana from '../assets/logo-javeriana.webp';
import logoMariana from '../assets/logo-mariana.webp';

export interface JourneyEntry {
  id: string;
  year: string;
}

/** The timeline, oldest first; two entries may share a year. */
export const journey: readonly JourneyEntry[] = [
  { id: 'systems-engineering', year: '2019' },
  { id: 'first-interfaces', year: '2023' },
  { id: 'institutional-software', year: '2023' },
  { id: 'thesis', year: '2024' },
  { id: 'team-lead', year: '2025' },
  { id: 'shipping-products', year: '2025' },
  { id: 'masters', year: '2026' },
  { id: 'reliability-ai', year: '2026' },
];

export interface School {
  id: string;
  name: string;
  logo: ImageMetadata;
  /** Parallax travel of the logo, in px over the section's pass through the viewport. */
  speed: number;
  /** Degree ids and their years; the degree titles are in the dictionaries. */
  degrees: readonly { id: string; years: string }[];
}

export const schools: readonly School[] = [
  {
    id: 'javeriana',
    name: 'Pontificia Universidad Javeriana Cali',
    logo: logoJaveriana,
    speed: 110,
    degrees: [
      { id: 'masters', years: '2024 – 2026' },
      { id: 'specialization', years: '2024 – 2025' },
    ],
  },
  {
    id: 'mariana',
    name: 'Universidad Mariana',
    logo: logoMariana,
    speed: 70,
    degrees: [
      { id: 'systems-engineering', years: '2019 – 2024' },
      { id: 'thesis', years: '2024' },
    ],
  },
];

export interface Certificate {
  id: string;
  name: string;
  /** Issuer line, shown as is in both languages. */
  issuer: string;
  year: string;
  logo: ImageMetadata;
  /** Logo corner radius and blend mode, as in the legacy data. */
  radius: string;
  blend: 'normal' | 'multiply';
  /** Parallax travel of the logo, in px over the section's pass through the viewport. */
  speed: number;
  /** Colour of the radial halo behind the logo, in the issuer's brand hue. */
  halo: string;
  /** The credential, on the issuer's site; opens in a new tab. */
  href: string;
}

export const certificates: readonly Certificate[] = [
  {
    id: 'github',
    name: 'GitHub Foundations',
    issuer: 'GITHUB',
    year: '2025',
    logo: certGithub,
    radius: '0',
    blend: 'normal',
    speed: 140,
    halo: 'rgb(130 80 223 / 30%)',
    href: 'https://www.credly.com/badges/1484f1f5-1898-425f-b255-fafd415a3296/linked_in_profile',
  },
  {
    id: 'scrum',
    name: 'Scrum Fundamentals Certified',
    issuer: 'SCRUMSTUDY',
    year: '2022',
    logo: certScrum,
    radius: '0',
    blend: 'normal',
    speed: 100,
    halo: 'rgb(245 130 32 / 28%)',
    href: 'https://c46e136a583f7e334124-ac22991740ab4ff17e21daf2ed577041.ssl.cf1.rackcdn.com/Certificate/ScrumFundamentalsCertified-DonatoNicolasAyalaOsorio-915172.pdf',
  },
  {
    id: 'csharp',
    name: 'Foundational C# with Microsoft',
    issuer: 'FREECODECAMP · MICROSOFT',
    year: '2025',
    logo: certCsharp,
    radius: '20px',
    blend: 'normal',
    speed: 60,
    halo: 'rgb(81 43 212 / 28%)',
    href: 'https://www.freecodecamp.org/certification/fccd7b5b089-564d-4125-9a86-0cd7dd934744/foundational-c-sharp-with-microsoft',
  },
  {
    id: 'aws',
    name: 'AWS Well-Architected Foundations',
    issuer: 'AWS',
    year: '2024',
    logo: certAws,
    radius: '0',
    blend: 'multiply',
    speed: 120,
    halo: 'rgb(255 153 0 / 32%)',
    href: 'https://drive.google.com/file/d/15zqTfZByKMFP5htVYTczhlA99fZGegHW/view',
  },
];
