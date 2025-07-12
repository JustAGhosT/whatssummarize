import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Wait for the development server to be ready
  console.log('Waiting for development server to be ready...');
  
  try {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    console.log('Development server is ready!');
  } catch (error) {
    console.error('Failed to connect to development server:', error);
    throw new Error('Development server is not running. Please start it with "npm run dev"');
  }
  
  await browser.close();
}

export default globalSetup; 