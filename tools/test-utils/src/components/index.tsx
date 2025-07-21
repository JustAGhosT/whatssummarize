import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

// Mock theme for testing
const mockTheme = {
  colors: {
    primary: '#0070f3',
    secondary: '#1a1a1a',
    text: '#333',
    background: '#fff',
    error: '#ff0000',
    success: '#00aa00',
    warning: '#ffcc00',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
  },
  breakpoints: {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
  },
};

/**
 * Custom render function that includes all necessary providers
 * @param ui - The component to render
 * @param options - Additional render options
 * @returns The render result with all providers
 */
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
): RenderResult => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={mockTheme}>
        {children}
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Override the render method with our custom one
export { customRender as render };

/**
 * Test wrapper component that provides all necessary providers
 * @param children - Child components to wrap
 * @returns A wrapper component with all providers
 */
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider theme={mockTheme}>
    {children}
  </ThemeProvider>
);

/**
 * Mock component for testing error boundaries
 */
export const ErrorBoundaryTestComponent = () => {
  throw new Error('Test Error Boundary');
};

/**
 * Mock component for testing loading states
 */
export const LoadingTestComponent = () => (
  <div data-testid="loading">Loading...</div>
);

/**
 * Mock component for testing empty states
 */
export const EmptyStateTestComponent = () => (
  <div data-testid="empty-state">No data available</div>
);
