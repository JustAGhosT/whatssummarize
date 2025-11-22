import { expect, test } from '@playwright/test';

test('landing page container heights', async ({ page }) => {
  await page.goto('/');

  // BODY
  const body = await page.locator('body');
  const bodyBox = await body.boundingBox();
  console.log('BODY HEIGHT:', bodyBox?.height);

  // .page-container
  const pageContainer = await page.locator('div.page-container');
  const pageContainerBox = await pageContainer.boundingBox();
  console.log('PAGE CONTAINER HEIGHT:', pageContainerBox?.height);

  // .relative.z-10.flex.min-h-screen.flex-col
  const relFlex = await page.locator('div.relative.z-10.flex.min-h-screen.flex-col');
  const relFlexBox = await relFlex.boundingBox();
  console.log('RELATIVE FLEX HEIGHT:', relFlexBox?.height);

  // <main>
  const main = await page.locator('main');
  const mainBox = await main.boundingBox();
  console.log('MAIN HEIGHT:', mainBox?.height);

  // LandingPage root
  const landingRoot = await page.locator('div.flex-1.flex.flex-col.relative.overflow-hidden.bg-gradient-to-b');
  const landingRootBox = await landingRoot.boundingBox();
  console.log('LANDING ROOT HEIGHT:', landingRootBox?.height);

  // INNER WRAPPER
  const inner = await page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
  await inner.waitFor();
  const innerBox = await inner.boundingBox();
  console.log('INNER HEIGHT:', innerBox?.height);

  // CONTENT HEIGHT
  const content = await page.locator('section.w-full.max-w-2xl.text-center.mb-12.mt-8');
  const contentBox = await content.boundingBox();
  console.log('CONTENT HEIGHT:', contentBox?.height);

  // VIEWPORT
  const viewport = page.viewportSize();
  console.log('VIEWPORT HEIGHT:', viewport?.height);

  // Assert that the inner wrapper fills at least 95% of the viewport
  // This accounts for browser chrome, scrollbars, and other UI elements
  expect(innerBox?.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) * 0.95);
});

test('landing page displays correctly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the main heading is visible and centered
  const heading = await page.locator('h1:has-text("Summarize Your WhatsApp Chats")');
  await expect(heading).toBeVisible();
  
  // Check that the description is visible
  const description = await page.locator('p:has-text("Get AI-powered summaries")');
  await expect(description).toBeVisible();
  
  // Check that the CTA buttons are visible
  const loginButton = await page.locator('button:has-text("Sign In")');
  const signupButton = await page.locator('button:has-text("Get Started")');
  await expect(loginButton).toBeVisible();
  await expect(signupButton).toBeVisible();
  
  // Check that the version badge is visible
  const versionBadge = await page.locator('.version-badge');
  await expect(versionBadge).toBeVisible();
  
  // Check that the content is vertically centered
  const innerWrapper = await page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
  const innerBox = await innerWrapper.boundingBox();
  const viewport = page.viewportSize();
  
  // The inner wrapper should be at least 95% of viewport height
  expect(innerBox?.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) * 0.95);
  
  // Check that the content is horizontally centered
  const content = await page.locator('section.w-full.max-w-2xl.text-center.mb-12.mt-8');
  const contentBox = await content.boundingBox();
  const innerBox2 = await innerWrapper.boundingBox();
  
  if (contentBox && innerBox2) {
    // Content should be centered horizontally (with some tolerance)
    const contentCenterX = contentBox.x + contentBox.width / 2;
    const wrapperCenterX = innerBox2.x + innerBox2.width / 2;
    const horizontalOffset = Math.abs(contentCenterX - wrapperCenterX);
    expect(horizontalOffset).toBeLessThan(10); // Within 10px of center
  }
}); 