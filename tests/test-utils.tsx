import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
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

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={mockTheme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

export const mockNavigate = jest.fn();

export const mockUseNavigate = () => mockNavigate;

export const mockUseLocation = () => ({
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'test',
});
