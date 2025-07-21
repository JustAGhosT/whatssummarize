import { test, expect } from '@playwright/test';
import { createTestUser, deleteTestUser } from '../__scripts__/utils/auth';

test.describe('Chat Functionality', () => {
  let testUser: { email: string; password: string };

  test.beforeAll(async () => {
    // Create a test user
    testUser = await createTestUser();
  });

  test.afterAll(async () => {
    // Clean up test user
    await deleteTestUser(testUser.email);
  });

  test('should allow sending and receiving messages', async ({ page }) => {
    // Navigate to the chat page
    await page.goto('/chat');
    
    // Log in if not already authenticated
    if (await page.isVisible('text=Sign In')) {
      await page.click('text=Sign In');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/chat');
    }

    // Wait for chat to load
    await page.waitForSelector('[data-testid="chat-container"]');
    
    // Send a message
    const testMessage = 'Hello, this is a test message' + Date.now();
    await page.fill('[data-testid="message-input"]', testMessage);
    await page.click('[data-testid="send-button"]');
    
    // Verify the message appears in the chat
    await expect(page.getByText(testMessage)).toBeVisible();
    
    // Verify the message is saved by refreshing the page
    await page.reload();
    await page.waitForSelector('[data-testid="chat-container"]');
    await expect(page.getByText(testMessage)).toBeVisible();
  });

  test('should display message timestamps correctly', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForSelector('[data-testid="chat-container"]');
    
    // Check if timestamps are displayed in the expected format
    const timestamp = await page.locator('[data-testid^="message-timestamp"]').first().textContent();
    expect(timestamp).toMatch(/^(\d{1,2}:\d{2} [AP]M|Today|Yesterday|\w+ \d{1,2}, \d{4})$/);
  });

  test('should handle long messages with proper formatting', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForSelector('[data-testid="chat-container"]');
    
    const longMessage = 'This is a very long message '.repeat(50); // ~1000 characters
    await page.fill('[data-testid="message-input"]', longMessage);
    await page.click('[data-testid="send-button"]');
    
    // Verify the message is displayed with proper line breaks
    const messageElement = page.locator(`text=${longMessage.substring(0, 50)}`).first();
    await expect(messageElement).toBeVisible();
    
    // Check that the message container has proper styling for long messages
    const messageContainer = messageElement.locator('xpath=./ancestor::div[contains(@class, "message-container")]');
    await expect(messageContainer).toHaveCSS('word-break', 'break-word');
  });
});
