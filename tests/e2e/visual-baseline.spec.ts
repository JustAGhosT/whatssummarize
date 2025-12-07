import { test, expect } from '@playwright/test';

// Define the critical flows to capture
const FLOWS = [
  { name: 'landing-page', path: '/' },
  { name: 'login', path: '/login' },
  // Note: These routes require auth bypass or mocking in a real setup
  { name: 'dashboard', path: '/dashboard' },
  { name: 'upload', path: '/dashboard?tab=upload' },
];

test.describe('Visual Regression Baseline', () => {

  // Setup before each test (e.g., set viewports)
  test.beforeEach(async ({ page }) => {
    // Standard Desktop Viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  for (const flow of FLOWS) {
    test(`snapshot: ${flow.name}`, async ({ page }) => {
      console.log(`Navigating to ${flow.path}...`);

      // Navigate to the page
      // In a real scenario, we might need to inject auth cookies here for protected routes
      await page.goto(flow.path, { waitUntil: 'networkidle' });

      // Take a full page screenshot
      // The naming convention '{name}-{platform}.png' is handled by Playwright
      await expect(page).toHaveScreenshot(`${flow.name}-desktop.png`, {
        fullPage: true,
        // Allow some tolerance for dynamic content (e.g. animations)
        maxDiffPixelRatio: 0.05
      });
    });

    test(`snapshot: ${flow.name} (mobile)`, async ({ page }) => {
       // Mobile Viewport (iPhone 12/13/14 approx)
       await page.setViewportSize({ width: 390, height: 844 });

       await page.goto(flow.path, { waitUntil: 'networkidle' });

       await expect(page).toHaveScreenshot(`${flow.name}-mobile.png`, {
         fullPage: true,
         maxDiffPixelRatio: 0.05
       });
    });
  }
});
