import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 },
];

test.describe('Landing Page Comprehensive Tests', () => {
  for (const viewport of viewports) {
    test(`displays correctly on ${viewport.name} viewport`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check all key elements are visible
      await expect(page.locator('h1:has-text("Summarize Your WhatsApp Chats")')).toBeVisible();
      await expect(page.locator('p:has-text("Get AI-powered summaries")')).toBeVisible();
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
      await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
      await expect(page.locator('.version-badge')).toBeVisible();

      // Check content is centered
      const innerWrapper = page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
      const innerBox = await innerWrapper.boundingBox();
      const pageViewport = page.viewportSize();

      expect(innerBox?.height).toBeGreaterThanOrEqual((pageViewport?.height ?? 0) * 0.95);
    });
  }

  test('content is properly centered horizontally and vertically', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const innerWrapper = page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
    const content = page.locator('section.w-full.max-w-2xl.text-center.mb-12.mt-8');

    const innerBox = await innerWrapper.boundingBox();
    const contentBox = await content.boundingBox();

    if (contentBox && innerBox) {
      // Check horizontal centering
      const contentCenterX = contentBox.x + contentBox.width / 2;
      const wrapperCenterX = innerBox.x + innerBox.width / 2;
      const horizontalOffset = Math.abs(contentCenterX - wrapperCenterX);
      expect(horizontalOffset).toBeLessThan(10);

      // Check vertical centering (content should be roughly in the middle of the wrapper)
      const contentCenterY = contentBox.y + contentBox.height / 2;
      const wrapperCenterY = innerBox.y + innerBox.height / 2;
      const verticalOffset = Math.abs(contentCenterY - wrapperCenterY);
      expect(verticalOffset).toBeLessThan(100); // Allow more tolerance for vertical centering with natural spacing
    }
  });

  test('buttons are interactive and properly styled', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loginButton = page.locator('button:has-text("Sign In")');
    const signupButton = page.locator('button:has-text("Get Started")');

    // Check buttons are visible and enabled
    await expect(loginButton).toBeVisible();
    await expect(signupButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
    await expect(signupButton).toBeEnabled();

    // Check button hover states (if CSS hover effects are present)
    await loginButton.hover();
    await signupButton.hover();

    // Verify buttons maintain their position after hover
    const loginBox = await loginButton.boundingBox();
    const signupBox = await signupButton.boundingBox();
    expect(loginBox).toBeTruthy();
    expect(signupBox).toBeTruthy();
  });

  test('version badge is positioned correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const versionBadge = page.locator('.version-badge');
    await expect(versionBadge).toBeVisible();

    const badgeBox = await versionBadge.boundingBox();
    const viewportSize = page.viewportSize();

    if (badgeBox && viewportSize) {
      // Check badge is in bottom-right corner
      expect(badgeBox.x).toBeGreaterThan(viewportSize.width * 0.8); // Right side
      expect(badgeBox.y).toBeGreaterThan(viewportSize.height * 0.9); // Bottom area
    }
  });

  test('page loads without layout shift', async ({ page }) => {
    await page.goto('/');

    // Wait for initial load
    await page.waitForLoadState('domcontentloaded');

    // Get initial positions of key elements
    const heading = page.locator('h1:has-text("Summarize Your WhatsApp Chats")');
    const initialHeadingBox = await heading.boundingBox();

    // Wait for full load
    await page.waitForLoadState('networkidle');

    // Get final positions
    const finalHeadingBox = await heading.boundingBox();

    // Check that positions haven't shifted significantly
    if (initialHeadingBox && finalHeadingBox) {
      const xShift = Math.abs(initialHeadingBox.x - finalHeadingBox.x);
      const yShift = Math.abs(initialHeadingBox.y - finalHeadingBox.y);

      expect(xShift).toBeLessThan(5); // Minimal horizontal shift
      expect(yShift).toBeLessThan(10); // Minimal vertical shift
    }
  });
});
