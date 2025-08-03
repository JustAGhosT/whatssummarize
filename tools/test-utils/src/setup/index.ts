import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure test-id attribute for testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Re-export test utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export custom test utilities
export * from '../test-utils';
