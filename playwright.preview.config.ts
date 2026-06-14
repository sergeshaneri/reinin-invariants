import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e-production',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'vite preview --configLoader runner --host=127.0.0.1 --port=4173 --strictPort',
    url: 'http://127.0.0.1:4173/reinin-invariants/',
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'chromium-production',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
});
