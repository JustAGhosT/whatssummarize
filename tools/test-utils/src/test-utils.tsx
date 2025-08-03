import { render, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ReactElement } from 'react';

// Import our custom utilities and components
import { mockTheme } from './components';
import { mockRouter, useRouter } from './mocks';
import { testId, wait, nextTick, mockSuccessResponse, mockErrorResponse, mockFn, createMock } from './utils';

export * from './setup';
export * from './mocks';
export * from './utils';
export * from './components';

// Re-export common testing utilities
export { render, waitFor, screen, fireEvent, act } from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Export our custom test utilities
export {
  testId,
  wait,
  nextTick,
  mockSuccessResponse,
  mockErrorResponse,
  mockFn,
  createMock,
  mockRouter,
  useRouter,
};

/**
 * Custom render function that includes all necessary providers
 * @param ui - The component to render
 * @param options - Additional render options
 * @returns The render result with all providers
 */
const customRender = (
  ui: ReactElement,
  options = {}
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

// Override the default render with our custom one
export { customRender as render };

// Export a custom test setup function
export const setupTest = () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  return {
    // Add any test setup utilities here
  };
};

// Export a custom hook testing utility
export const renderHook = <T,>(
  hook: () => T,
  options = {}
): { result: { current: T } } & ReturnType<typeof render> => {
  let result: { current: T } | null = null;
  
  const TestComponent = ({
    hookCallback,
    onRender,
  }: {
    hookCallback: () => T;
    onRender: (result: { current: T }) => void;
  }) => {
    const hookResult = hookCallback();
    
    React.useEffect(() => {
      onRender({ current: hookResult });
    }, [hookResult]);
    
    return null;
  };
  
  const { rerender, ...rest } = render(
    <TestComponent
      hookCallback={hook}
      onRender={(res) => {
        result = res;
      }}
    />,
    options
  );
  
  return {
    result: result!,
    rerender: () => {
      rerender(
        <TestComponent
          hookCallback={hook}
          onRender={(res) => {
            result = res;
          }}
        />
      );
    },
    ...rest,
  };
};
