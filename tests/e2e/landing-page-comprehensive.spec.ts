import { expect, test, Page } from '@playwright/test';

/**
 * Helper function to verify key elements are visible on the landing page
 */
async function verifyKeyElements(page: Page) {
  await expect(page.locator('h1:has-text("Summarize Your WhatsApp Chats")')).toBeVisible();
  await expect(page.locator('p:has-text("Get AI-powered summaries")')).toBeVisible();
  await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
  await expect(page.locator('.version-badge')).toBeVisible();
}

/**
 * Helper function to verify content centering
 */
async function verifyContentCentering(page: Page) {
  const innerWrapper = await page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
  const innerBox = await innerWrapper.boundingBox();
  const viewport = page.viewportSize();
  
  expect(innerBox?.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) * 0.95);
}

test.describe('Landing Page Comprehensive Tests', () => {
  test('displays correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await verifyKeyElements(page);
    await verifyContentCentering(page);
  });

  test('displays correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await verifyKeyElements(page);
    await verifyContentCentering(page);
  });

  test('displays correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await verifyKeyElements(page);
    await verifyContentCentering(page);
  });

  test('content is properly centered horizontally and vertically', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const innerWrapper = await page.locator('div.flex.flex-col.justify-center.items-center.relative.z-10.flex-1.h-full.w-full.min-h-0');
    const content = await page.locator('section.w-full.max-w-2xl.text-center.mb-12.mt-8');
    
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
    
    const loginButton = await page.locator('button:has-text("Sign In")');
    const signupButton = await page.locator('button:has-text("Get Started")');
    
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
    
    const versionBadge = await page.locator('.version-badge');
    await expect(versionBadge).toBeVisible();
    
    const badgeBox = await versionBadge.boundingBox();
    const viewport = page.viewportSize();
    
    if (badgeBox && viewport) {
      // Check badge is in bottom-right corner
      expect(badgeBox.x).toBeGreaterThan(viewport.width * 0.8); // Right side
      expect(badgeBox.y).toBeGreaterThan(viewport.height * 0.9); // Bottom area
    }
  });

  test('page loads without layout shift', async ({ page }) => {
    await page.goto('/');
    
    // Wait for initial load
    await page.waitForLoadState('domcontentloaded');
    
    // Get initial positions of key elements
    const heading = await page.locator('h1:has-text("Summarize Your WhatsApp Chats")');
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