import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';
import React from 'react';
import { afterEach, beforeAll, afterAll } from '@jest/globals';

// Start the mock server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that we may add during the tests
// so they don't affect other tests
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
// Empty methods are intentional - this is a minimal mock for testing environments
// that don't support ResizeObserver. The methods do nothing because tests don't
// need actual resize observation functionality.
class ResizeObserver {
  observe() {} // NOSONAR - intentionally empty mock
  unobserve() {} // NOSONAR - intentionally empty mock
  disconnect() {} // NOSONAR - intentionally empty mock
}

window.ResizeObserver = ResizeObserver;

// Mock scrollTo
window.scrollTo = jest.fn();

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

// Set up MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    data: { user: { name: 'Test User', email: 'test@example.com' } },
    status: 'authenticated',
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => mockSession),
  };
});

// Mock next/head
import MockHead from './mocks/MockHead';

jest.mock('next/head', () => ({
  __esModule: true,
  default: MockHead,
}));
