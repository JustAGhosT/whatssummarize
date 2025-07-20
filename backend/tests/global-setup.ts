import { setupTestDatabase } from './test-utils/database';

export default async () => {
  // Set up test database
  await setupTestDatabase();
  
  // Set any global test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_PATH = ':memory:';
  process.env.JWT_SECRET = 'test-secret';
  process.env.REDIS_URL = 'redis://localhost:6379';
  
  console.log('Global test setup complete');
};
