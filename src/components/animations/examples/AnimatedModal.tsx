/**
 * Production-Ready Animated Modal
 * 
 * A fully-featured animated modal component with:
 * - Multiple animation types (scale, slide, fade)
 * - Backdrop blur effects
 * - Gesture dismiss support
 * - Keyboard handling
 * - Accessibility features
 * - Portal rendering
 */

import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, Modal, Dimensions, Pressable, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { Button } from '../../form/Button';
import { useCurrentTheme } from '../../../theme';
import { useKeyboardAnimation, useReducedMotion } from '../hooks/useAnimationHooks';
import { MODAL_ANIMATION, SPRING_CONFIG, ANIMATION_DURATION, GESTURE_THRESHOLDS } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export type ModalAnimationType = 'scale' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'fade';

export interface AnimatedModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: ModalAnimationType;
  backdrop?: boolean;
  backdropColor?: string;
  backdropOpacity?: number;
  blurBackdrop?: boolean;
  dismissOnBackdrop?: boolean;
  dismissOnBackButton?: boolean;
  gestureEnabled?: boolean;
  title?: string;
  showCloseButton?: boolean;
  closeButtonPosition?: 'left' | 'right';
  keyboardAvoidingView?: boolean;
  style?: any;
  contentStyle?: any;
  overlayStyle?: any;
}

export interface AnimatedModalRef {
  show: () => void;
  hide: () => void;
}

export const AnimatedModal = forwardRef<AnimatedModalRef, AnimatedModalProps>(({
  visible,
  onClose,
  children,
  animationType = 'scale',
  backdrop = true,
  backdropColor = 'rgba(0, 0, 0, 0.5)',
  backdropOpacity = MODAL_ANIMATION.BACKDROP_OPACITY,
  blurBackdrop = false,
  dismissOnBackdrop = true,
  dismissOnBackButton = true,
  gestureEnabled = true,
  title,
  showCloseButton = true,
  closeButtonPosition = 'right',
  keyboardAvoidingView = true,
  style,
  contentStyle,
  overlayStyle,
}, ref) => {
  const theme = useCurrentTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { keyboardStyle } = useKeyboardAnimation();
  
  const backdropOpacityValue = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(MODAL_ANIMATION.SCALE_FROM);
  const contentTranslateX = useSharedValue(0);
  const contentTranslateY = useSharedValue(0);
  const isVisible = useSharedValue(false);
  const isAnimating = useSharedValue(false);

  const backHandlerRef = useRef<any>();

  // Initialize animation values based on type
  const initializeAnimation = useCallback(() => {
    contentOpacity.value = 0;
    backdropOpacityValue.value = 0;
    
    switch (animationType) {
      case 'scale':
        contentScale.value = MODAL_ANIMATION.SCALE_FROM;
        contentTranslateX.value = 0;
        contentTranslateY.value = 0;
        break;
      case 'slideUp':
        contentScale.value = 1;
        contentTranslateX.value = 0;
        contentTranslateY.value = screenHeight;
        break;
      case 'slideDown':
        contentScale.value = 1;
        contentTranslateX.value = 0;
        contentTranslateY.value = -screenHeight;
        break;
      case 'slideLeft':
        contentScale.value = 1;
        contentTranslateX.value = screenWidth;
        contentTranslateY.value = 0;
        break;
      case 'slideRight':
        contentScale.value = 1;
        contentTranslateX.value = -screenWidth;
        contentTranslateY.value = 0;
        break;
      case 'fade':
        contentScale.value = 1;
        contentTranslateX.value = 0;
        contentTranslateY.value = 0;
        break;
    }
  }, [animationType]);

  const show = useCallback(() => {
    if (isAnimating.value) return;
    
    isAnimating.value = true;
    isVisible.value = true;

    if (reduceMotion) {
      backdropOpacityValue.value = 1;
      contentOpacity.value = 1;
      contentScale.value = 1;
      contentTranslateX.value = 0;
      contentTranslateY.value = 0;
      isAnimating.value = false;
      return;
    }

    // Animate backdrop
    backdropOpacityValue.value = withTiming(1, { duration: ANIMATION_DURATION.FAST });

    // Animate content based on type
    const springConfig = SPRING_CONFIG.GENTLE;
    const timingConfig = { duration: ANIMATION_DURATION.NORMAL };

    switch (animationType) {
      case 'scale':
        contentOpacity.value = withTiming(1, timingConfig);
        contentScale.value = withSpring(1, springConfig, (finished) => {
          if (finished) isAnimating.value = false;
        });
        break;
      case 'slideUp':
      case 'slideDown':
      case 'slideLeft':
      case 'slideRight':
        contentOpacity.value = withTiming(1, { duration: ANIMATION_DURATION.FAST });
        contentTranslateX.value = withSpring(0, springConfig);
        contentTranslateY.value = withSpring(0, springConfig, (finished) => {
          if (finished) isAnimating.value = false;
        });
        break;
      case 'fade':
        contentOpacity.value = withTiming(1, timingConfig, (finished) => {
          if (finished) isAnimating.value = false;
        });
        break;
    }
  }, [animationType, reduceMotion]);

  const hide = useCallback(() => {
    if (isAnimating.value) return;
    
    isAnimating.value = true;

    // Call onClose immediately to hide modal
    onClose();

    const onComplete = () => {
      isVisible.value = false;
      isAnimating.value = false;
    };

    if (reduceMotion) {
      onComplete();
      return;
    }

    // Animate backdrop
    backdropOpacityValue.value = withTiming(0, { duration: ANIMATION_DURATION.FAST });

    // Animate content out
    const springConfig = SPRING_CONFIG.STIFF;
    const timingConfig = { duration: ANIMATION_DURATION.FAST };

    switch (animationType) {
      case 'scale':
        contentOpacity.value = withTiming(0, timingConfig);
        contentScale.value = withSpring(MODAL_ANIMATION.SCALE_FROM, springConfig, onComplete);
        break;
      case 'slideUp':
        contentTranslateY.value = withSpring(screenHeight, springConfig, onComplete);
        break;
      case 'slideDown':
        contentTranslateY.value = withSpring(-screenHeight, springConfig, onComplete);
        break;
      case 'slideLeft':
        contentTranslateX.value = withSpring(screenWidth, springConfig, onComplete);
        break;
      case 'slideRight':
        contentTranslateX.value = withSpring(-screenWidth, springConfig, onComplete);
        break;
      case 'fade':
        contentOpacity.value = withTiming(0, timingConfig, onComplete);
        break;
    }
  }, [animationType, onClose, reduceMotion]);

  // Gesture handling for swipe to dismiss
  const panGesture = Gesture.Pan()
    .enabled(gestureEnabled && !isAnimating.value)
    .onUpdate((event) => {
      const { translationY, translationX } = event;
      
      // Only allow dismissive gestures based on animation type
      switch (animationType) {
        case 'slideUp':
          if (translationY > 0) {
            contentTranslateY.value = translationY;
            const progress = Math.min(translationY / screenHeight, 1);
            backdropOpacityValue.value = 1 - progress;
          }
          break;
        case 'slideDown':
          if (translationY < 0) {
            contentTranslateY.value = translationY;
            const progress = Math.min(Math.abs(translationY) / screenHeight, 1);
            backdropOpacityValue.value = 1 - progress;
          }
          break;
        case 'slideLeft':
          if (translationX > 0) {
            contentTranslateX.value = translationX;
            const progress = Math.min(translationX / screenWidth, 1);
            backdropOpacityValue.value = 1 - progress;
          }
          break;
        case 'slideRight':
          if (translationX < 0) {
            contentTranslateX.value = translationX;
            const progress = Math.min(Math.abs(translationX) / screenWidth, 1);
            backdropOpacityValue.value = 1 - progress;
          }
          break;
      }
    })
    .onEnd((event) => {
      const { translationY, translationX, velocityY, velocityX } = event;
      const threshold = 150;
      const velocityThreshold = 500;
      
      let shouldDismiss = false;
      
      switch (animationType) {
        case 'slideUp':
          shouldDismiss = translationY > threshold || velocityY > velocityThreshold;
          break;
        case 'slideDown':
          shouldDismiss = translationY < -threshold || velocityY < -velocityThreshold;
          break;
        case 'slideLeft':
          shouldDismiss = translationX > threshold || velocityX > velocityThreshold;
          break;
        case 'slideRight':
          shouldDismiss = translationX < -threshold || velocityX < -velocityThreshold;
          break;
      }
      
      if (shouldDismiss) {
        runOnJS(hide)();
      } else {
        // Snap back
        contentTranslateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
        contentTranslateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
        backdropOpacityValue.value = withSpring(1, SPRING_CONFIG.GENTLE);
      }
    });

  // Handle back button on Android
  useEffect(() => {
    if (visible && dismissOnBackButton) {
      backHandlerRef.current = BackHandler.addEventListener('hardwareBackPress', () => {
        hide();
        return true;
      });
    }
    
    return () => {
      backHandlerRef.current?.remove();
    };
  }, [visible, dismissOnBackButton, hide]);

  // Initialize and show/hide modal
  useEffect(() => {
    if (visible) {
      initializeAnimation();
      setTimeout(() => show(), 50); // Small delay for initialization
    } else if (isVisible.value) {
      hide();
    }
  }, [visible]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacityValue.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateX: contentTranslateX.value },
      { translateY: contentTranslateY.value },
      { scale: contentScale.value },
    ],
  }));

  // Immediately return null when parent says not visible - this prevents blocking
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={dismissOnBackButton ? hide : undefined}
    >
      <Box style={[styles.overlay, overlayStyle]} pointerEvents={!visible ? "none" : "auto"}>
        {/* Backdrop */}
        {backdrop && (
          <Animated.View style={[styles.backdrop, { backgroundColor: backdropColor }, backdropStyle]}>
            {dismissOnBackdrop && visible && (
              <Pressable style={StyleSheet.absoluteFill} onPress={hide} />
            )}
          </Animated.View>
        )}

        {/* Content Container */}
        <Box 
          style={[
            styles.contentContainer,
            keyboardAvoidingView && keyboardStyle,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
            style
          ]}
          pointerEvents={!visible ? "none" : "box-none"}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.content, contentAnimatedStyle, contentStyle]}>
              {/* Header */}
              {(title || showCloseButton) && (
                <Box style={styles.header}>
                  {closeButtonPosition === 'left' && showCloseButton && (
                    <Button onPress={hide} variant="ghost" size="small" style={styles.closeButton}>
                      ✕
                    </Button>
                  )}
                  
                  {title && (
                    <Text variant="heading" size="medium" style={styles.title}>
                      {title}
                    </Text>
                  )}
                  
                  {closeButtonPosition === 'right' && showCloseButton && (
                    <Button onPress={hide} variant="ghost" size="small" style={styles.closeButton}>
                      ✕
                    </Button>
                  )}
                </Box>
              )}

              {/* Content */}
              <Box style={styles.body}>
                {children}
              </Box>
            </Animated.View>
          </GestureDetector>
        </Box>
      </Box>
    </Modal>
  );
});

AnimatedModal.displayName = 'AnimatedModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxWidth: '100%',
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    minHeight: 32,
    paddingHorizontal: 0,
  },
  body: {
    padding: 20,
    flex: 1,
  },
});