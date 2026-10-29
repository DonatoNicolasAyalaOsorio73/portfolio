import { defineConfig, devices } from '@playwright/test';

/** `astro preview` serves the built `dist/` on this port; the smoke tests never use the dev server. */
const PORT = 4322;

export default defineConfig({
  testDir: 'tests',
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}/`,
    // Always a fresh preview of the current dist/, never a dev server or stale preview.
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
