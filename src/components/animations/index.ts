/**
 * Animation Components and Utilities - Main Export
 * 
 * Comprehensive animation system for React Native applications.
 * Provides hooks, constants, demo components, and production-ready examples.
 */

// ===== ANIMATION CONSTANTS =====
export {
  ANIMATION_DURATION,
  SPRING_CONFIG,
  GESTURE_THRESHOLDS,
  INTERPOLATION_CONFIG,
  SCALE_VALUES,
  LAYOUT_ANIMATION,
  SCROLL_ANIMATION,
  LOADING_ANIMATION,
  MODAL_ANIMATION,
} from './constants';

export type {
  AnimationDuration,
  SpringConfig,
  GestureThreshold,
} from './constants';

// ===== ANIMATION HOOKS =====
export {
  usePressAnimation,
  useFadeIn,
  useSlideIn,
  useScrollAnimation,
  useVelocityGesture,
  useKeyboardAnimation,
  useReducedMotion,
  useLoadingAnimation,
  useMultiGesture,
} from './hooks/useAnimationHooks';

// ===== DEMO COMPONENTS =====
export { PressAnimationDemo } from './demos/PressAnimationDemo';
export { LoadingAnimationDemo } from './demos/LoadingAnimationDemo';
export { EntranceAnimationDemo } from './demos/EntranceAnimationDemo';
export { SwipeGestureDemo } from './demos/SwipeGestureDemo';
export { MultiTouchDemo } from './demos/MultiTouchDemo';
export { LayoutAnimationDemo } from './demos/LayoutAnimationDemo';

// ===== PRODUCTION EXAMPLES =====
export {
  SwipeableListItem,
  type SwipeableListItemProps,
  type SwipeAction,
} from './examples/SwipeableListItem';

export {
  AnimatedModal,
  type AnimatedModalProps,
  type AnimatedModalRef,
  type ModalAnimationType,
} from './examples/AnimatedModal';

export {
  ParallaxScrollView,
  ParallaxLayerBackground,
  ParallaxLayerElements,
  ParallaxFloatingElement,
  type ParallaxScrollViewProps,
  type ParallaxLayer,
} from './examples/ParallaxScrollView';

// ===== RE-EXPORT COMMONLY USED REANIMATED UTILITIES =====
export {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useDerivedValue,
  useAnimatedReaction,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withDecay,
  withRepeat,
  interpolate,
  Extrapolation,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';

export {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

// ===== HELPER UTILITIES =====

/**
 * Create a spring animation with predefined config
 */
export const createSpringAnimation = (
  value: number,
  config: 'bouncy' | 'gentle' | 'stiff' | 'default' = 'default'
) => {
  return withSpring(value, SPRING_CONFIG[config.toUpperCase() as keyof typeof SPRING_CONFIG]);
};

/**
 * Create a timing animation with predefined duration
 */
export const createTimingAnimation = (
  value: number,
  duration: 'fast' | 'normal' | 'slow' = 'normal'
) => {
  return withTiming(value, { 
    duration: ANIMATION_DURATION[duration.toUpperCase() as keyof typeof ANIMATION_DURATION] 
  });
};

/**
 * Create a staggered animation sequence
 */
export const createStaggeredAnimation = (
  animations: Array<() => void>,
  staggerDelay: number = LAYOUT_ANIMATION.STAGGER_DELAY
) => {
  animations.forEach((animation, index) => {
    setTimeout(animation, index * staggerDelay);
  });
};

/**
 * Interpolate with common easing patterns
 */
export const interpolateWithEasing = (
  value: number,
  inputRange: number[],
  outputRange: number[],
  easing: 'easeOut' | 'easeInOut' | 'bounce' | 'linear' = 'easeOut'
) => {
  const easingConfig = INTERPOLATION_CONFIG[
    `EASE_${easing.toUpperCase().replace('EASE', '')}` as keyof typeof INTERPOLATION_CONFIG
  ] || INTERPOLATION_CONFIG.EASE_OUT;
  
  return interpolate(value, inputRange, outputRange, {
    extrapolateLeft: Extrapolation.CLAMP,
    extrapolateRight: Extrapolation.CLAMP,
    ...easingConfig,
  });
};

/**
 * Check if reduced motion is preferred (accessibility)
 */
export const shouldReduceMotion = async (): Promise<boolean> => {
  try {
    const { AccessibilityInfo } = require('react-native');
    return await AccessibilityInfo.isReduceMotionEnabled();
  } catch {
    return false;
  }
};

/**
 * Haptic feedback helper
 */
export const triggerHapticFeedback = (
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'
) => {
  try {
    const { HapticFeedback } = require('expo-haptics');
    
    const feedbackMap = {
      light: HapticFeedback.ImpactFeedbackStyle.Light,
      medium: HapticFeedback.ImpactFeedbackStyle.Medium,
      heavy: HapticFeedback.ImpactFeedbackStyle.Heavy,
      success: HapticFeedback.NotificationFeedbackType.Success,
      warning: HapticFeedback.NotificationFeedbackType.Warning,
      error: HapticFeedback.NotificationFeedbackType.Error,
    };

    if (type in ['success', 'warning', 'error']) {
      HapticFeedback.notificationAsync(feedbackMap[type]);
    } else {
      HapticFeedback.impactAsync(feedbackMap[type]);
    }
  } catch {
    // Fallback to React Native's Vibration API
    try {
      const { Vibration } = require('react-native');
      const vibrationMap = {
        light: 10,
        medium: 20,
        heavy: 40,
        success: [10, 50, 10],
        warning: [50, 50, 50],
        error: [100],
      };
      
      Vibration.vibrate(vibrationMap[type]);
    } catch {
      // Ignore if haptics/vibration not available
    }
  }
};