import { createTheme, type Theme } from '@mui/material/styles';

// AetherView Color Palette
export const aetherColors = {
  // Primary colors
  primary: '#004408',          // Deep forest green
  secondary: '#E8DDB5',        // Warm cream
  accent: '#3abe66',           // Bright green
  gold: '#b99d34',            // Gold accent
  
  // Status colors
  success: '#4caf50',         // Green success
  warning: '#ff9800',         // Orange warning  
  error: '#f44336',           // Red error
  info: '#2196f3',            // Blue info
  
  // Neutral colors
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
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

// Typography scale
export const typography = {
  fontFamily: [
    '"Helvetica Now Display"',
    '"Roboto"',
    '"Helvetica"',
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

// Create the main theme
export const createAetherTheme = (mode: 'light' | 'dark' = 'dark'): Theme => {
  const isDark = mode === 'dark';
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: aetherColors.primary,
        light: '#2e7d32',
        dark: '#001a02',
        contrastText: '#ffffff',
      },
      secondary: {
        main: aetherColors.secondary,
        light: '#f5f0d6',
        dark: '#d4c79a',
        contrastText: aetherColors.primary,
      },
      success: {
        main: aetherColors.success,
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: aetherColors.warning,
        light: '#ffb74d',
        dark: '#f57c00',
      },
      error: {
        main: aetherColors.error,
        light: '#e57373',
        dark: '#d32f2f',
      },
      info: {
        main: aetherColors.info,
        light: '#64b5f6',
        dark: '#1976d2',
      },
      background: {
        default: isDark ? aetherColors.dark.background : '#ffffff',
        paper: isDark ? aetherColors.dark.surface : '#ffffff',
      },
      text: {
        primary: isDark ? aetherColors.dark.text.primary : 'rgba(0, 0, 0, 0.87)',
        secondary: isDark ? aetherColors.dark.text.secondary : 'rgba(0, 0, 0, 0.6)',
        disabled: isDark ? aetherColors.dark.text.disabled : 'rgba(0, 0, 0, 0.38)',
      },
      divider: isDark ? aetherColors.dark.border : 'rgba(0, 0, 0, 0.12)',
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
            // CSS Custom Properties for theme switching
            '--color-primary': aetherColors.primary,
            '--color-secondary': aetherColors.secondary,
            '--color-accent': aetherColors.accent,
            '--color-gold': aetherColors.gold,
            '--color-success': aetherColors.success,
            '--color-warning': aetherColors.warning,
            '--color-error': aetherColors.error,
            '--color-background': isDark ? aetherColors.dark.background : '#ffffff',
            '--color-surface': isDark ? aetherColors.dark.surface : '#ffffff',
            '--color-border': isDark ? aetherColors.dark.border : 'rgba(0, 0, 0, 0.12)',
            '--glass-light': aetherColors.glass.light,
            '--glass-dark': aetherColors.glass.dark,
            '--glass-dark-heavy': aetherColors.glass.darkHeavy,
          },
          body: {
            backgroundColor: isDark ? aetherColors.dark.background : '#ffffff',
            color: isDark ? aetherColors.dark.text.primary : 'rgba(0, 0, 0, 0.87)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
          '*': {
            boxSizing: 'border-box',
          },
          // Glass morphism utility class
          '.glass-morphism': {
            background: isDark ? aetherColors.glass.darkHeavy : aetherColors.glass.light,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
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
            backgroundColor: isDark ? aetherColors.dark.surface : '#ffffff',
            border: isDark ? `1px solid ${aetherColors.dark.border}` : 'none',
            borderRadius: borderRadius.lg,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDark 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.12)',
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
            backgroundColor: isDark ? aetherColors.dark.surface : '#ffffff',
            border: isDark ? `1px solid ${aetherColors.dark.border}` : 'none',
          },
        },
      },
    },
  });
};

// Default theme (dark mode)
export const theme = createAetherTheme('dark');

// Export theme utilities
export { aetherColors as colors };
export default theme;