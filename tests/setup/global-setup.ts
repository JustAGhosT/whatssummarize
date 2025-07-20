import { FullConfig } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  console.log(`Running global setup with baseURL: ${baseURL}`);
  
  // Create .reassure directory if it doesn't exist
  const dir = join(__dirname, '../../.reassure');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  console.log('Global setup completed');
}

export default globalSetup;
