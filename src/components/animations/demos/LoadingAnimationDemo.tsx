/**
 * Loading Animation Demo Component
 * 
 * Demonstrates various loading animation patterns including:
 * - Pulse animations
 * - Skeleton loading
 * - Spinner variations
 * - Progress indicators
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  interpolate,
  Extrapolation,
  cancelAnimation,
} from 'react-native-reanimated';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { Button } from '../../form/Button';
import { useCurrentTheme } from '../../../theme';
import { useLoadingAnimation } from '../hooks/useAnimationHooks';
import { LOADING_ANIMATION, ANIMATION_DURATION } from '../constants';

interface LoadingAnimationDemoProps {
  title?: string;
}

const PulseLoader: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useCurrentTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(LOADING_ANIMATION.SKELETON_OPACITY_MIN, { duration: LOADING_ANIMATION.PULSE_DURATION }),
          withTiming(LOADING_ANIMATION.SKELETON_OPACITY_MAX, { duration: LOADING_ANIMATION.PULSE_DURATION })
        ),
        -1,
        true
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.pulseLoader,
        { backgroundColor: theme.colors.colors.primary[500] },
        animatedStyle,
      ]}
    >
      <Text style={{ color: '#FFFFFF' }}>Pulse Loading...</Text>
    </Animated.View>
  );
};

const SkeletonLoader: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useCurrentTheme();
  const shimmerPosition = useSharedValue(-200);

  useEffect(() => {
    if (isActive) {
      shimmerPosition.value = withRepeat(
        withTiming(200, { duration: 1500 }),
        -1,
        false
      );
    } else {
      cancelAnimation(shimmerPosition);
      shimmerPosition.value = -200;
    }
  }, [isActive]);

  const shimmerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerPosition.value,
      [-200, -100, 0, 100, 200],
      [0, 0.5, 1, 0.5, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX: shimmerPosition.value }],
      opacity,
    };
  });

  return (
    <Box style={styles.skeletonContainer}>
      <View style={[styles.skeletonItem, { backgroundColor: theme.colors.colors.neutral[200] }]}>
        <Animated.View
          style={[
            styles.shimmer,
            { backgroundColor: theme.colors.colors.neutral[100] },
            shimmerStyle,
          ]}
        />
      </View>
      <View style={[styles.skeletonItem, { backgroundColor: theme.colors.colors.neutral[200], width: '80%' }]}>
        <Animated.View
          style={[
            styles.shimmer,
            { backgroundColor: theme.colors.colors.neutral[100] },
            shimmerStyle,
          ]}
        />
      </View>
      <View style={[styles.skeletonItem, { backgroundColor: theme.colors.colors.neutral[200], width: '60%' }]}>
        <Animated.View
          style={[
            styles.shimmer,
            { backgroundColor: theme.colors.colors.neutral[100] },
            shimmerStyle,
          ]}
        />
      </View>
    </Box>
  );
};

const ScaleLoader: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useCurrentTheme();
  const { animatedStyle, startAnimation, stopAnimation } = useLoadingAnimation('scale');

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        startAnimation();
      }, 1200);
      startAnimation();
      return () => clearInterval(interval);
    } else {
      stopAnimation();
    }
  }, [isActive, startAnimation, stopAnimation]);

  return (
    <Animated.View
      style={[
        styles.scaleLoader,
        { backgroundColor: theme.colors.colors.secondary[500] },
        animatedStyle,
      ]}
    >
      <Text style={{ color: '#FFFFFF' }}>Scale Loading</Text>
    </Animated.View>
  );
};

const ProgressBar: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useCurrentTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      cancelAnimation(progress);
      progress.value = withTiming(0, { duration: 200 });
    }
  }, [isActive]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const percentageStyle = useAnimatedStyle(() => ({
    opacity: progress.value > 0 ? 1 : 0,
  }));

  return (
    <Box style={styles.progressContainer}>
      <Animated.Text 
        style={[
          styles.progressText, 
          { color: theme.colors.text.primary }, 
          percentageStyle
        ]}
      >
        {Math.round(progress.value * 100)}%
      </Animated.Text>
      <View style={[styles.progressTrack, { backgroundColor: theme.colors.colors.neutral[200] }]}>
        <Animated.View
          style={[
            styles.progressFill,
            { backgroundColor: theme.colors.colors.success[500] },
            progressStyle,
          ]}
        />
      </View>
    </Box>
  );
};

const DotsLoader: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const theme = useCurrentTheme();
  const dot1 = useSharedValue(1);
  const dot2 = useSharedValue(1);
  const dot3 = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      const animateDots = () => {
        dot1.value = withSequence(
          withTiming(0.4, { duration: 400 }),
          withTiming(1, { duration: 400 })
        );
        setTimeout(() => {
          dot2.value = withSequence(
            withTiming(0.4, { duration: 400 }),
            withTiming(1, { duration: 400 })
          );
        }, 200);
        setTimeout(() => {
          dot3.value = withSequence(
            withTiming(0.4, { duration: 400 }),
            withTiming(1, { duration: 400 })
          );
        }, 400);
      };

      animateDots();
      const interval = setInterval(animateDots, 1200);
      return () => clearInterval(interval);
    } else {
      cancelAnimation(dot1);
      cancelAnimation(dot2);
      cancelAnimation(dot3);
      dot1.value = withTiming(1);
      dot2.value = withTiming(1);
      dot3.value = withTiming(1);
    }
  }, [isActive]);

  const dot1Style = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const dot2Style = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const dot3Style = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <Box style={styles.dotsContainer}>
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.colors.primary[500] }, dot1Style]} />
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.colors.primary[500] }, dot2Style]} />
      <Animated.View style={[styles.dot, { backgroundColor: theme.colors.colors.primary[500] }, dot3Style]} />
    </Box>
  );
};

export const LoadingAnimationDemo: React.FC<LoadingAnimationDemoProps> = ({
  title = "Loading Animation Patterns",
}) => {
  const theme = useCurrentTheme();
  const [activeLoaders, setActiveLoaders] = useState<Record<string, boolean>>({});

  const toggleLoader = (key: string) => {
    setActiveLoaders(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Box padding="lg" style={styles.container}>
      <Text variant="heading" size="large" style={styles.title}>
        {title}
      </Text>
      
      <Text variant="body" size="medium" style={[styles.description, { color: theme.colors.text.secondary }]}>
        Various loading animation patterns for different use cases and contexts.
      </Text>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Pulse Animation
        </Text>
        <PulseLoader isActive={activeLoaders.pulse || false} />
        <Button
          onPress={() => toggleLoader('pulse')}
          variant={activeLoaders.pulse ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.pulse ? 'Stop' : 'Start'} Pulse
        </Button>
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Skeleton Loading
        </Text>
        <SkeletonLoader isActive={activeLoaders.skeleton || false} />
        <Button
          onPress={() => toggleLoader('skeleton')}
          variant={activeLoaders.skeleton ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.skeleton ? 'Stop' : 'Start'} Skeleton
        </Button>
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Scale Animation
        </Text>
        <ScaleLoader isActive={activeLoaders.scale || false} />
        <Button
          onPress={() => toggleLoader('scale')}
          variant={activeLoaders.scale ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.scale ? 'Stop' : 'Start'} Scale
        </Button>
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Progress Bar
        </Text>
        <ProgressBar isActive={activeLoaders.progress || false} />
        <Button
          onPress={() => toggleLoader('progress')}
          variant={activeLoaders.progress ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.progress ? 'Stop' : 'Start'} Progress
        </Button>
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Dots Animation
        </Text>
        <DotsLoader isActive={activeLoaders.dots || false} />
        <Button
          onPress={() => toggleLoader('dots')}
          variant={activeLoaders.dots ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.dots ? 'Stop' : 'Start'} Dots
        </Button>
      </Box>

      <Box style={styles.section}>
        <Text variant="heading" size="medium" style={styles.sectionTitle}>
          Native Spinner
        </Text>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.colors.primary[500]}
            animating={activeLoaders.spinner || false}
          />
        </View>
        <Button
          onPress={() => toggleLoader('spinner')}
          variant={activeLoaders.spinner ? 'secondary' : 'primary'}
          size="small"
          style={styles.toggleButton}
        >
          {activeLoaders.spinner ? 'Stop' : 'Start'} Spinner
        </Button>
      </Box>
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
    marginBottom: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  pulseLoader: {
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonContainer: {
    padding: 16,
  },
  skeletonItem: {
    height: 16,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
  },
  scaleLoader: {
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  spinnerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});