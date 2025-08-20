/**
 * Animation Constants
 * 
 * Centralized animation configuration values for consistent timing,
 * easing, and gesture thresholds throughout the application.
 */

import { Easing } from 'react-native-reanimated';

// Animation durations in milliseconds
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
  VERY_SLOW: 600,
} as const;

// Spring animation configurations
export const SPRING_CONFIG = {
  BOUNCY: { damping: 10, stiffness: 100 },
  GENTLE: { damping: 15, stiffness: 80 },
  STIFF: { damping: 20, stiffness: 200 },
  DEFAULT: { damping: 15, stiffness: 150 },
} as const;

// Gesture interaction thresholds
export const GESTURE_THRESHOLDS = {
  SWIPE_VELOCITY: 500,
  DISMISS_DISTANCE: 150,
  LONG_PRESS_DURATION: 500,
  DOUBLE_TAP_INTERVAL: 300,
  PULL_TO_REFRESH: 80,
  MAX_PULL_DISTANCE: 120,
} as const;

// Easing configurations for different animation types
export const INTERPOLATION_CONFIG = {
  EASE_OUT: { easing: Easing.out(Easing.exp) },
  EASE_IN_OUT: { easing: Easing.inOut(Easing.ease) },
  BOUNCE: { easing: Easing.bounce },
  LINEAR: { easing: Easing.linear },
  ELASTIC: { easing: Easing.elastic(1.5) },
} as const;

// Scale values for interactive feedback
export const SCALE_VALUES = {
  PRESS_SCALE: 0.95,
  LONG_PRESS_SCALE: 1.05,
  PINCH_MIN: 0.5,
  PINCH_MAX: 3.0,
  BOUNCE_SCALE: 1.1,
} as const;

// Layout animation configurations
export const LAYOUT_ANIMATION = {
  STAGGER_DELAY: 50, // ms delay between list items
  ENTER_DURATION: 300,
  EXIT_DURATION: 250,
  LAYOUT_DURATION: 200,
} as const;

// Scroll-driven animation constants
export const SCROLL_ANIMATION = {
  PARALLAX_SPEED: 0.5,
  HEADER_SCROLL_DISTANCE: 100,
  FADE_DISTANCE: 150,
} as const;

// Loading animation configurations
export const LOADING_ANIMATION = {
  PULSE_DURATION: 1000,
  SPIN_DURATION: 1500,
  SKELETON_OPACITY_MIN: 0.3,
  SKELETON_OPACITY_MAX: 0.7,
} as const;

// Modal and overlay configurations
export const MODAL_ANIMATION = {
  BACKDROP_OPACITY: 0.5,
  SCALE_FROM: 0.8,
  SCALE_TO: 1.0,
  BLUR_RADIUS: 10,
} as const;

export type AnimationDuration = typeof ANIMATION_DURATION[keyof typeof ANIMATION_DURATION];
export type SpringConfig = typeof SPRING_CONFIG[keyof typeof SPRING_CONFIG];
export type GestureThreshold = typeof GESTURE_THRESHOLDS[keyof typeof GESTURE_THRESHOLDS];