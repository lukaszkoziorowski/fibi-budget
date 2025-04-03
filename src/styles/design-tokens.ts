// Core Tokens - Podstawowe wartości kolorów
export const coreTokens = {
  colors: {
    // Kolory podstawowe
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    // Kolory akcentów
    accent: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    // Kolory stanów
    state: {
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    // Kolory neutralne
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
  // Inne podstawowe tokeny
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '1rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
} as const;

// Semantic Tokens - Znaczenia wizualne
export const semanticTokens = {
  colors: {
    // Powierzchnie
    surface: {
      primary: coreTokens.colors.neutral[50],
      secondary: coreTokens.colors.neutral[100],
      tertiary: coreTokens.colors.neutral[200],
      inverse: coreTokens.colors.neutral[900],
    },
    // Tekst
    text: {
      primary: coreTokens.colors.neutral[900],
      secondary: coreTokens.colors.neutral[700],
      tertiary: coreTokens.colors.neutral[500],
      inverse: coreTokens.colors.neutral[50],
      disabled: coreTokens.colors.neutral[400],
    },
    // Interakcje
    interactive: {
      primary: coreTokens.colors.primary[600],
      secondary: coreTokens.colors.primary[500],
      hover: coreTokens.colors.primary[700],
      active: coreTokens.colors.primary[800],
      disabled: coreTokens.colors.neutral[300],
    },
    // Stany
    status: {
      success: coreTokens.colors.state.success,
      warning: coreTokens.colors.state.warning,
      error: coreTokens.colors.state.error,
      info: coreTokens.colors.state.info,
    },
    // Obramowania
    border: {
      default: coreTokens.colors.neutral[200],
      focus: coreTokens.colors.primary[500],
      error: coreTokens.colors.state.error,
    },
  },
} as const;

// Component Tokens - Tokeny dla konkretnych komponentów
export const componentTokens = {
  button: {
    primary: {
      background: semanticTokens.colors.interactive.primary,
      text: semanticTokens.colors.text.inverse,
      hover: semanticTokens.colors.interactive.hover,
      active: semanticTokens.colors.interactive.active,
      disabled: semanticTokens.colors.interactive.disabled,
      borderRadius: coreTokens.borderRadius.md,
      padding: `${coreTokens.spacing.sm} ${coreTokens.spacing.md}`,
    },
    secondary: {
      background: semanticTokens.colors.surface.secondary,
      text: semanticTokens.colors.text.primary,
      hover: semanticTokens.colors.surface.tertiary,
      active: semanticTokens.colors.surface.tertiary,
      disabled: semanticTokens.colors.interactive.disabled,
      borderRadius: coreTokens.borderRadius.md,
      padding: `${coreTokens.spacing.sm} ${coreTokens.spacing.md}`,
    },
  },
  input: {
    default: {
      background: semanticTokens.colors.surface.primary,
      text: semanticTokens.colors.text.primary,
      border: semanticTokens.colors.border.default,
      focus: semanticTokens.colors.border.focus,
      error: semanticTokens.colors.border.error,
      borderRadius: coreTokens.borderRadius.md,
      padding: coreTokens.spacing.sm,
    },
  },
  dropdown: {
    default: {
      background: semanticTokens.colors.surface.primary,
      text: semanticTokens.colors.text.primary,
      border: semanticTokens.colors.border.default,
      hover: semanticTokens.colors.surface.secondary,
      active: semanticTokens.colors.surface.tertiary,
      borderRadius: coreTokens.borderRadius.md,
      padding: coreTokens.spacing.sm,
    },
  },
  card: {
    default: {
      background: semanticTokens.colors.surface.primary,
      border: semanticTokens.colors.border.default,
      borderRadius: coreTokens.borderRadius.lg,
      padding: coreTokens.spacing.lg,
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
  },
} as const;

// Typy TypeScript dla lepszej obsługi tokenów
export type CoreTokens = typeof coreTokens;
export type SemanticTokens = typeof semanticTokens;
export type ComponentTokens = typeof componentTokens;

// Funkcja pomocnicza do generowania CSS zmiennych
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {};

  // Core tokens
  Object.entries(coreTokens.colors).forEach(([category, values]) => {
    Object.entries(values).forEach(([shade, value]) => {
      variables[`--color-${category}-${shade}`] = value as string;
    });
  });

  // Semantic tokens
  Object.entries(semanticTokens.colors).forEach(([category, values]) => {
    Object.entries(values).forEach(([shade, value]) => {
      variables[`--color-${category}-${shade}`] = value as string;
    });
  });

  // Component tokens
  Object.entries(componentTokens).forEach(([component, variants]) => {
    Object.entries(variants).forEach(([variant, properties]) => {
      Object.entries(properties).forEach(([property, value]) => {
        variables[`--${component}-${variant}-${property}`] = value as string;
      });
    });
  });

  return variables;
}; 