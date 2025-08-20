/**
 * Multi-Touch Demo Component
 * 
 * Demonstrates advanced multi-touch gesture patterns including:
 * - Simultaneous pan and pinch gestures
 * - Rotation with multi-finger support
 * - Complex gesture combinations
 * - Interactive photo viewer experience
 */

import React, { useState } from 'react';
import { StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
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
import { useMultiGesture } from '../hooks/useAnimationHooks';
import { SPRING_CONFIG, SCALE_VALUES } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MultiTouchDemoProps {
  title?: string;
}

const PhotoViewer: React.FC = () => {
  const theme = useCurrentTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const baseScale = useSharedValue(1);
  const baseRotation = useSharedValue(0);
  const [gestureInfo, setGestureInfo] = useState('📱 Use pinch, pan, and rotation gestures');

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setGestureInfo)('👆 Panning...');
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      runOnJS(setGestureInfo)('✅ Pan completed');
      // Boundary checking
      const maxTranslateX = (screenWidth * (scale.value - 1)) / 2;
      const maxTranslateY = (screenHeight * (scale.value - 1)) / 2;
      
      translateX.value = withSpring(
        Math.max(-maxTranslateX, Math.min(maxTranslateX, translateX.value)),
        SPRING_CONFIG.GENTLE
      );
      translateY.value = withSpring(
        Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY.value)),
        SPRING_CONFIG.GENTLE
      );
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
      runOnJS(setGestureInfo)('🤏 Pinching...');
    })
    .onUpdate((event) => {
      scale.value = Math.min(
        Math.max(baseScale.value * event.scale, SCALE_VALUES.PINCH_MIN),
        SCALE_VALUES.PINCH_MAX
      );
    })
    .onEnd(() => {
      runOnJS(setGestureInfo)('✅ Pinch completed');
      // Snap to specific scale levels
      if (scale.value < 0.8) {
        scale.value = withSpring(0.5, SPRING_CONFIG.GENTLE);
      } else if (scale.value > 2.5) {
        scale.value = withSpring(3, SPRING_CONFIG.GENTLE);
      } else if (scale.value < 1.2 && scale.value > 0.8) {
        scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
        // Reset position when returning to normal scale
        translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
        translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
      }
    });

  const rotationGesture = Gesture.Rotation()
    .onStart(() => {
      baseRotation.value = rotation.value;
      runOnJS(setGestureInfo)('🔄 Rotating...');
    })
    .onUpdate((event) => {
      rotation.value = baseRotation.value + event.rotation;
    })
    .onEnd(() => {
      runOnJS(setGestureInfo)('✅ Rotation completed');
      // Snap to 90-degree increments
      const snapAngle = Math.round(rotation.value / (Math.PI / 2)) * (Math.PI / 2);
      rotation.value = withSpring(snapAngle, SPRING_CONFIG.GENTLE);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(setGestureInfo)('👆👆 Double tap detected');
      if (scale.value > 1) {
        // Reset to normal
        scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
        translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
        translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
        rotation.value = withSpring(0, SPRING_CONFIG.GENTLE);
      } else {
        // Zoom in
        scale.value = withSpring(2, SPRING_CONFIG.GENTLE);
      }
    });

  const composedGesture = Gesture.Simultaneous(
    Gesture.Simultaneous(panGesture, pinchGesture, rotationGesture),
    doubleTapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const reset = () => {
    translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
    translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
    scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
    rotation.value = withSpring(0, SPRING_CONFIG.GENTLE);
    setGestureInfo('📱 Use pinch, pan, and rotation gestures');
  };

  return (
    <Box style={styles.photoViewerContainer}>
      <Text variant="body" size="small" style={[styles.gestureInfo, { color: theme.colors.colors.primary[500] }]}>
        {gestureInfo}
      </Text>
      
      <Box style={styles.photoContainer}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.photo, animatedStyle]}>
            <Box style={[styles.photoPlaceholder, { backgroundColor: theme.colors.colors.primary[100] }]}>
              <Text style={[styles.photoText, { color: theme.colors.colors.primary[700] }]}>
                🖼️ Photo
              </Text>
              <Text style={[styles.photoSubtext, { color: theme.colors.colors.primary[600] }]}>
                Pan • Pinch • Rotate{'\n'}Double tap to zoom
              </Text>
            </Box>
          </Animated.View>
        </GestureDetector>
      </Box>
      
      <Button onPress={reset} variant="secondary" size="small" style={styles.resetButton}>
        Reset View
      </Button>
    </Box>
  );
};

const InteractiveCard: React.FC = () => {
  const theme = useCurrentTheme();
  const { composedGesture, animatedStyle, reset } = useMultiGesture();
  const [interactionCount, setInteractionCount] = useState(0);

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1);
  };

  return (
    <Box style={styles.interactiveContainer}>
      <Text variant="body" size="small" style={[styles.interactionCounter, { color: theme.colors.text.secondary }]}>
        Interactions: {interactionCount}
      </Text>
      
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.interactiveCard, animatedStyle]}>
          <Card padding="lg" style={styles.cardContent}>
            <Text style={styles.cardTitle}>Interactive Card</Text>
            <Text style={[styles.cardSubtitle, { color: theme.colors.text.secondary }]}>
              Pan and pinch to interact
            </Text>
            <Box style={styles.cardStats}>
              <Text style={styles.statText}>Scale: {Math.round((1) * 100) / 100}</Text>
              <Text style={styles.statText}>Position: Dynamic</Text>
            </Box>
          </Card>
        </Animated.View>
      </GestureDetector>
      
      <Button
        onPress={() => {
          reset();
          handleInteraction();
        }}
        variant="secondary"
        size="small"
        style={styles.resetButton}
      >
        Reset Card
      </Button>
    </Box>
  );
};

const GesturePlayground: React.FC = () => {
  const theme = useCurrentTheme();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);
  const [activeGestures, setActiveGestures] = useState<string[]>([]);

  const addGesture = (gesture: string) => {
    setActiveGestures(prev => [...prev.filter(g => g !== gesture), gesture]);
  };

  const removeGesture = (gesture: string) => {
    setActiveGestures(prev => prev.filter(g => g !== gesture));
  };

  const panGesture = Gesture.Pan()
    .onStart(() => runOnJS(addGesture)('Pan'))
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      runOnJS(removeGesture)('Pan');
      translateX.value = withSpring(0, SPRING_CONFIG.GENTLE);
      translateY.value = withSpring(0, SPRING_CONFIG.GENTLE);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
      runOnJS(addGesture)('Pinch');
    })
    .onUpdate((event) => {
      scale.value = Math.min(
        Math.max(baseScale.value * event.scale, 0.5),
        2
      );
    })
    .onEnd(() => {
      runOnJS(removeGesture)('Pinch');
      scale.value = withSpring(1, SPRING_CONFIG.GENTLE);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => runOnJS(addGesture)('Long Press'))
    .onEnd(() => runOnJS(removeGesture)('Long Press'));

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(addGesture)('Tap');
      setTimeout(() => runOnJS(removeGesture)('Tap'), 300);
    });

  const composedGesture = Gesture.Simultaneous(
    Gesture.Simultaneous(panGesture, pinchGesture),
    longPressGesture,
    tapGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Box style={styles.playgroundContainer}>
      <Text variant="body" size="small" style={[styles.playgroundTitle, { color: theme.colors.text.secondary }]}>
        Multi-Gesture Detection Playground
      </Text>
      
      <Box style={styles.activeGestures}>
        {activeGestures.map((gesture, index) => (
          <Box
            key={`${gesture}-${index}`}
            style={[styles.gestureTag, { backgroundColor: theme.colors.colors.success[100] }]}
          >
            <Text style={[styles.gestureTagText, { color: theme.colors.colors.success[700] }]}>
              {gesture}
            </Text>
          </Box>
        ))}
      </Box>
      
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.playgroundTarget, animatedStyle]}>
          <Box style={[styles.targetInner, { backgroundColor: theme.colors.colors.warning[500] }]}>
            <Text style={styles.targetText}>
              🎯 Gesture Target
            </Text>
            <Text style={styles.targetSubtext}>
              Try different gestures
            </Text>
          </Box>
        </Animated.View>
      </GestureDetector>
    </Box>
  );
};

export const MultiTouchDemo: React.FC<MultiTouchDemoProps> = ({
  title = "Multi-Touch Gesture Patterns",
}) => {
  const theme = useCurrentTheme();

  return (
    <Box padding="lg" style={styles.container}>
      <Text variant="heading" size="large" style={styles.title}>
        {title}
      </Text>
      
      <Text variant="body" size="medium" style={[styles.description, { color: theme.colors.text.secondary }]}>
        Advanced multi-touch interactions combining pan, pinch, rotation, and tap gestures for rich user experiences.
      </Text>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Photo Viewer Experience
        </Text>
        <PhotoViewer />
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Interactive Card
        </Text>
        <InteractiveCard />
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Gesture Detection
        </Text>
        <GesturePlayground />
      </Box>

      <Text variant="caption" style={[styles.note, { color: theme.colors.text.tertiary }]}>
        Multi-touch gestures enable intuitive manipulation of content, similar to native photo and map applications.
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
    marginBottom: 40,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  photoViewerContainer: {
    alignItems: 'center',
  },
  gestureInfo: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
    minHeight: 20,
  },
  photoContainer: {
    width: 300,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photo: {
    width: 300,
    height: 200,
  },
  photoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  photoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  photoSubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18,
  },
  interactiveContainer: {
    alignItems: 'center',
  },
  interactionCounter: {
    marginBottom: 16,
    fontSize: 14,
  },
  interactiveCard: {
    marginBottom: 16,
  },
  cardContent: {
    width: 250,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  playgroundContainer: {
    alignItems: 'center',
  },
  playgroundTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  activeGestures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: 32,
  },
  gestureTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 2,
  },
  gestureTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  playgroundTarget: {
    marginBottom: 16,
  },
  targetInner: {
    width: 200,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  targetSubtext: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
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