/**
 * Theme System - Main Export
 * 
 * Complete theme system for React Native applications.
 * Provides consistent design tokens, responsive utilities, and theme management.
 * 
 * @example
 * // Basic usage with default theme
 * import { createTheme, ThemeProvider, useTheme } from '@/theme';
 * 
 * const theme = createTheme();
 * 
 * // Custom theme
 * const customTheme = createTheme({
 *   colors: {
 *     primary: createColorPalette('#FF6B35'),
 *   },
 *   mode: 'dark',
 *   name: 'My Custom Theme',
 * });
 * 
 * // In your app
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * 
 * // In components
 * const { theme, toggleMode } = useTheme();
 */

// ===== TYPE EXPORTS =====
export type {
  Theme,
  ThemeConfig,
  ThemeContextValue,
  ThemeColors,
  SemanticColors,
  ColorPalette,
  Typography,
  TypographyVariant,
  FontWeight,
  FontSize,
  LineHeight,
  SpacingScale,
  Breakpoints,
  Shadows,
  BorderRadius,
  ColorToken,
  SpacingToken,
  TypographyVariantToken,
} from './types';

// ===== COLOR SYSTEM EXPORTS =====
export {
  defaultColorPalettes,
  generateLightThemeColors,
  generateDarkThemeColors,
  lightThemeColors,
  darkThemeColors,
  createColorPalette,
  createCustomThemeColors,
} from './colors';

// ===== TYPOGRAPHY SYSTEM EXPORTS =====
export {
  defaultFontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  createTypography,
  defaultTypography,
  getTypographyVariant,
  createCustomVariant,
  scaleFontSize,
  createResponsiveTypography,
} from './typography';

// ===== SPACING SYSTEM EXPORTS =====
export {
  defaultSpacing,
  defaultShadows,
  defaultBorderRadius,
  createSpacingScale,
  createCustomShadows,
  createBorderRadiusScale,
  getSpacing,
  createSpacingObject,
  getResponsiveSpacing,
  spacingPresets,
} from './spacing';

// ===== BREAKPOINT SYSTEM EXPORTS =====
export {
  defaultBreakpoints,
  getScreenDimensions,
  getCurrentBreakpoint,
  isBreakpointUp,
  isBreakpointDown,
  isBreakpointBetween,
  getResponsiveValue,
  createResponsiveStyles,
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,
  createCustomBreakpoints,
} from './breakpoints';

// ===== CONTEXT & HOOKS EXPORTS =====
export {
  ThemeProvider,
  useTheme,
  useCurrentTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  useResponsiveValue,
} from './context';

// ===== MAIN THEME CREATION =====

import { Theme, ThemeConfig } from './types';
import { defaultColorPalettes, createCustomThemeColors } from './colors';
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

// ===== DEFAULT THEMES =====

/**
 * Default light theme
 */
export const lightTheme = createTheme({ mode: 'light', name: 'Light Theme' });

/**
 * Default dark theme
 */
export const darkTheme = createTheme({ mode: 'dark', name: 'Dark Theme' });

// ===== THEME UTILITIES =====

/**
 * Create a style object using theme values
 * 
 * @param theme - Theme object
 * @param stylesFn - Function that receives theme and returns styles
 * @returns Style object
 * 
 * @example
 * const styles = createThemedStyles(theme, (t) => ({
 *   container: {
 *     backgroundColor: t.colors.background.primary,
 *     padding: t.spacing.md,
 *     borderRadius: t.borderRadius.md,
 *   },
 *   title: {
 *     ...t.typography.variants.heading.h1,
 *     color: t.colors.text.primary,
 *   },
 * }));
 */
export const createThemedStyles = <T extends Record<string, any>>(
  theme: Theme,
  stylesFn: (theme: Theme) => T
): T => {
  return stylesFn(theme);
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

// ===== QUICK ACCESS HELPERS =====

/**
 * Quick access to commonly used theme tokens
 * 
 * @param theme - Theme object
 * @returns Object with commonly used values
 * 
 * @example
 * const tokens = getThemeTokens(theme);
 * const primaryColor = tokens.primary;
 * const mediumSpacing = tokens.spacingMd;
 */
export const getThemeTokens = (theme: Theme) => ({
  // Colors
  primary: theme.colors.colors.primary[500],
  secondary: theme.colors.colors.secondary[500],
  success: theme.colors.colors.success[500],
  warning: theme.colors.colors.warning[500],
  error: theme.colors.colors.error[500],
  
  // Backgrounds
  backgroundPrimary: theme.colors.background.primary,
  backgroundSecondary: theme.colors.background.secondary,
  
  // Text colors
  textPrimary: theme.colors.text.primary,
  textSecondary: theme.colors.text.secondary,
  
  // Spacing
  spacingXs: theme.spacing.xs,
  spacingSm: theme.spacing.sm,
  spacingMd: theme.spacing.md,
  spacingLg: theme.spacing.lg,
  spacingXl: theme.spacing.xl,
  
  // Border radius
  radiusSm: theme.borderRadius.sm,
  radiusMd: theme.borderRadius.md,
  radiusLg: theme.borderRadius.lg,
  
  // Typography
  headingLarge: theme.typography.variants.heading.h1,
  headingMedium: theme.typography.variants.heading.h2,
  bodyLarge: theme.typography.variants.body.large,
  bodyMedium: theme.typography.variants.body.medium,
  
  // Shadows
  shadowSmall: theme.shadows.small,
  shadowMedium: theme.shadows.medium,
  shadowLarge: theme.shadows.large,
});

// ===== DEFAULT EXPORT =====

/**
 * Default theme instance
 */
export default lightTheme;