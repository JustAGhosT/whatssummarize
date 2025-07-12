import { Page, expect } from '@playwright/test';

export async function waitForPageReady(page: Page) {
  // Wait for the page to be fully loaded
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Wait for any animations to complete
  await page.waitForTimeout(1000);
}

export async function ensureServerIsRunning(page: Page) {
  try {
    await page.goto('/');
    await waitForPageReady(page);
  } catch (error) {
    throw new Error('Development server is not running. Please start it with "npm run dev"');
  }
}

export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { timeout });
}

export async function expectElementToBeVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

export async function getElementBoundingBox(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return await element.boundingBox();
} 