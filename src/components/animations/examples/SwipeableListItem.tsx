/**
 * Production-Ready Swipeable List Item
 * 
 * A fully-featured swipeable list item component that can be used in production apps.
 * Features:
 * - Swipe to delete with confirmation
 * - Multiple action reveals (edit, archive, delete)
 * - Haptic feedback integration
 * - Accessibility support
 * - Customizable actions and styling
 */

import React, { useCallback } from 'react';
import { StyleSheet, Dimensions, Vibration, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDecay,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { Card } from '../../layout/Card';
import { useCurrentTheme } from '../../../theme';
import { useReducedMotion } from '../hooks/useAnimationHooks';
import { GESTURE_THRESHOLDS, SPRING_CONFIG, ANIMATION_DURATION } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

export interface SwipeAction {
  id: string;
  label: string;
  color: string;
  backgroundColor: string;
  icon?: string;
  onPress: () => void;
}

export interface SwipeableListItemProps {
  id: string;
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onDelete?: () => void;
  deleteThreshold?: number;
  actionThreshold?: number;
  disabled?: boolean;
  haptics?: boolean;
  confirmDelete?: boolean;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  style?: any;
  contentContainerStyle?: any;
}

export const SwipeableListItem: React.FC<SwipeableListItemProps> = ({
  id,
  children,
  leftActions = [],
  rightActions = [],
  onDelete,
  deleteThreshold = GESTURE_THRESHOLDS.DISMISS_DISTANCE,
  actionThreshold = 80,
  disabled = false,
  haptics = true,
  confirmDelete = true,
  deleteConfirmTitle = 'Delete Item',
  deleteConfirmMessage = 'Are you sure you want to delete this item?',
  style,
  contentContainerStyle,
}) => {
  const theme = useCurrentTheme();
  const reduceMotion = useReducedMotion();
  
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const height = useSharedValue('auto');
  const isDeleting = useSharedValue(false);
  const hasTriggeredHaptic = useSharedValue(false);

  const triggerHaptic = useCallback(() => {
    if (haptics && !hasTriggeredHaptic.value) {
      hasTriggeredHaptic.value = true;
      Vibration.vibrate(50);
      // Reset haptic flag after a delay
      setTimeout(() => {
        hasTriggeredHaptic.value = false;
      }, 200);
    }
  }, [haptics]);

  const handleDelete = useCallback(() => {
    if (!onDelete) return;

    const performDelete = () => {
      isDeleting.value = true;
      
      if (reduceMotion) {
        onDelete();
        return;
      }

      // Animate out
      translateX.value = withTiming(-screenWidth, { duration: ANIMATION_DURATION.FAST });
      opacity.value = withTiming(0, { duration: ANIMATION_DURATION.FAST });
      height.value = withTiming(0, { duration: ANIMATION_DURATION.NORMAL }, (finished) => {
        if (finished) {
          runOnJS(onDelete)();
        }
      });
    };

    if (confirmDelete) {
      Alert.alert(
        deleteConfirmTitle,
        deleteConfirmMessage,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
            },
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    } else {
      performDelete();
    }
  }, [onDelete, confirmDelete, deleteConfirmTitle, deleteConfirmMessage, reduceMotion]);

  const handleActionPress = useCallback((action: SwipeAction) => {
    // Reset position first
    translateX.value = withSpring(0, SPRING_CONFIG.GENTLE, () => {
      runOnJS(action.onPress)();
    });
  }, []);

  const gesture = Gesture.Pan()
    .enabled(!disabled && !isDeleting.value)
    .onUpdate((event) => {
      const translation = event.translationX;
      
      // Determine swipe direction and available actions
      const hasLeftActions = leftActions.length > 0;
      const hasRightActions = rightActions.length > 0 || !!onDelete;
      
      // Apply constraints based on available actions
      if (translation > 0 && hasLeftActions) {
        translateX.value = Math.min(translation, leftActions.length * actionThreshold + 20);
      } else if (translation < 0 && hasRightActions) {
        translateX.value = Math.max(translation, -(rightActions.length * actionThreshold + deleteThreshold));
      } else {
        // Allow slight movement even without actions for better UX
        translateX.value = translation * 0.1;
      }

      // Trigger haptic feedback at delete threshold
      if (onDelete && translation < -deleteThreshold) {
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      const translation = event.translationX;
      const velocity = event.velocityX;
      const absTranslation = Math.abs(translation);
      const isHighVelocity = Math.abs(velocity) > GESTURE_THRESHOLDS.SWIPE_VELOCITY;

      // Handle delete gesture
      if (onDelete && translation < -deleteThreshold && !isHighVelocity) {
        runOnJS(handleDelete)();
        return;
      }

      // Handle action reveals
      if (translation > actionThreshold && leftActions.length > 0) {
        const maxReveal = leftActions.length * actionThreshold;
        translateX.value = withSpring(
          isHighVelocity && velocity > 0 ? maxReveal : maxReveal,
          SPRING_CONFIG.GENTLE
        );
      } else if (translation < -actionThreshold && rightActions.length > 0) {
        const maxReveal = -(rightActions.length * actionThreshold);
        translateX.value = withSpring(
          isHighVelocity && velocity < 0 ? maxReveal : maxReveal,
          SPRING_CONFIG.GENTLE
        );
      } else if (isHighVelocity) {
        // High velocity fling
        translateX.value = withDecay({
          velocity: velocity,
          clamp: [
            -(rightActions.length * actionThreshold + deleteThreshold),
            leftActions.length * actionThreshold + 20,
          ],
          deceleration: 0.995,
        });
      } else {
        // Snap back to center
        translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    height: height.value,
  }));

  const leftActionsStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [0, actionThreshold],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: 0.8 + (progress * 0.2) }],
    };
  });

  const rightActionsStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-actionThreshold, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: 0.8 + (progress * 0.2) }],
    };
  });

  const deleteIndicatorStyle = useAnimatedStyle(() => {
    if (!onDelete) return { opacity: 0 };
    
    const progress = interpolate(
      translateX.value,
      [-deleteThreshold, -actionThreshold],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: 0.8 + (progress * 0.2) }],
    };
  });

  return (
    <Box style={[styles.container, style]}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <Animated.View style={[styles.actionsContainer, styles.leftActions, leftActionsStyle]}>
          {leftActions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={[
                styles.actionButton,
                { backgroundColor: action.backgroundColor },
                { width: actionThreshold },
              ]}
            >
              <Text
                style={[styles.actionText, { color: action.color }]}
                onPress={() => handleActionPress(action)}
              >
                {action.icon && <Text style={styles.actionIcon}>{action.icon}</Text>}
                {action.label}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <Animated.View style={[styles.actionsContainer, styles.rightActions, rightActionsStyle]}>
          {rightActions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={[
                styles.actionButton,
                { backgroundColor: action.backgroundColor },
                { width: actionThreshold },
              ]}
            >
              <Text
                style={[styles.actionText, { color: action.color }]}
                onPress={() => handleActionPress(action)}
              >
                {action.icon && <Text style={styles.actionIcon}>{action.icon}</Text>}
                {action.label}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Delete Indicator */}
      {onDelete && (
        <Animated.View style={[styles.deleteIndicator, deleteIndicatorStyle]}>
          <Text style={styles.deleteText}>🗑️ Delete</Text>
        </Animated.View>
      )}

      {/* Main Content */}
      <GestureDetector gesture={gesture}>
        <Animated.View 
          style={containerStyle}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Swipeable item"
          accessibilityHint={
            leftActions.length > 0 || rightActions.length > 0
              ? "Swipe left or right to reveal actions"
              : onDelete
              ? "Swipe left to delete"
              : undefined
          }
        >
          <Card style={[styles.content, contentContainerStyle]}>
            {children}
          </Card>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 4,
  },
  content: {
    backgroundColor: '#FFFFFF',
    minHeight: 60,
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftActions: {
    left: 0,
    paddingLeft: 8,
  },
  rightActions: {
    right: 0,
    paddingRight: 8,
  },
  actionButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  actionIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  deleteIndicator: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});