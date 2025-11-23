import { expect, test } from '@playwright/test';
import { ensureServerIsRunning, waitForPageReady } from './helpers/test-utils';

test.describe('Landing Page Visual Structure', () => {
  test.beforeEach(async ({ page }) => {
    await ensureServerIsRunning(page);
  });

  test('hero section is present and visually prominent', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Hero section: main heading
    const heroHeading = await page.locator('h1');
    await expect(heroHeading).toBeVisible();
    const fontSize = await heroHeading.evaluate((el) => getComputedStyle(el).fontSize);
    expect(Number.parseFloat(fontSize)).toBeGreaterThanOrEqual(32); // Should be large

    // Hero section: description
    const heroDescription = await page.locator('p:has-text("AI-powered summaries")');
    await expect(heroDescription).toBeVisible();

    // Hero section: CTA buttons
    const getStarted = await page.locator('button:has-text("Get Started")');
    const signIn = await page.locator('button:has-text("Sign In")');
    await expect(getStarted).toBeVisible();
    await expect(signIn).toBeVisible();

    // Buttons should be visually grouped (close together)
    const getStartedBox = await getStarted.boundingBox();
    const signInBox = await signIn.boundingBox();
    expect(Math.abs(getStartedBox.y - signInBox.y)).toBeLessThan(40); // Same row or close
    expect(Math.abs(getStartedBox.x - signInBox.x)).toBeLessThan(300); // Not far apart
  });

  test('feature highlights are present and visually separated', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Feature headings
    const features = [
      'AI-Powered Summaries',
      'Stay Organized',
      'Save Time',
    ];
    for (const feature of features) {
      const heading = await page.locator(`h3:has-text("${feature}")`);
      await expect(heading).toBeVisible();
      // Should be visually distinct (bold or larger font)
      const fontWeight = await heading.evaluate((el) => getComputedStyle(el).fontWeight);
      expect(Number(fontWeight)).toBeGreaterThanOrEqual(500);
    }

    // Feature descriptions should be present
    const descriptions = [
      'Get concise summaries of your group chats with a single click.',
      'Keep track of important conversations without reading every message.',
      'Quickly catch up on what you\'ve missed in your busy group chats.',
    ];
    for (const desc of descriptions) {
      await expect(page.locator(`text=${desc}`)).toBeVisible();
    }

    // Features should be visually separated (vertical spacing)
    const firstFeature = await page.locator('h3:has-text("AI-Powered Summaries")');
    const secondFeature = await page.locator('h3:has-text("Stay Organized")');
    const firstBox = await firstFeature.boundingBox();
    const secondBox = await secondFeature.boundingBox();
    expect(secondBox.y - (firstBox.y + firstBox.height)).toBeGreaterThan(12); // At least 12px gap
  });

  test('vertical spacing between hero and features is sufficient', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Hero section bottom
    const heroDescription = await page.locator('p:has-text("AI-powered summaries")');
    const heroBox = await heroDescription.boundingBox();
    // First feature heading
    const firstFeature = await page.locator('h3:has-text("AI-Powered Summaries")');
    const featureBox = await firstFeature.boundingBox();
    expect(featureBox.y - (heroBox.y + heroBox.height)).toBeGreaterThan(24); // At least 24px gap
  });
}); 