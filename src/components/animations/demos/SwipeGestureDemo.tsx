/**
 * Swipe Gesture Demo Component
 * 
 * Demonstrates advanced swipe gesture patterns including:
 * - Swipe to delete with threshold
 * - Velocity-based flinging
 * - Swipe to reveal actions
 * - Multi-directional swipe handling
 */

import React, { useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
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
import { Button } from '../../form/Button';
import { Card } from '../../layout/Card';
import { useCurrentTheme } from '../../../theme';
import { useVelocityGesture } from '../hooks/useAnimationHooks';
import { GESTURE_THRESHOLDS, SPRING_CONFIG } from '../constants';

const { width: screenWidth } = Dimensions.get('window');

interface SwipeGestureDemoProps {
  title?: string;
}

interface SwipeToDeleteItemProps {
  title: string;
  subtitle: string;
  onDelete: () => void;
}

interface SwipeToRevealProps {
  title: string;
  subtitle: string;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const SwipeToDeleteItem: React.FC<SwipeToDeleteItemProps> = ({ title, subtitle, onDelete }) => {
  const theme = useCurrentTheme();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const height = useSharedValue(80);
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow left swipe (negative translation)
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      const shouldDelete = event.translationX < -GESTURE_THRESHOLDS.DISMISS_DISTANCE;
      
      if (shouldDelete) {
        // Animate out and delete
        translateX.value = withTiming(-screenWidth, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 });
        height.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(onDelete)();
          }
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
      }
    });

  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    height: height.value,
  }));

  const deleteButtonStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-GESTURE_THRESHOLDS.DISMISS_DISTANCE, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: progress }],
    };
  });

  return (
    <Box style={styles.swipeContainer}>
      <Animated.View style={[styles.deleteBackground, deleteButtonStyle]}>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View style={itemStyle}>
          <Card padding="md" style={styles.swipeItem}>
            <Text variant="heading" size="medium" style={styles.itemTitle}>
              {title}
            </Text>
            <Text variant="body" size="small" style={{ color: theme.colors.text.secondary }}>
              {subtitle}
            </Text>
          </Card>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

const SwipeToRevealItem: React.FC<SwipeToRevealProps> = ({
  title,
  subtitle,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const theme = useCurrentTheme();
  const translateX = useSharedValue(0);
  const REVEAL_WIDTH = 180;
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow both left and right swipe
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const translation = event.translationX;
      
      if (Math.abs(velocity) > GESTURE_THRESHOLDS.SWIPE_VELOCITY) {
        // High velocity - snap to reveal or close
        if (velocity > 0 && translation > 50) {
          // Right swipe - reveal left actions
          translateX.value = withSpring(REVEAL_WIDTH, SPRING_CONFIG.GENTLE);
        } else if (velocity < 0 && translation < -50) {
          // Left swipe - reveal right actions
          translateX.value = withSpring(-REVEAL_WIDTH, SPRING_CONFIG.GENTLE);
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
        }
      } else {
        // Low velocity - threshold-based
        if (translation > REVEAL_WIDTH / 2) {
          translateX.value = withSpring(REVEAL_WIDTH, SPRING_CONFIG.GENTLE);
        } else if (translation < -REVEAL_WIDTH / 2) {
          translateX.value = withSpring(-REVEAL_WIDTH, SPRING_CONFIG.GENTLE);
        } else {
          translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
        }
      }
    });

  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionsStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [0, REVEAL_WIDTH],
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
      [-REVEAL_WIDTH, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: 0.8 + (progress * 0.2) }],
    };
  });

  const handleAction = (action: () => void) => {
    translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
    setTimeout(action, 200);
  };

  return (
    <Box style={styles.revealContainer}>
      <Animated.View style={[styles.leftActions, leftActionsStyle]}>
        <Button
          onPress={() => handleAction(onEdit)}
          variant="secondary"
          size="small"
          style={styles.actionButton}
        >
          Edit
        </Button>
      </Animated.View>

      <Animated.View style={[styles.rightActions, rightActionsStyle]}>
        <Button
          onPress={() => handleAction(onArchive)}
          variant="secondary"
          size="small"
          style={[styles.actionButton, styles.archiveButton]}
        >
          Archive
        </Button>
        <Button
          onPress={() => handleAction(onDelete)}
          variant="primary"
          size="small"
          style={[styles.actionButton, styles.deleteButton]}
        >
          Delete
        </Button>
      </Animated.View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View style={itemStyle}>
          <Card padding="md" style={styles.revealItem}>
            <Text variant="heading" size="medium" style={styles.itemTitle}>
              {title}
            </Text>
            <Text variant="body" size="small" style={styles.itemSubtitle}>
              {subtitle}
            </Text>
          </Card>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

const VelocityFlingDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const { gesture, animatedStyle, reset } = useVelocityGesture([-200, 200]);

  return (
    <Box style={styles.flingContainer}>
      <Text variant="body" size="small" style={{ color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 16 }}>
        Pan the card and release with velocity to see momentum-based movement
      </Text>
      
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.flingCard, animatedStyle]}>
          <Card padding="lg" style={styles.flingCardInner}>
            <Text style={styles.flingText}>
              Drag me with velocity!
            </Text>
          </Card>
        </Animated.View>
      </GestureDetector>
      
      <Button
        onPress={reset}
        variant="secondary"
        size="small"
        style={styles.resetButton}
      >
        Reset Position
      </Button>
    </Box>
  );
};

export const SwipeGestureDemo: React.FC<SwipeGestureDemoProps> = ({
  title = "Swipe Gesture Patterns",
}) => {
  const theme = useCurrentTheme();
  const [items, setItems] = useState([
    { id: 1, title: 'Important Email', subtitle: 'Swipe left to delete' },
    { id: 2, title: 'Meeting Reminder', subtitle: 'Swipe left to delete' },
    { id: 3, title: 'Task Update', subtitle: 'Swipe left to delete' },
  ]);

  const [revealItems, setRevealItems] = useState([
    { id: 1, title: 'Project Document', subtitle: 'Swipe to reveal actions' },
    { id: 2, title: 'Team Meeting', subtitle: 'Swipe to reveal actions' },
    { id: 3, title: 'Code Review', subtitle: 'Swipe to reveal actions' },
  ]);

  const handleDelete = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
    Alert.alert('Deleted', 'Item has been deleted');
  };

  const handleEdit = () => Alert.alert('Edit', 'Edit action triggered');
  const handleArchive = () => Alert.alert('Archive', 'Archive action triggered');
  const handleRevealDelete = () => Alert.alert('Delete', 'Delete action triggered');

  return (
    <Box padding="lg" style={styles.container}>
      <Text variant="heading" size="large" style={styles.title}>
        {title}
      </Text>
      
      <Text variant="body" size="medium" style={[styles.description, { color: theme.colors.text.secondary }]}>
        Advanced swipe gesture interactions with velocity detection and multiple action reveals.
      </Text>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Swipe to Delete
        </Text>
        <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
          Swipe left past the threshold to delete items
        </Text>
        
        {items.map(item => (
          <SwipeToDeleteItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Swipe to Reveal Actions
        </Text>
        <Text variant="body" size="small" style={[styles.sectionSubtitle, { color: theme.colors.text.secondary }]}>
          Swipe left or right to reveal different actions
        </Text>
        
        {revealItems.map(item => (
          <SwipeToRevealItem
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            onEdit={handleEdit}
            onArchive={handleArchive}
            onDelete={handleRevealDelete}
          />
        ))}
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Velocity-Based Fling
        </Text>
        <VelocityFlingDemo />
      </Box>

      <Text variant="caption" style={[styles.note, { color: theme.colors.text.tertiary }]}>
        Swipe gestures provide intuitive ways to access contextual actions and manage content.
      </Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  sectionSubtitle: {
    marginBottom: 16,
    lineHeight: 18,
  },
  swipeContainer: {
    position: 'relative',
    marginBottom: 12,
    height: 80,
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  swipeItem: {
    height: 80,
    justifyContent: 'center',
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  revealContainer: {
    position: 'relative',
    marginBottom: 12,
    height: 80,
  },
  leftActions: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 180,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  rightActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  actionButton: {
    marginHorizontal: 4,
    minWidth: 60,
  },
  archiveButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  revealItem: {
    height: 80,
    justifyContent: 'center',
  },
  itemSubtitle: {
    opacity: 0.7,
  },
  flingContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  flingCard: {
    marginBottom: 20,
  },
  flingCardInner: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flingText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 8,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});