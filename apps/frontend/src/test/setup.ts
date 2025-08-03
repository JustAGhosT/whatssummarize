// Testing Library and Jest DOM setup
import '@testing-library/jest-dom/vitest';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, vi, beforeAll, afterAll } from 'vitest';
import { fetch } from 'cross-fetch';
import { server } from './mocks/server';

// Add fetch polyfill for Node.js
// @ts-ignore
global.fetch = fetch;

// Mock global objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(window as any).ResizeObserver = ResizeObserverStub;

// Start the mock server before all tests
beforeAll(() => {
  // Start the mock server
  server.listen({
    onUnhandledRequest: 'warn',
  });

  // Mock console methods during tests
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Reset any request handlers that we may add during the tests
// so they don't affect other tests
afterEach(() => {
  // Clean up the testing environment
  cleanup();
  // Reset any request handlers that we may add during the tests
  server.resetHandlers();
  // Clear all mocks between tests
  vi.clearAllMocks();
});

// Clean up after the tests are finished
afterAll(() => {
  // Clean up the server
  server.close();
  // Restore console methods
  vi.restoreAllMocks();
});

// Helper function to log test information
const originalError = console.error;
beforeEach(() => {
  console.error = (...args) => {
    // Suppress specific error messages if needed
    if (args[0]?.includes('ReactDOM.render is no longer supported')) {
      return;
    }
    originalError(...args);
  };
});

afterEach(() => {
  console.error = originalError;
});

// Utility function to wait for loading states
const waitForLoadingToFinish = async () => {
  // Wait for any pending promises to resolve
  await new Promise((resolve) => setTimeout(resolve, 0));
  
  // Wait for loading spinners to disappear
  const loadingElements = await screen.queryAllByRole('progressbar');
  if (loadingElements.length > 0) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};

// Make the utility function available globally
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      waitForLoadingToFinish: () => Promise<void>;
    }
  }
}

global.waitForLoadingToFinish = waitForLoadingToFinish;
