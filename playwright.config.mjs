import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/smoke',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    browserName: 'chromium',
    baseURL: process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  webServer: process.env.SMOKE_BASE_URL ? undefined : {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
  },
});
