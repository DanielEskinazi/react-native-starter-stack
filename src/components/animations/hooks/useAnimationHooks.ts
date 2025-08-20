/**
 * Animation Hooks
 * 
 * Reusable animation hooks based on the animation specification.
 * These hooks provide consistent animation behaviors throughout the app.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Dimensions, Keyboard } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useDerivedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withDecay,
  interpolate,
  Extrapolation,
  SharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { ANIMATION_DURATION, SPRING_CONFIG, SCALE_VALUES, GESTURE_THRESHOLDS } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Press animation hook for consistent press feedback
 */
export const usePressAnimation = (scaleValue = SCALE_VALUES?.PRESS_SCALE || 0.95) => {
  console.log('[usePressAnimation] Hook called with scaleValue:', scaleValue);
  
  let scale;
  try {
    scale = useSharedValue(1);
    console.log('[usePressAnimation] Shared value initialized successfully');
  } catch (error) {
    console.error('[usePressAnimation] Error initializing shared value:', error);
    throw new Error(`Failed to initialize press animation: ${error.message}`);
  }
  
  const animatedStyle = useAnimatedStyle(() => {
    try {
      const currentScale = scale?.value || 1;
      console.log('[usePressAnimation] Animated style update, scale:', currentScale);
      return {
        transform: [{ scale: currentScale }]
      };
    } catch (error) {
      console.error('[usePressAnimation] Error in animated style:', error);
      return {
        transform: [{ scale: 1 }] // Fallback
      };
    }
  });
  
  const handlePressIn = useCallback(() => {
    try {
      console.log('[usePressAnimation] Press in, scaling to:', scaleValue);
      if (scale) {
        scale.value = withSpring(scaleValue, {
          duration: 100,
          ...SPRING_CONFIG?.STIFF || { damping: 20, stiffness: 200 },
        });
        console.log('[usePressAnimation] Press in animation started');
      }
    } catch (error) {
      console.error('[usePressAnimation] Error in handlePressIn:', error);
    }
  }, [scaleValue, scale]);

  const handlePressOut = useCallback(() => {
    try {
      console.log('[usePressAnimation] Press out, scaling to: 1');
      if (scale) {
        scale.value = withSpring(1, {
          duration: 100,
          ...SPRING_CONFIG?.STIFF || { damping: 20, stiffness: 200 },
        });
        console.log('[usePressAnimation] Press out animation started');
      }
    } catch (error) {
      console.error('[usePressAnimation] Error in handlePressOut:', error);
    }
  }, [scale]);

  const handlePress = useCallback((callback?: () => void) => {
    try {
      console.log('[usePressAnimation] Handle press called with callback:', !!callback);
      if (scale) {
        console.log('[usePressAnimation] Starting press sequence animation');
        // Start the animation but don't wait for it to complete
        scale.value = withSequence(
          withSpring(scaleValue, { 
            duration: 100, 
            ...SPRING_CONFIG?.STIFF || { damping: 20, stiffness: 200 }
          }),
          withSpring(1, { 
            duration: 100, 
            ...SPRING_CONFIG?.STIFF || { damping: 20, stiffness: 200 }
          })
        );
        
        // Call the callback immediately instead of waiting for animation
        if (callback) {
          console.log('[usePressAnimation] Calling callback immediately');
          setTimeout(callback, 0); // Use setTimeout to avoid any sync issues
        }
      } else {
        console.warn('[usePressAnimation] Scale value not available, calling callback directly');
        if (callback) {
          callback();
        }
      }
    } catch (error) {
      console.error('[usePressAnimation] Error in handlePress:', error);
      // Fallback: just call the callback
      if (callback) {
        try {
          callback();
        } catch (callbackError) {
          console.error('[usePressAnimation] Error in fallback callback:', callbackError);
        }
      }
    }
  }, [scaleValue, scale]);
  
  const result = { animatedStyle, handlePressIn, handlePressOut, handlePress };
  console.log('[usePressAnimation] Returning hook result:', {
    hasAnimatedStyle: !!result.animatedStyle,
    hasHandlePressIn: !!result.handlePressIn,
    hasHandlePressOut: !!result.handlePressOut,
    hasHandlePress: !!result.handlePress,
  });
  
  return result;
};

/**
 * Fade in animation hook with optional delay for staggered animations
 */
export const useFadeIn = (delay = 0, duration = ANIMATION_DURATION.NORMAL) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration }));
  }, [delay, duration]);
  
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};

/**
 * Slide in animation hook from specified direction
 */
export const useSlideIn = (
  direction: 'top' | 'bottom' | 'left' | 'right' = 'bottom',
  delay = 0,
  distance = 100
) => {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'top' ? -distance : direction === 'bottom' ? distance : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
    translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
    opacity.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION.NORMAL }));
  }, [delay, distance]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
  }));
};

/**
 * Scroll-driven animation hook with parallax and fade effects
 */
export const useScrollAnimation = () => {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const createParallaxStyle = useCallback((speed = 0.5) => {
    return useAnimatedStyle(() => ({
      transform: [{ translateY: -scrollY.value * speed }],
    }));
  }, [scrollY]);
  
  const createFadeStyle = useCallback((startY = 0, endY = 100) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value,
        [startY, endY],
        [1, 0],
        Extrapolation.CLAMP
      ),
    }));
  }, [scrollY]);

  const createScaleStyle = useCallback((startY = 0, endY = 100, scaleRange = [1, 1.1]) => {
    return useAnimatedStyle(() => ({
      transform: [{
        scale: interpolate(
          scrollY.value,
          [startY, endY],
          scaleRange,
          Extrapolation.CLAMP
        )
      }],
    }));
  }, [scrollY]);
  
  return { scrollHandler, createParallaxStyle, createFadeStyle, createScaleStyle, scrollY };
};

/**
 * Velocity-aware gesture hook for momentum-based interactions
 */
export const useVelocityGesture = (clampRange = [-screenWidth, screenWidth]) => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const shouldFling = Math.abs(velocity) > GESTURE_THRESHOLDS.SWIPE_VELOCITY;
      
      if (shouldFling) {
        translateX.value = withDecay({
          velocity: velocity,
          clamp: clampRange,
          deceleration: 0.998,
        });
      } else {
        translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  const reset = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
  }, []);
  
  return { gesture, animatedStyle, reset, translateX };
};

/**
 * Keyboard-aware animation hook for form inputs
 */
export const useKeyboardAnimation = () => {
  const keyboardHeight = useSharedValue(0);
  
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (event) => {
      keyboardHeight.value = withSpring(event.endCoordinates.height, SPRING_CONFIG.GENTLE);
    });
    
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = withSpring(0, SPRING_CONFIG.GENTLE);
    });
    
    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);
  
  const keyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));
  
  return { keyboardStyle, keyboardHeight };
};

/**
 * Reduced motion accessibility hook
 */
export const useReducedMotion = () => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  
  useEffect(() => {
    console.log('[useReducedMotion] Hook effect started');
    
    const checkReducedMotion = async () => {
      try {
        console.log('[useReducedMotion] Checking reduced motion setting');
        if (AccessibilityInfo?.isReduceMotionEnabled) {
          const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
          console.log('[useReducedMotion] Reduced motion enabled:', isEnabled);
          setIsReducedMotionEnabled(isEnabled);
        } else {
          console.warn('[useReducedMotion] AccessibilityInfo.isReduceMotionEnabled not available');
          setIsReducedMotionEnabled(false);
        }
      } catch (error) {
        console.error('[useReducedMotion] Error checking reduced motion:', error);
        setIsReducedMotionEnabled(false);
      }
    };
    
    checkReducedMotion();
    
    let subscription;
    try {
      if (AccessibilityInfo?.addEventListener) {
        subscription = AccessibilityInfo.addEventListener(
          'reduceMotionChanged',
          (enabled) => {
            console.log('[useReducedMotion] Motion setting changed:', enabled);
            setIsReducedMotionEnabled(enabled);
          }
        );
        console.log('[useReducedMotion] Event listener added');
      } else {
        console.warn('[useReducedMotion] AccessibilityInfo.addEventListener not available');
      }
    } catch (error) {
      console.error('[useReducedMotion] Error adding event listener:', error);
    }
    
    return () => {
      try {
        if (subscription?.remove) {
          subscription.remove();
          console.log('[useReducedMotion] Event listener removed');
        }
      } catch (error) {
        console.error('[useReducedMotion] Error removing event listener:', error);
      }
    };
  }, []);
  
  console.log('[useReducedMotion] Returning reduced motion state:', isReducedMotionEnabled);
  return isReducedMotionEnabled;
};

/**
 * Loading animation hook with various patterns
 */
export const useLoadingAnimation = (type: 'pulse' | 'fade' | 'scale' = 'pulse') => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const isAnimating = useSharedValue(false);

  const startAnimation = useCallback(() => {
    isAnimating.value = true;
    
    if (type === 'pulse') {
      opacity.value = withSequence(
        withTiming(0.5, { duration: 600 }),
        withTiming(1, { duration: 600 })
      );
    } else if (type === 'scale') {
      scale.value = withSequence(
        withSpring(0.95, SPRING_CONFIG.GENTLE),
        withSpring(1, SPRING_CONFIG.GENTLE)
      );
    } else if (type === 'fade') {
      opacity.value = withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      );
    }
  }, [type]);

  const stopAnimation = useCallback(() => {
    isAnimating.value = false;
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, startAnimation, stopAnimation };
};

/**
 * Multi-gesture hook for combined pan and pinch interactions
 */
export const useMultiGesture = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
      translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = Math.min(
        Math.max(baseScale.value * event.scale, SCALE_VALUES.PINCH_MIN),
        SCALE_VALUES.PINCH_MAX
      );
    })
    .onEnd(() => {
      const targetScale = scale.value > 1.5 ? 2 : scale.value < 0.8 ? 1 : 1;
      scale.value = withSpring(targetScale, SPRING_CONFIG.GENTLE);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const reset = useCallback(() => {
    translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
    translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
    scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
  }, []);

  return { composedGesture, animatedStyle, reset };
};