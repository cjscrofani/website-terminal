import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
};

export const mockPathname = '/';

// Custom render function that provides necessary context
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
