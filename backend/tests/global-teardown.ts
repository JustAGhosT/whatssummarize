import { teardownTestDatabase } from './test-utils/database';

export default async () => {
  // Clean up test database
  await teardownTestDatabase();
  
  // Close any open connections
  // Add any other cleanup code here
  
  console.log('Global test teardown complete');
};
