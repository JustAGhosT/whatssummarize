import { afterEach, vi } from 'vitest';

// Clean up after each test case
afterEach(() => {
  // Clear all mocks after each test
  vi.clearAllMocks();
  
  // Reset any custom mocks
  vi.resetAllMocks();
});

// Set a longer timeout for tests (10 seconds)
vi.setConfig({ testTimeout: 10000 });
