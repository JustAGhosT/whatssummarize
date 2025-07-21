import { Page } from '@playwright/test';

export const waitForPageLoad = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Additional delay to ensure all components are rendered
};

export const getElement = async (page: Page, selector: string) => {
  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
};
