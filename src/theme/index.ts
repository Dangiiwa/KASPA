import { createTheme, type Theme } from '@mui/material/styles';

// Professional Government Palette
export const aetherColors = {
  // Primary colors
  primary: '#1e293b',          // Deep slate blue (professional)
  secondary: '#f8fafc',        // Off-white background
  accent: '#059669',           // Muted forest green for agriculture
  gold: '#d97706',            // Muted amber accent
  
  // Status colors
  success: '#059669',         // Muted green success
  warning: '#d97706',         // Muted amber warning  
  error: '#dc2626',           // Professional red error
  info: '#0f766e',            // Teal info
  
  // Professional neutral colors
  grey: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Dark theme colors
  dark: {
    background: '#1a1a1a',     // Main background
    surface: '#2a2a2a',        // Card background
    surfaceVariant: '#333333', // Elevated surface
    border: '#444444',         // Border color
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    }
  },
  
  // Glass morphism effects
  glass: {
    light: 'rgba(232, 221, 181, 0.5)',
    dark: 'rgba(255, 255, 255, 0.05)',
    darkHeavy: 'rgba(30, 30, 30, 0.5)',
  },
  
  // Status indicators
  status: {
    bestMatch: '#4caf50',
    goodMatch: '#8bc34a', 
    lowMatch: '#ff9800',
    badMatch: '#f44336',
    critical: '#d32f2f',
  }
};

// Professional Typography
export const typography = {
  fontFamily: [
    '"Inter"',
    '-apple-system',
    '"BlinkMacSystemFont"',
    '"Segoe UI"',
    '"Roboto"',
    '"Helvetica Neue"',
    '"Arial"',
    'sans-serif'
  ].join(','),
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  fontWeightExtraBold: 800,
  fontWeightBlack: 900,
};

// Spacing system (following AetherView pattern)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius system
export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
  round: '50%',
};

// Create the main theme (Light mode only)
export const createAetherTheme = (): Theme => {
  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: aetherColors.primary,
        light: '#334155',
        dark: '#0f172a',
        contrastText: '#ffffff',
      },
      secondary: {
        main: aetherColors.secondary,
        light: '#ffffff',
        dark: '#f1f5f9',
        contrastText: '#1e293b',
      },
      success: {
        main: aetherColors.success,
        light: '#10b981',
        dark: '#047857',
      },
      warning: {
        main: aetherColors.warning,
        light: '#f59e0b',
        dark: '#b45309',
      },
      error: {
        main: aetherColors.error,
        light: '#ef4444',
        dark: '#b91c1c',
      },
      info: {
        main: aetherColors.info,
        light: '#14b8a6',
        dark: '#0d9488',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        disabled: '#94a3b8',
      },
      divider: '#e2e8f0',
      grey: aetherColors.grey,
    },
    typography: {
      fontFamily: typography.fontFamily,
      fontWeightLight: typography.fontWeightLight,
      fontWeightRegular: typography.fontWeightRegular,
      fontWeightMedium: typography.fontWeightMedium,
      fontWeightBold: typography.fontWeightBold,
      h1: {
        fontSize: '2.5rem',
        fontWeight: typography.fontWeightBold,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: typography.fontWeightBold,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: typography.fontWeightSemiBold,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: typography.fontWeightSemiBold,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: typography.fontWeightMedium,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: typography.fontWeightMedium,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.5,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
      },
    },
    spacing: (factor: number) => `${spacing.xs * factor}px`,
    shape: {
      borderRadius: borderRadius.md,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ':root': {
            // Professional Government Theme Variables
            '--color-primary': aetherColors.primary,
            '--color-secondary': aetherColors.secondary,
            '--color-accent': aetherColors.accent,
            '--color-gold': aetherColors.gold,
            '--color-success': aetherColors.success,
            '--color-warning': aetherColors.warning,
            '--color-error': aetherColors.error,
            '--color-background': '#f8fafc',
            '--color-surface': '#ffffff',
            '--color-border': '#e2e8f0',
            '--color-text-primary': '#0f172a',
            '--color-text-secondary': '#475569',
            '--glass-light': 'rgba(255, 255, 255, 0.8)',
            '--glass-dark': 'rgba(255, 255, 255, 0.05)',
            '--glass-dark-heavy': 'rgba(30, 30, 30, 0.5)',
          },
          body: {
            backgroundColor: '#f8fafc',
            color: '#0f172a',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            fontFamily: typography.fontFamily,
          },
          '*': {
            boxSizing: 'border-box',
          },
          // Glass morphism utility class
          '.glass-morphism': {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
          },
          // Status utility classes
          '.status-best-match': { color: aetherColors.status.bestMatch },
          '.status-good-match': { color: aetherColors.status.goodMatch },
          '.status-low-match': { color: aetherColors.status.lowMatch },
          '.status-bad-match': { color: aetherColors.status.badMatch },
          '.status-critical': { color: aetherColors.status.critical },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: borderRadius.sm,
            transition: 'all 200ms ease-in-out',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.md,
            minHeight: 45,
            fontWeight: typography.fontWeightMedium,
            textTransform: 'none',
            transition: 'all 0.3s ease',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  });
};

// Default theme (light mode only)
export const theme = createAetherTheme();

// Export theme utilities
export { aetherColors as colors };
export default theme;