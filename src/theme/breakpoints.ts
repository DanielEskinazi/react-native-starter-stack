/**
 * Breakpoints System
 * 
 * Responsive design breakpoints for different screen sizes.
 * Useful for creating adaptive layouts that work well across devices.
 */

import { Dimensions } from 'react-native';
import { Breakpoints } from './types';

// ===== DEFAULT BREAKPOINTS =====

/**
 * Default breakpoints based on common device sizes
 * These align with typical mobile, tablet, and desktop breakpoints
 */
export const defaultBreakpoints: Breakpoints = {
  xs: 0,     // Mobile small (0px and up)
  sm: 480,   // Mobile large (480px and up)
  md: 768,   // Tablet (768px and up)
  lg: 1024,  // Desktop small (1024px and up)
  xl: 1280,  // Desktop large (1280px and up)
};

/**
 * Get current screen dimensions
 */
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

/**
 * Get current screen size category
 * 
 * @param breakpoints - Breakpoints object (optional)
 * @returns Current breakpoint key
 * 
 * @example
 * const currentSize = getCurrentBreakpoint();
 * console.log(currentSize); // 'md' for tablet
 */
export const getCurrentBreakpoint = (
  breakpoints: Breakpoints = defaultBreakpoints
): keyof Breakpoints => {
  const { width } = getScreenDimensions();
  
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

/**
 * Check if screen is at or above a specific breakpoint
 * 
 * @param breakpoint - Breakpoint key to check
 * @param breakpoints - Breakpoints object (optional)
 * @returns True if screen is at or above the breakpoint
 * 
 * @example
 * const isTablet = isBreakpointUp('md');
 * const isDesktop = isBreakpointUp('lg');
 */
export const isBreakpointUp = (
  breakpoint: keyof Breakpoints,
  breakpoints: Breakpoints = defaultBreakpoints
): boolean => {
  const { width } = getScreenDimensions();
  return width >= breakpoints[breakpoint];
};

/**
 * Check if screen is below a specific breakpoint
 * 
 * @param breakpoint - Breakpoint key to check
 * @param breakpoints - Breakpoints object (optional)
 * @returns True if screen is below the breakpoint
 * 
 * @example
 * const isMobile = isBreakpointDown('md');
 */
export const isBreakpointDown = (
  breakpoint: keyof Breakpoints,
  breakpoints: Breakpoints = defaultBreakpoints
): boolean => {
  const { width } = getScreenDimensions();
  return width < breakpoints[breakpoint];
};

/**
 * Check if screen is between two breakpoints
 * 
 * @param min - Minimum breakpoint (inclusive)
 * @param max - Maximum breakpoint (exclusive)
 * @param breakpoints - Breakpoints object (optional)
 * @returns True if screen is between the breakpoints
 * 
 * @example
 * const isTabletOnly = isBreakpointBetween('md', 'lg');
 */
export const isBreakpointBetween = (
  min: keyof Breakpoints,
  max: keyof Breakpoints,
  breakpoints: Breakpoints = defaultBreakpoints
): boolean => {
  const { width } = getScreenDimensions();
  return width >= breakpoints[min] && width < breakpoints[max];
};

// ===== RESPONSIVE VALUE HELPERS =====

/**
 * Get responsive value based on current breakpoint
 * 
 * @param values - Object with values for each breakpoint
 * @param breakpoints - Breakpoints object (optional)
 * @returns Value for current breakpoint
 * 
 * @example
 * const fontSize = getResponsiveValue({
 *   xs: 14,
 *   sm: 16,
 *   md: 18,
 *   lg: 20,
 *   xl: 22,
 * });
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<keyof Breakpoints, T>>,
  breakpoints: Breakpoints = defaultBreakpoints
): T | undefined => {
  const currentBreakpoint = getCurrentBreakpoint(breakpoints);
  
  // Find the value for current breakpoint or the largest available smaller one
  const orderedBreakpoints: Array<keyof Breakpoints> = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const breakpoint = orderedBreakpoints[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return undefined;
};

/**
 * Create responsive styles object
 * 
 * @param stylesByBreakpoint - Styles for each breakpoint
 * @param breakpoints - Breakpoints object (optional)
 * @returns Style object for current breakpoint
 * 
 * @example
 * const containerStyles = createResponsiveStyles({
 *   xs: { flexDirection: 'column' },
 *   md: { flexDirection: 'row' },
 * });
 */
export const createResponsiveStyles = <T extends Record<string, any>>(
  stylesByBreakpoint: Partial<Record<keyof Breakpoints, T>>,
  breakpoints: Breakpoints = defaultBreakpoints
): T => {
  const currentBreakpoint = getCurrentBreakpoint(breakpoints);
  
  // Merge styles from xs up to current breakpoint
  const orderedBreakpoints: Array<keyof Breakpoints> = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);
  
  let mergedStyles = {} as T;
  
  for (let i = 0; i <= currentIndex; i++) {
    const breakpoint = orderedBreakpoints[i];
    if (stylesByBreakpoint[breakpoint]) {
      mergedStyles = { ...mergedStyles, ...stylesByBreakpoint[breakpoint] };
    }
  }
  
  return mergedStyles;
};

// ===== DEVICE TYPE HELPERS =====

/**
 * Check if current device is mobile
 */
export const isMobile = (breakpoints: Breakpoints = defaultBreakpoints): boolean => {
  return isBreakpointDown('md', breakpoints);
};

/**
 * Check if current device is tablet
 */
export const isTablet = (breakpoints: Breakpoints = defaultBreakpoints): boolean => {
  return isBreakpointBetween('md', 'lg', breakpoints);
};

/**
 * Check if current device is desktop
 */
export const isDesktop = (breakpoints: Breakpoints = defaultBreakpoints): boolean => {
  return isBreakpointUp('lg', breakpoints);
};

/**
 * Get device type string
 */
export const getDeviceType = (breakpoints: Breakpoints = defaultBreakpoints): 'mobile' | 'tablet' | 'desktop' => {
  if (isDesktop(breakpoints)) return 'desktop';
  if (isTablet(breakpoints)) return 'tablet';
  return 'mobile';
};

// ===== CUSTOM BREAKPOINT CREATION =====

/**
 * Create custom breakpoints
 * 
 * @param customBreakpoints - Custom breakpoint values
 * @returns Merged breakpoints with defaults
 * 
 * @example
 * const myBreakpoints = createCustomBreakpoints({
 *   lg: 1200,  // Custom desktop breakpoint
 *   xl: 1600,  // Custom large desktop breakpoint
 * });
 */
export const createCustomBreakpoints = (
  customBreakpoints: Partial<Breakpoints>
): Breakpoints => {
  return { ...defaultBreakpoints, ...customBreakpoints };
};