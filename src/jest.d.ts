/// <reference types="vitest" />
import '@testing-library/jest-dom';

declare module '@testing-library/jest-dom' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveStyle(style: Record<string, any>): R;
    toHaveTextContent(text: string | RegExp): R;
    toBeVisible(): R;
    toBeDisabled(): R;
    toHaveClass(...classNames: string[]): R;
    toHaveAttribute(attr: string, value?: any): R;
  }
} 