/**
 * Theme Creation Utilities
 * 
 * Functions for creating and manipulating theme objects.
 * Separated from index.ts to avoid circular dependencies.
 */

import { Theme, ThemeConfig } from './types';
import { createCustomThemeColors } from './colors';
import { createTypography } from './typography';
import { defaultSpacing, defaultShadows, defaultBorderRadius } from './spacing';
import { defaultBreakpoints } from './breakpoints';

/**
 * Create a complete theme object with optional customization
 * 
 * @param config - Theme configuration options
 * @returns Complete theme object
 * 
 * @example
 * // Default theme
 * const theme = createTheme();
 * 
 * // Dark theme
 * const darkTheme = createTheme({ mode: 'dark' });
 * 
 * // Custom brand theme
 * const brandTheme = createTheme({
 *   colors: {
 *     primary: createColorPalette('#FF6B35'),
 *     secondary: createColorPalette('#007AFF'),
 *   },
 *   fonts: {
 *     sans: 'CustomFont-Regular',
 *   },
 *   name: 'Brand Theme',
 * });
 */
export const createTheme = (config: ThemeConfig = {}): Theme => {
  const {
    colors: customColors,
    fonts: customFonts,
    spacing: customSpacing,
    mode = 'light',
    name = 'Default Theme',
  } = config;

  // Create color system
  const colors = createCustomThemeColors(customColors || {}, mode);

  // Create typography system
  const typography = createTypography(customFonts);

  // Create spacing system
  const spacing = { ...defaultSpacing, ...customSpacing };

  return {
    // Core systems
    colors,
    typography,
    spacing,
    breakpoints: defaultBreakpoints,
    shadows: defaultShadows,
    borderRadius: defaultBorderRadius,
    
    // Metadata
    mode,
    name,
  };
};

/**
 * Merge multiple themes (useful for theme composition)
 * 
 * @param baseTheme - Base theme
 * @param overrides - Theme overrides
 * @returns Merged theme
 * 
 * @example
 * const customTheme = mergeThemes(lightTheme, {
 *   colors: {
 *     colors: {
 *       primary: createColorPalette('#FF6B35'),
 *     },
 *   },
 * });
 */
export const mergeThemes = (baseTheme: Theme, overrides: Partial<Theme>): Theme => {
  return {
    ...baseTheme,
    ...overrides,
    colors: overrides.colors ? { ...baseTheme.colors, ...overrides.colors } : baseTheme.colors,
    typography: overrides.typography ? { ...baseTheme.typography, ...overrides.typography } : baseTheme.typography,
    spacing: overrides.spacing ? { ...baseTheme.spacing, ...overrides.spacing } : baseTheme.spacing,
    breakpoints: overrides.breakpoints ? { ...baseTheme.breakpoints, ...overrides.breakpoints } : baseTheme.breakpoints,
    shadows: overrides.shadows ? { ...baseTheme.shadows, ...overrides.shadows } : baseTheme.shadows,
    borderRadius: overrides.borderRadius ? { ...baseTheme.borderRadius, ...overrides.borderRadius } : baseTheme.borderRadius,
  };
};