/**
 * Tech stack and AI-assisted engineering data (AD-4): everything that is not translated. The
 * copy lives in `stack` and `ai` of the dictionaries, in the same order and joined by `id`.
 */
import type { ImageMetadata } from 'astro';
import bmadImage from '../assets/bmad.webp';

/** Ids of the projects in `projects.ts` that a technology was used in. */
export type ProjectId = 'narinohoy' | 'steady' | 'ecobike' | 'siesa' | 'andino' | 'cognitios';

export interface StackItem {
  id: string;
  /** Technology name, shown as is in both languages. */
  name: string;
  projects: readonly ProjectId[];
}

export interface StackGroup {
  id: string;
  items: readonly StackItem[];
}

/** The six capability groups, in display order; one tab and one panel each. */
export const stackGroups: readonly StackGroup[] = [
  {
    id: 'frontend',
    items: [
      { id: 'react', name: 'React', projects: ['steady', 'siesa', 'ecobike'] },
      { id: 'nextjs', name: 'Next.js', projects: ['steady', 'siesa'] },
      { id: 'angular', name: 'Angular', projects: ['andino', 'cognitios'] },
      {
        id: 'typescript',
        name: 'TypeScript',
        projects: ['steady', 'siesa', 'andino', 'ecobike'],
      },
      { id: 'react-native-expo', name: 'React Native · Expo', projects: ['ecobike'] },
      { id: 'tailwind-css', name: 'Tailwind CSS', projects: ['steady', 'siesa'] },
    ],
  },
  {
    id: 'data',
    items: [
      { id: 'supabase', name: 'Supabase', projects: ['steady', 'andino'] },
      { id: 'postgresql', name: 'PostgreSQL', projects: ['steady', 'andino'] },
      { id: 'firebase', name: 'Firebase', projects: ['ecobike'] },
      { id: 'wordpress-php', name: 'WordPress · PHP', projects: ['narinohoy'] },
      { id: 'rest-apis', name: 'REST APIs', projects: ['ecobike', 'cognitios'] },
    ],
  },
  {
    id: 'cloud',
    items: [
      { id: 'vercel', name: 'Vercel', projects: ['steady', 'siesa', 'ecobike'] },
      { id: 'cloudflare', name: 'Cloudflare', projects: ['narinohoy', 'steady'] },
      { id: 'github', name: 'GitHub', projects: ['steady', 'siesa', 'andino', 'ecobike'] },
      { id: 'azure-devops', name: 'Azure DevOps', projects: ['andino', 'ecobike'] },
      { id: 'gitlab', name: 'GitLab', projects: ['cognitios'] },
      { id: 'scrum', name: 'Scrum', projects: ['andino', 'ecobike'] },
    ],
  },
  {
    id: 'quality',
    items: [
      { id: 'vitest', name: 'Vitest', projects: ['steady', 'siesa'] },
      { id: 'react-testing-library', name: 'React Testing Library', projects: ['steady'] },
      { id: 'jasmine-karma', name: 'Jasmine · Karma', projects: ['andino'] },
      { id: 'playwright', name: 'Playwright', projects: ['steady', 'ecobike'] },
      { id: 'smoke-tests', name: 'Smoke tests', projects: ['narinohoy'] },
      { id: 'postman-insomnia', name: 'Postman · Insomnia', projects: ['cognitios'] },
    ],
  },
  {
    id: 'security',
    items: [
      { id: 'rbac', name: 'RBAC', projects: ['narinohoy', 'ecobike'] },
      { id: 'row-level-security', name: 'Row Level Security', projects: ['steady'] },
      { id: 'token-verification', name: 'Token verification', projects: ['ecobike'] },
      { id: 'audit-logs', name: 'Audit logs', projects: ['narinohoy', 'ecobike'] },
      { id: 'backups-rollback', name: 'Backups · rollback', projects: ['narinohoy'] },
    ],
  },
  {
    id: 'ai',
    items: [
      {
        id: 'bmad-method',
        name: 'BMAD Method',
        projects: ['narinohoy', 'steady', 'ecobike'],
      },
      {
        id: 'claude-code',
        name: 'Claude · Claude Code',
        projects: ['narinohoy', 'siesa', 'steady', 'ecobike'],
      },
      { id: 'github-copilot', name: 'GitHub Copilot', projects: ['narinohoy'] },
      { id: 'gemini-api', name: 'Gemini API', projects: ['siesa'] },
    ],
  },
];

/**
 * The "Projects in this layer" tiles, in display order, with the short name shown on each tile
 * and in the item chips. Logos come from `projects.ts`, joined by `id`.
 */
export const stackProjects: readonly { id: ProjectId; name: string }[] = [
  { id: 'narinohoy', name: 'NariñoHoy' },
  { id: 'steady', name: 'Steady Guardians' },
  { id: 'ecobike', name: 'EcoBike' },
  { id: 'siesa', name: 'Siesa MES' },
  { id: 'andino', name: 'C. E. Andino' },
  { id: 'cognitios', name: 'Cognitios' },
];

/** The AI-assisted engineering section: its image, tool chips and pipeline phase ids. */
export const ai: {
  image: ImageMetadata;
  tools: readonly string[];
  phases: readonly string[];
} = {
  image: bmadImage,
  tools: ['BMAD Method', 'Claude', 'Claude Code', 'GitHub Copilot'],
  phases: ['analysis', 'planning', 'solutioning', 'implementation', 'quality-assurance'],
};
