/**
 * Theme System Type Definitions
 * 
 * Comprehensive TypeScript types for a flexible, reusable theme system
 * that can be easily customized for different applications.
 */

import { TextStyle } from 'react-native';

// ===== SPACING TYPES =====
export interface SpacingScale {
  xs: number;    // 4px
  sm: number;    // 8px
  md: number;    // 16px
  lg: number;    // 24px
  xl: number;    // 32px
  '2xl': number; // 40px
  '3xl': number; // 48px
  '4xl': number; // 64px
}

// ===== COLOR TYPES =====
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;  // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SemanticColors {
  primary: ColorPalette;
  secondary: ColorPalette;
  success: ColorPalette;
  warning: ColorPalette;
  error: ColorPalette;
  neutral: ColorPalette;
}

export interface ThemeColors {
  // Semantic color palettes
  colors: SemanticColors;
  
  // Contextual colors (automatically generated from palettes)
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    link: string;
    success: string;
    warning: string;
    error: string;
  };
  
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
  };
  
  surface: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
}

// ===== TYPOGRAPHY TYPES =====
export interface FontWeight {
  light: TextStyle['fontWeight'];
  regular: TextStyle['fontWeight'];
  medium: TextStyle['fontWeight'];
  semibold: TextStyle['fontWeight'];
  bold: TextStyle['fontWeight'];
}

export interface FontSize {
  xs: number;    // 12px
  sm: number;    // 14px
  base: number;  // 16px
  lg: number;    // 18px
  xl: number;    // 20px
  '2xl': number; // 24px
  '3xl': number; // 28px
  '4xl': number; // 32px
  '5xl': number; // 40px
  '6xl': number; // 48px
}

export interface LineHeight {
  tight: number;   // 1.2
  normal: number;  // 1.5
  relaxed: number; // 1.7
  loose: number;   // 2.0
}

export interface TypographyVariant extends TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle['fontWeight'];
}

export interface Typography {
  // Font configuration
  fontFamily: {
    mono: string;
    sans: string;
    serif: string;
  };
  
  fontWeight: FontWeight;
  fontSize: FontSize;
  lineHeight: LineHeight;
  
  // Pre-built variants
  variants: {
    // Display styles
    display: {
      large: TypographyVariant;
      medium: TypographyVariant;
      small: TypographyVariant;
    };
    
    // Heading styles
    heading: {
      h1: TypographyVariant;
      h2: TypographyVariant;
      h3: TypographyVariant;
      h4: TypographyVariant;
      h5: TypographyVariant;
      h6: TypographyVariant;
    };
    
    // Body text styles
    body: {
      large: TypographyVariant;
      medium: TypographyVariant;
      small: TypographyVariant;
    };
    
    // Caption and helper text
    caption: {
      large: TypographyVariant;
      small: TypographyVariant;
    };
    
    // Special purpose
    button: TypographyVariant;
    label: TypographyVariant;
    code: TypographyVariant;
  };
}

// ===== BREAKPOINT TYPES =====
export interface Breakpoints {
  xs: number;  // Mobile small
  sm: number;  // Mobile large
  md: number;  // Tablet
  lg: number;  // Desktop small
  xl: number;  // Desktop large
}

// ===== SHADOW TYPES =====
export interface ShadowVariant {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number; // Android
}

export interface Shadows {
  none: ShadowVariant;
  small: ShadowVariant;
  medium: ShadowVariant;
  large: ShadowVariant;
  extraLarge: ShadowVariant;
}

// ===== BORDER RADIUS TYPES =====
export interface BorderRadius {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

// ===== MAIN THEME TYPE =====
export interface Theme {
  // Color system
  colors: ThemeColors;
  
  // Typography system
  typography: Typography;
  
  // Spacing system
  spacing: SpacingScale;
  
  // Responsive breakpoints
  breakpoints: Breakpoints;
  
  // Shadow system
  shadows: Shadows;
  
  // Border radius scale
  borderRadius: BorderRadius;
  
  // Theme metadata
  mode: 'light' | 'dark';
  name: string;
}

// ===== THEME CONFIGURATION TYPES =====
export interface ThemeConfig {
  // Override default colors
  colors?: Partial<SemanticColors>;
  
  // Override default fonts
  fonts?: Partial<Typography['fontFamily']>;
  
  // Custom spacing (if not using 8px grid)
  spacing?: Partial<SpacingScale>;
  
  // Theme metadata
  name?: string;
  mode?: 'light' | 'dark';
}

// ===== CONTEXT TYPES =====
export interface ThemeContextValue {
  theme: Theme;
  toggleMode: () => void;
  setMode: (mode: 'light' | 'dark') => void;
  updateTheme: (config: ThemeConfig) => void;
}

// ===== UTILITY TYPES =====
export type ColorToken = keyof ThemeColors['colors'];
export type SpacingToken = keyof SpacingScale;
export type TypographyVariantToken = 
  | `display.${keyof Typography['variants']['display']}`
  | `heading.${keyof Typography['variants']['heading']}`
  | `body.${keyof Typography['variants']['body']}`
  | `caption.${keyof Typography['variants']['caption']}`
  | 'button' | 'label' | 'code';