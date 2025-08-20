/**
 * Color System
 * 
 * Reusable color palettes and theme generators for light/dark modes.
 * Easy to customize for different brand colors while maintaining accessibility.
 */

import { ColorPalette, SemanticColors, ThemeColors } from './types';

// ===== DEFAULT COLOR PALETTES =====
export const defaultColorPalettes: SemanticColors = {
  // Primary - Blue (iOS system blue inspired)
  primary: {
    50: '#F0F8FF',
    100: '#E0F1FF',
    200: '#B8E2FF',
    300: '#87CEEF',
    400: '#5DADE2',
    500: '#007AFF', // Base
    600: '#0056B3',
    700: '#003D80',
    800: '#002B5C',
    900: '#001F42',
  },

  // Secondary - Orange/Red accent
  secondary: {
    50: '#FFF5F0',
    100: '#FFE8D6',
    200: '#FFD0B3',
    300: '#FFB38A',
    400: '#FF9166',
    500: '#FF6B35', // Base
    600: '#E55A2B',
    700: '#CC4A20',
    800: '#B33A16',
    900: '#992B0C',
  },

  // Success - Green
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Base
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Warning - Yellow/Amber
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Base
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Error - Red
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Base
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Neutral - Gray scale
  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F5',
    200: '#E4E4E7',
    300: '#D4D4D8',
    400: '#A1A1AA',
    500: '#71717A', // Base
    600: '#52525B',
    700: '#3F3F46',
    800: '#27272A',
    900: '#18181B',
  },
};

// ===== THEME COLOR GENERATORS =====

/**
 * Generate light theme colors from semantic color palettes
 */
export const generateLightThemeColors = (colors: SemanticColors): ThemeColors => ({
  colors,
  
  background: {
    primary: colors.neutral[50],      // Almost white
    secondary: colors.neutral[100],   // Light gray
    tertiary: colors.neutral[200],    // Medium light gray
    elevated: '#FFFFFF',              // Pure white
    overlay: 'rgba(0, 0, 0, 0.5)',   // Semi-transparent dark
  },
  
  text: {
    primary: colors.neutral[900],     // Near black
    secondary: colors.neutral[700],   // Dark gray
    tertiary: colors.neutral[500],    // Medium gray
    inverse: colors.neutral[50],      // Light on dark
    link: colors.primary[600],        // Primary blue
    success: colors.success[700],     // Dark green
    warning: colors.warning[700],     // Dark amber
    error: colors.error[600],         // Red
  },
  
  border: {
    primary: colors.neutral[200],     // Light border
    secondary: colors.neutral[300],   // Medium border
    focus: colors.primary[500],       // Primary blue
    error: colors.error[400],         // Error red
  },
  
  surface: {
    primary: '#FFFFFF',               // White
    secondary: colors.neutral[50],    // Off white
    tertiary: colors.neutral[100],    // Light gray
    inverse: colors.neutral[800],     // Dark surface
  },
});

/**
 * Generate dark theme colors from semantic color palettes
 */
export const generateDarkThemeColors = (colors: SemanticColors): ThemeColors => ({
  colors,
  
  background: {
    primary: colors.neutral[900],     // Near black
    secondary: colors.neutral[800],   // Dark gray
    tertiary: colors.neutral[700],    // Medium dark gray
    elevated: colors.neutral[800],    // Elevated dark
    overlay: 'rgba(0, 0, 0, 0.7)',   // Darker overlay
  },
  
  text: {
    primary: colors.neutral[50],      // Near white
    secondary: colors.neutral[300],   // Light gray
    tertiary: colors.neutral[400],    // Medium light gray
    inverse: colors.neutral[900],     // Dark on light
    link: colors.primary[400],        // Lighter primary blue
    success: colors.success[400],     // Lighter green
    warning: colors.warning[400],     // Lighter amber
    error: colors.error[400],         // Lighter red
  },
  
  border: {
    primary: colors.neutral[700],     // Dark border
    secondary: colors.neutral[600],   // Medium dark border
    focus: colors.primary[400],       // Lighter primary blue
    error: colors.error[500],         // Error red
  },
  
  surface: {
    primary: colors.neutral[800],     // Dark surface
    secondary: colors.neutral[700],   // Medium dark
    tertiary: colors.neutral[600],    // Lighter dark
    inverse: colors.neutral[100],     // Light surface
  },
});

// ===== UTILITY FUNCTIONS =====

/**
 * Create custom color palette with proper contrast ratios
 * Useful for generating brand-specific colors
 */
export const createColorPalette = (baseColor: string): ColorPalette => {
  // This is a simplified version - in a real app you might want to use
  // a color manipulation library like chroma-js or polished
  return {
    50: lighten(baseColor, 0.95),
    100: lighten(baseColor, 0.85),
    200: lighten(baseColor, 0.7),
    300: lighten(baseColor, 0.5),
    400: lighten(baseColor, 0.3),
    500: baseColor, // Base color
    600: darken(baseColor, 0.1),
    700: darken(baseColor, 0.2),
    800: darken(baseColor, 0.3),
    900: darken(baseColor, 0.4),
  };
};

/**
 * Simple color lightening (in a real app, use a proper color library)
 */
function lighten(color: string, amount: number): string {
  // Simplified implementation - replace with proper color manipulation
  const hex = color.replace('#', '');
  const r = Math.min(255, Math.floor(parseInt(hex.substring(0, 2), 16) + (255 * amount)));
  const g = Math.min(255, Math.floor(parseInt(hex.substring(2, 4), 16) + (255 * amount)));
  const b = Math.min(255, Math.floor(parseInt(hex.substring(4, 6), 16) + (255 * amount)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Simple color darkening (in a real app, use a proper color library)
 */
function darken(color: string, amount: number): string {
  // Simplified implementation - replace with proper color manipulation
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.floor(parseInt(hex.substring(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(parseInt(hex.substring(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.floor(parseInt(hex.substring(4, 6), 16) * (1 - amount)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ===== PRESET THEME COLORS =====

/**
 * Ready-to-use light theme colors
 */
export const lightThemeColors = generateLightThemeColors(defaultColorPalettes);

/**
 * Ready-to-use dark theme colors
 */
export const darkThemeColors = generateDarkThemeColors(defaultColorPalettes);

// ===== CUSTOMIZATION HELPER =====

/**
 * Create custom theme colors with brand-specific palettes
 * 
 * @param customColors - Override default color palettes
 * @param mode - Light or dark mode
 * @returns ThemeColors object
 * 
 * @example
 * const brandColors = createCustomThemeColors({
 *   primary: createColorPalette('#FF6B35'),
 *   secondary: createColorPalette('#007AFF'),
 * }, 'light');
 */
export const createCustomThemeColors = (
  customColors: Partial<SemanticColors>,
  mode: 'light' | 'dark' = 'light'
): ThemeColors => {
  const mergedColors: SemanticColors = {
    ...defaultColorPalettes,
    ...customColors,
  };
  
  return mode === 'light' 
    ? generateLightThemeColors(mergedColors)
    : generateDarkThemeColors(mergedColors);
};