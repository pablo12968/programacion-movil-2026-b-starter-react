import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://localhost:5173', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: [
    { command: 'npm run server', url: 'http://localhost:3000/api/products', reuseExistingServer: false },
    { command: 'npm run dev -- --host localhost --strictPort', url: 'http://localhost:5173', reuseExistingServer: false },
  ],
});
