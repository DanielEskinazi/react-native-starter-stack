/**
 * Component Library - Main Export
 * 
 * Comprehensive React Native component library built with theme system integration,
 * animations, and TypeScript support.
 * 
 * @example
 * import { Button, Input, Card, Screen } from '@/components';
 * 
 * function MyScreen() {
 *   return (
 *     <Screen>
 *       <Card padding="lg">
 *         <Input label="Email" placeholder="Enter email" />
 *         <Button onPress={() => {}}>Submit</Button>
 *       </Card>
 *     </Screen>
 *   );
 * }
 */

// ===== BASE COMPONENTS =====
export { Box } from './base/Box';
export { Text } from './base/Text';
export { Pressable } from './base/Pressable';

// ===== FORM COMPONENTS =====
export { Button } from './form/Button';
export { Input } from './form/Input';
export { Switch } from './form/Switch';

// ===== LAYOUT COMPONENTS =====
export { Screen } from './layout/Screen';
export { Card } from './layout/Card';
export { Divider } from './layout/Divider';

// ===== FEEDBACK COMPONENTS =====
export { Alert } from './feedback/Alert';
export { Spinner } from './feedback/Spinner';

// ===== ANIMATION COMPONENTS =====
export {
  // Animation constants and types
  ANIMATION_DURATION,
  SPRING_CONFIG,
  GESTURE_THRESHOLDS,
  INTERPOLATION_CONFIG,
  SCALE_VALUES,
  LAYOUT_ANIMATION,
  SCROLL_ANIMATION,
  LOADING_ANIMATION,
  MODAL_ANIMATION,
  
  // Animation hooks
  usePressAnimation,
  useFadeIn,
  useSlideIn,
  useScrollAnimation,
  useVelocityGesture,
  useKeyboardAnimation,
  useReducedMotion,
  useLoadingAnimation,
  useMultiGesture,
  
  // Demo components
  PressAnimationDemo,
  LoadingAnimationDemo,
  EntranceAnimationDemo,
  SwipeGestureDemo,
  MultiTouchDemo,
  LayoutAnimationDemo,
  
  // Production-ready examples
  SwipeableListItem,
  AnimatedModal,
  ParallaxScrollView,
  ParallaxLayerBackground,
  ParallaxLayerElements,
  ParallaxFloatingElement,
  
  // Reanimated utilities
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
  Gesture,
  GestureDetector,
  
  // Helper utilities
  createSpringAnimation,
  createTimingAnimation,
  createStaggeredAnimation,
  interpolateWithEasing,
  shouldReduceMotion,
  triggerHapticFeedback,
} from './animations';

// ===== COMPONENT PROP TYPES =====
export type { BoxProps } from './base/Box';
export type { TextProps } from './base/Text';
export type { PressableProps } from './base/Pressable';
export type { ButtonProps } from './form/Button';
export type { InputProps } from './form/Input';
export type { SwitchProps } from './form/Switch';
export type { ScreenProps } from './layout/Screen';
export type { CardProps } from './layout/Card';
export type { DividerProps } from './layout/Divider';
export type { AlertProps } from './feedback/Alert';
export type { SpinnerProps } from './feedback/Spinner';

// ===== ANIMATION COMPONENT TYPES =====
export type {
  AnimationDuration,
  SpringConfig,
  GestureThreshold,
  SwipeableListItemProps,
  SwipeAction,
  AnimatedModalProps,
  AnimatedModalRef,
  ModalAnimationType,
  ParallaxScrollViewProps,
  ParallaxLayer,
} from './animations';

// ===== RE-EXPORT THEME UTILITIES FOR COMPONENT USAGE =====
export {
  useTheme,
  useCurrentTheme,
  useThemeColors,
  useThemeTypography,
  useThemeSpacing,
  createThemedStyles,
  getThemeTokens,
} from '../theme';