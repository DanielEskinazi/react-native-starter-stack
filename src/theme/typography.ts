/**
 * Typography System
 * 
 * Comprehensive typography system with configurable fonts, sizes, and variants.
 * Provides consistent text styling across the application.
 */

import { Platform } from 'react-native';
import { Typography, FontWeight, FontSize, LineHeight, TypographyVariant } from './types';

// ===== FONT CONFIGURATIONS =====

/**
 * Default font families optimized for each platform
 */
export const defaultFontFamilies = {
  // Sans-serif fonts (primary)
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  
  // Serif fonts (for special emphasis)
  serif: Platform.select({
    ios: 'Times New Roman',
    android: 'serif',
    default: 'serif',
  }),
  
  // Monospace fonts (for code)
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

/**
 * Font weight scale
 */
export const fontWeights: FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

/**
 * Font size scale (based on modular scale)
 */
export const fontSizes: FontSize = {
  xs: 12,
  sm: 14,
  base: 16,    // Base font size
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
};

/**
 * Line height scale
 */
export const lineHeights: LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2.0,
};

// ===== TYPOGRAPHY VARIANT BUILDERS =====

/**
 * Create a typography variant with consistent properties
 */
const createVariant = (
  fontSize: number,
  fontWeight: FontWeight[keyof FontWeight],
  lineHeight: number,
  fontFamily?: string
): TypographyVariant => ({
  fontSize,
  fontWeight,
  lineHeight: fontSize * lineHeight,
  fontFamily: fontFamily || defaultFontFamilies.sans,
  textAlign: 'left' as const,
});

// ===== TYPOGRAPHY VARIANTS =====

/**
 * Default typography system with all variants
 */
export const createTypography = (
  customFontFamilies: Partial<typeof defaultFontFamilies> = {}
): Typography => {
  const fonts = { ...defaultFontFamilies, ...customFontFamilies };
  
  return {
    // Font configuration
    fontFamily: fonts,
    fontWeight: fontWeights,
    fontSize: fontSizes,
    lineHeight: lineHeights,
    
    // Pre-built variants
    variants: {
      // Display styles - Large, attention-grabbing text
      display: {
        large: createVariant(fontSizes['6xl'], fontWeights.bold, lineHeights.tight, fonts.sans),
        medium: createVariant(fontSizes['5xl'], fontWeights.bold, lineHeights.tight, fonts.sans),
        small: createVariant(fontSizes['4xl'], fontWeights.bold, lineHeights.tight, fonts.sans),
      },
      
      // Heading styles - Section headers
      heading: {
        h1: createVariant(fontSizes['3xl'], fontWeights.bold, lineHeights.tight, fonts.sans),
        h2: createVariant(fontSizes['2xl'], fontWeights.bold, lineHeights.tight, fonts.sans),
        h3: createVariant(fontSizes.xl, fontWeights.semibold, lineHeights.tight, fonts.sans),
        h4: createVariant(fontSizes.lg, fontWeights.semibold, lineHeights.normal, fonts.sans),
        h5: createVariant(fontSizes.base, fontWeights.semibold, lineHeights.normal, fonts.sans),
        h6: createVariant(fontSizes.sm, fontWeights.semibold, lineHeights.normal, fonts.sans),
      },
      
      // Body text styles - Main content
      body: {
        large: createVariant(fontSizes.lg, fontWeights.regular, lineHeights.normal, fonts.sans),
        medium: createVariant(fontSizes.base, fontWeights.regular, lineHeights.normal, fonts.sans),
        small: createVariant(fontSizes.sm, fontWeights.regular, lineHeights.normal, fonts.sans),
      },
      
      // Caption styles - Helper text, metadata
      caption: {
        large: createVariant(fontSizes.sm, fontWeights.regular, lineHeights.normal, fonts.sans),
        small: createVariant(fontSizes.xs, fontWeights.regular, lineHeights.normal, fonts.sans),
      },
      
      // Special purpose variants
      button: createVariant(fontSizes.base, fontWeights.semibold, lineHeights.tight, fonts.sans),
      label: createVariant(fontSizes.sm, fontWeights.medium, lineHeights.normal, fonts.sans),
      code: createVariant(fontSizes.sm, fontWeights.regular, lineHeights.normal, fonts.mono),
    },
  };
};

// ===== READY-TO-USE TYPOGRAPHY =====

/**
 * Default typography system
 */
export const defaultTypography = createTypography();

// ===== UTILITY FUNCTIONS =====

/**
 * Get typography variant by path
 * 
 * @param typography - Typography object
 * @param variant - Variant path (e.g., 'heading.h1', 'body.medium')
 * @returns TypographyVariant object
 * 
 * @example
 * const headingStyle = getTypographyVariant(typography, 'heading.h1');
 */
export const getTypographyVariant = (
  typography: Typography,
  variant: string
): TypographyVariant => {
  const parts = variant.split('.');
  
  if (parts.length === 1) {
    // Special purpose variants (button, label, code)
    return typography.variants[variant as keyof Typography['variants']] as TypographyVariant;
  }
  
  if (parts.length === 2) {
    const [category, size] = parts;
    const categoryVariants = typography.variants[category as keyof Typography['variants']];
    
    if (categoryVariants && typeof categoryVariants === 'object') {
      return (categoryVariants as any)[size] as TypographyVariant;
    }
  }
  
  throw new Error(`Invalid typography variant: ${variant}`);
};

/**
 * Create custom typography variant
 * 
 * @param fontSize - Font size in pixels
 * @param fontWeight - Font weight
 * @param lineHeight - Line height multiplier
 * @param fontFamily - Font family (optional)
 * @returns TypographyVariant object
 * 
 * @example
 * const customVariant = createCustomVariant(18, 'semibold', 1.4);
 */
export const createCustomVariant = (
  fontSize: number,
  fontWeight: FontWeight[keyof FontWeight],
  lineHeight: number,
  fontFamily?: string
): TypographyVariant => createVariant(fontSize, fontWeight, lineHeight, fontFamily);

// ===== RESPONSIVE TYPOGRAPHY HELPERS =====

/**
 * Scale font size based on screen size
 * Useful for responsive design
 * 
 * @param baseSize - Base font size
 * @param scaleFactor - Scale factor (1.0 = no change)
 * @returns Scaled font size
 */
export const scaleFontSize = (baseSize: number, scaleFactor: number = 1.0): number => {
  return Math.round(baseSize * scaleFactor);
};

/**
 * Create responsive typography variants
 * 
 * @param typography - Base typography
 * @param scaleFactor - Scale factor for all sizes
 * @returns Scaled typography
 */
export const createResponsiveTypography = (
  typography: Typography,
  scaleFactor: number
): Typography => {
  const scaleVariant = (variant: TypographyVariant): TypographyVariant => ({
    ...variant,
    fontSize: scaleFontSize(variant.fontSize, scaleFactor),
    lineHeight: scaleFontSize(variant.lineHeight, scaleFactor),
  });
  
  return {
    ...typography,
    variants: {
      display: {
        large: scaleVariant(typography.variants.display.large),
        medium: scaleVariant(typography.variants.display.medium),
        small: scaleVariant(typography.variants.display.small),
      },
      heading: {
        h1: scaleVariant(typography.variants.heading.h1),
        h2: scaleVariant(typography.variants.heading.h2),
        h3: scaleVariant(typography.variants.heading.h3),
        h4: scaleVariant(typography.variants.heading.h4),
        h5: scaleVariant(typography.variants.heading.h5),
        h6: scaleVariant(typography.variants.heading.h6),
      },
      body: {
        large: scaleVariant(typography.variants.body.large),
        medium: scaleVariant(typography.variants.body.medium),
        small: scaleVariant(typography.variants.body.small),
      },
      caption: {
        large: scaleVariant(typography.variants.caption.large),
        small: scaleVariant(typography.variants.caption.small),
      },
      button: scaleVariant(typography.variants.button),
      label: scaleVariant(typography.variants.label),
      code: scaleVariant(typography.variants.code),
    },
  };
};