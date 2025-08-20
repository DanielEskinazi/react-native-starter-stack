/**
 * Spacing & Design Tokens
 * 
 * Consistent spacing system based on 8px grid, plus shadows and border radius.
 * Ensures visual harmony and predictable layouts.
 */

import { SpacingScale, Shadows, BorderRadius } from './types';

// ===== SPACING SYSTEM =====

/**
 * Default spacing scale based on 8px grid system
 * This creates visual rhythm and consistency across the app
 */
export const defaultSpacing: SpacingScale = {
  xs: 4,      // 0.5 * base
  sm: 8,      // 1 * base (base unit)
  md: 16,     // 2 * base
  lg: 24,     // 3 * base
  xl: 32,     // 4 * base
  '2xl': 40,  // 5 * base
  '3xl': 48,  // 6 * base
  '4xl': 64,  // 8 * base
};

/**
 * Create custom spacing scale
 * 
 * @param baseUnit - Base spacing unit (default: 8px)
 * @returns SpacingScale object
 * 
 * @example
 * const customSpacing = createSpacingScale(4); // 4px base unit
 */
export const createSpacingScale = (baseUnit: number = 8): SpacingScale => ({
  xs: baseUnit * 0.5,
  sm: baseUnit * 1,
  md: baseUnit * 2,
  lg: baseUnit * 3,
  xl: baseUnit * 4,
  '2xl': baseUnit * 5,
  '3xl': baseUnit * 6,
  '4xl': baseUnit * 8,
});

// ===== SHADOW SYSTEM =====

/**
 * Default shadow variants for elevation
 * Consistent with Material Design elevation principles
 */
export const defaultShadows: Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  
  extraLarge: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
};

/**
 * Create custom shadow with specified color
 * 
 * @param shadowColor - Shadow color (default: black)
 * @returns Shadows object with custom color
 */
export const createCustomShadows = (shadowColor: string = '#000000'): Shadows => ({
  none: {
    ...defaultShadows.none,
  },
  
  small: {
    ...defaultShadows.small,
    shadowColor,
  },
  
  medium: {
    ...defaultShadows.medium,
    shadowColor,
  },
  
  large: {
    ...defaultShadows.large,
    shadowColor,
  },
  
  extraLarge: {
    ...defaultShadows.extraLarge,
    shadowColor,
  },
});

// ===== BORDER RADIUS SYSTEM =====

/**
 * Default border radius scale
 * Creates consistent rounded corners throughout the app
 */
export const defaultBorderRadius: BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999, // Fully rounded (pills/circles)
};

/**
 * Create custom border radius scale
 * 
 * @param baseRadius - Base radius unit (default: 4px)
 * @returns BorderRadius object
 */
export const createBorderRadiusScale = (baseRadius: number = 4): BorderRadius => ({
  none: 0,
  xs: baseRadius * 0.5,
  sm: baseRadius * 1,
  md: baseRadius * 2,
  lg: baseRadius * 3,
  xl: baseRadius * 4,
  full: 9999,
});

// ===== UTILITY FUNCTIONS =====

/**
 * Get spacing value by token
 * 
 * @param spacing - Spacing scale
 * @param token - Spacing token
 * @returns Spacing value in pixels
 * 
 * @example
 * const padding = getSpacing(spacing, 'md'); // Returns 16
 */
export const getSpacing = (spacing: SpacingScale, token: keyof SpacingScale): number => {
  return spacing[token];
};

/**
 * Create spacing object for React Native styles
 * 
 * @param spacing - Spacing scale
 * @param vertical - Vertical spacing token
 * @param horizontal - Horizontal spacing token (optional, defaults to vertical)
 * @returns Object with padding/margin values
 * 
 * @example
 * const padding = createSpacingObject(spacing, 'md', 'lg');
 * // Returns: { paddingVertical: 16, paddingHorizontal: 24 }
 */
export const createSpacingObject = (
  spacing: SpacingScale,
  vertical: keyof SpacingScale,
  horizontal?: keyof SpacingScale
) => {
  const verticalValue = getSpacing(spacing, vertical);
  const horizontalValue = horizontal ? getSpacing(spacing, horizontal) : verticalValue;
  
  return {
    vertical: verticalValue,
    horizontal: horizontalValue,
    top: verticalValue,
    bottom: verticalValue,
    left: horizontalValue,
    right: horizontalValue,
  };
};

/**
 * Calculate responsive spacing based on screen size
 * 
 * @param baseSpacing - Base spacing value
 * @param screenWidth - Current screen width
 * @param breakpoint - Breakpoint width for scaling
 * @param scaleFactor - Scale factor for larger screens
 * @returns Adjusted spacing value
 */
export const getResponsiveSpacing = (
  baseSpacing: number,
  screenWidth: number,
  breakpoint: number = 768,
  scaleFactor: number = 1.25
): number => {
  return screenWidth >= breakpoint ? Math.round(baseSpacing * scaleFactor) : baseSpacing;
};

// ===== PRESET COMBINATIONS =====

/**
 * Common spacing combinations for consistent component design
 */
export const spacingPresets = {
  // Card spacing
  card: {
    padding: 'md' as keyof SpacingScale,
    margin: 'sm' as keyof SpacingScale,
    gap: 'sm' as keyof SpacingScale,
  },
  
  // Button spacing
  button: {
    paddingVertical: 'sm' as keyof SpacingScale,
    paddingHorizontal: 'md' as keyof SpacingScale,
    margin: 'xs' as keyof SpacingScale,
  },
  
  // Form spacing
  form: {
    fieldSpacing: 'md' as keyof SpacingScale,
    sectionSpacing: 'lg' as keyof SpacingScale,
    labelSpacing: 'xs' as keyof SpacingScale,
  },
  
  // Layout spacing
  layout: {
    screenPadding: 'md' as keyof SpacingScale,
    sectionSpacing: 'xl' as keyof SpacingScale,
    itemSpacing: 'sm' as keyof SpacingScale,
  },
} as const;