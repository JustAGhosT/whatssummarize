import { test } from '@playwright/test';

test('take screenshot of landing page', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'landing-page.png', fullPage: true });
});
