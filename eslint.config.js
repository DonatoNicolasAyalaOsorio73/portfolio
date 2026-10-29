// @ts-check
import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

/**
 * The layer table of the architecture spine, as the layers each directory may NOT
 * import. Sections and components may reach `scripts` because they load them with
 * a `<script>` tag.
 * @type {Record<string, string[]>}
 */
const FORBIDDEN_IMPORTS = {
  pages: ['layouts', 'sections', 'components', 'data', 'i18n', 'scripts', 'styles', 'assets'],
  views: ['pages', 'components', 'data', 'scripts', 'styles', 'assets'],
  layouts: ['pages', 'views', 'sections', 'data', 'scripts', 'assets'],
  sections: ['pages', 'views', 'layouts', 'styles'],
  components: ['pages', 'views', 'layouts', 'sections', 'styles'],
  data: ['pages', 'views', 'layouts', 'sections', 'components', 'i18n', 'scripts', 'styles'],
  i18n: [
    'pages',
    'views',
    'layouts',
    'sections',
    'components',
    'data',
    'scripts',
    'styles',
    'assets',
  ],
  scripts: [
    'pages',
    'views',
    'layouts',
    'sections',
    'components',
    'data',
    'i18n',
    'styles',
    'assets',
  ],
};

export default defineConfig(
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      // Playwright results and local parity captures.
      'parity/',
      'test-results/',
      'playwright-report/',
      // Legacy site, removed at the end of epic 1.
      'support.js',
      'assets/',
      // Planning and agent tooling.
      '_bmad/',
      '_bmad-output/',
      '.claude/',
      '.agents/',
      '.impeccable/',
    ],
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  Object.entries(FORBIDDEN_IMPORTS).map(([dir, forbidden]) => ({
    files: [`src/${dir}/**`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          // Matches relative specifiers that reach into a layer, e.g. `../views/HomeView.astro`.
          patterns: forbidden.map((name) => ({
            group: [`**/${name}`, `**/${name}/**`],
            message: `The spine's layer table does not allow ${dir} to import ${name}.`,
          })),
        },
      ],
    },
  })),
);
