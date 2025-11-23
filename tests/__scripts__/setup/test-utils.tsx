import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AppProviders } from './providers';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AppProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Re-export userEvent with delay
import userEvent from '@testing-library/user-event';
export { userEvent };
