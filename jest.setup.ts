// Add any global test setup here
import { jest } from '@jest/globals';
import 'cross-fetch/polyfill';
import React from 'react';
import '@testing-library/jest-dom';

// Ensure fetch and Response are available globally
if (typeof globalThis.fetch === 'undefined' || typeof globalThis.Response === 'undefined') {
  const { fetch, Response } = require('node-fetch');
  globalThis.fetch = fetch;
  globalThis.Response = Response;
}

// Add type definitions for Jest
type JestMockFn = {
  (...args: any[]): any;
  mockImplementation: (fn: (...args: any[]) => any) => JestMockFn;
  mockReturnValue: (value: any) => JestMockFn;
};

// Extend the Window interface to include our mocks
declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }

  namespace NodeJS {
    interface Global {
      jest: typeof jest;
    }
  }
}

// Ensure fetch is available globally
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      Response: typeof Response;
      fetch: typeof fetch;
    }
  }
}

// Mock fetch for testing
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockFetch;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock window.scrollTo
window.scrollTo = jest.fn() as unknown as typeof window.scrollTo;

// Mock IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
};

const mockSearchParams = {
  get: jest.fn(),
  set: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
  usePathname: () => '',
  useParams: () => ({}),
}));

// Mock next-auth
const mockUseSession = jest.fn(() => ({
  data: { user: { name: 'Test User', email: 'test@example.com' } },
  status: 'authenticated',
}));

// Mock next-auth/react
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockGetSession = jest.fn();
const mockGetCsrfToken = jest.fn();
const mockGetProviders = jest.fn();

jest.mock('next-auth/react', () => ({
  __esModule: true,
  signIn: mockSignIn,
  signOut: mockSignOut,
  useSession: mockUseSession,
  getSession: mockGetSession,
  getCsrfToken: mockGetCsrfToken,
  getProviders: mockGetProviders,
  SessionProvider: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', {}, children);
  },
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

// Add cleanup after each test
afterEach(() => {
  jest.clearAllMocks();
});
