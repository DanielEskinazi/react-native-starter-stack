/**
 * Entrance Animation Demo Component
 * 
 * Demonstrates various entrance animation patterns including:
 * - Slide in from different directions
 * - Fade in with staggered timing
 * - Scale entrance effects
 * - Combined entrance animations
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { Button } from '../../form/Button';
import { Card } from '../../layout/Card';
import { useCurrentTheme } from '../../../theme';
import { useFadeIn, useSlideIn } from '../hooks/useAnimationHooks';
import { ANIMATION_DURATION, SPRING_CONFIG } from '../constants';

interface EntranceAnimationDemoProps {
  title?: string;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  animationType?: 'slide' | 'fade' | 'scale' | 'combined';
  trigger?: boolean;
  onAnimationComplete?: () => void;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  direction = 'bottom',
  animationType = 'slide',
  trigger = true,
  onAnimationComplete,
}) => {
  const theme = useCurrentTheme();
  const translateX = useSharedValue(direction === 'left' ? -100 : direction === 'right' ? 100 : 0);
  const translateY = useSharedValue(direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (trigger) {
      const animateIn = () => {
        if (animationType === 'fade') {
          opacity.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION.NORMAL }));
        } else if (animationType === 'scale') {
          opacity.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION.FAST }));
          scale.value = withDelay(delay, withSpring(1, SPRING_CONFIG.BOUNCY));
        } else if (animationType === 'slide') {
          translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
          translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
          opacity.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION.NORMAL }));
        } else if (animationType === 'combined') {
          // Combined slide + scale + fade
          translateX.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
          translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIG.GENTLE));
          opacity.value = withDelay(delay, withTiming(1, { duration: ANIMATION_DURATION.NORMAL }));
          scale.value = withDelay(
            delay,
            withSpring(1, SPRING_CONFIG.BOUNCY, (finished) => {
              if (finished && onAnimationComplete) {
                runOnJS(onAnimationComplete)();
              }
            })
          );
        }
      };

      animateIn();
    } else {
      // Reset animation
      if (animationType === 'slide' || animationType === 'combined') {
        translateX.value = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
        translateY.value = direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0;
      }
      opacity.value = 0;
      scale.value = animationType === 'scale' || animationType === 'combined' ? 0.8 : 1;
    }
  }, [trigger, delay, direction, animationType, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Card padding="md" style={styles.demoCard}>
        {children}
      </Card>
    </Animated.View>
  );
};

const StaggeredList: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const items = ['First Item', 'Second Item', 'Third Item', 'Fourth Item', 'Fifth Item'];
  
  return (
    <Box>
      {items.map((item, index) => (
        <AnimatedCard
          key={item}
          delay={index * 100}
          direction="right"
          animationType="combined"
          trigger={trigger}
        >
          <Text style={styles.listItemText}>{item}</Text>
        </AnimatedCard>
      ))}
    </Box>
  );
};

const SequentialCards: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Loading...', 'Processing...', 'Almost done...', 'Complete!'];

  useEffect(() => {
    if (trigger) {
      setCurrentStep(0);
    }
  }, [trigger]);

  const handleStepComplete = () => {
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 500);
    }
  };

  return (
    <Box style={styles.sequentialContainer}>
      {steps.map((step, index) => (
        <AnimatedCard
          key={step}
          animationType="scale"
          trigger={trigger && index <= currentStep}
          onAnimationComplete={index === currentStep ? handleStepComplete : undefined}
        >
          <Text style={styles.stepText}>
            {step} {index < currentStep && '✓'}
          </Text>
        </AnimatedCard>
      ))}
    </Box>
  );
};

export const EntranceAnimationDemo: React.FC<EntranceAnimationDemoProps> = ({
  title = "Entrance Animation Patterns",
}) => {
  const theme = useCurrentTheme();
  const [triggers, setTriggers] = useState<Record<string, boolean>>({});

  const triggerAnimation = (key: string) => {
    setTriggers(prev => ({ ...prev, [key]: false }));
    setTimeout(() => {
      setTriggers(prev => ({ ...prev, [key]: true }));
    }, 100);
  };

  const triggerAll = () => {
    const allKeys = ['slideTop', 'slideBottom', 'slideLeft', 'slideRight', 'fade', 'scale', 'combined', 'staggered', 'sequential'];
    allKeys.forEach(key => {
      setTriggers(prev => ({ ...prev, [key]: false }));
    });
    
    setTimeout(() => {
      allKeys.forEach(key => {
        setTriggers(prev => ({ ...prev, [key]: true }));
      });
    }, 100);
  };

  return (
    <ScrollView style={styles.container}>
      <Box padding="lg">
        <Text variant="heading" size="large" style={styles.title}>
          {title}
        </Text>
        
        <Text variant="body" size="medium" style={[styles.description, { color: theme.colors.text.secondary }]}>
          Various entrance animation patterns for revealing content with smooth, delightful transitions.
        </Text>

        <Box style={styles.controlsSection}>
          <Button onPress={triggerAll} variant="primary" style={styles.triggerAllButton}>
            Trigger All Animations
          </Button>
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Slide Animations
          </Text>
          
          <Box style={styles.grid}>
            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('slideTop')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Slide from Top
              </Button>
              <AnimatedCard
                direction="top"
                animationType="slide"
                trigger={triggers.slideTop || false}
              >
                <Text>From Top</Text>
              </AnimatedCard>
            </Box>

            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('slideBottom')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Slide from Bottom
              </Button>
              <AnimatedCard
                direction="bottom"
                animationType="slide"
                trigger={triggers.slideBottom || false}
              >
                <Text>From Bottom</Text>
              </AnimatedCard>
            </Box>

            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('slideLeft')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Slide from Left
              </Button>
              <AnimatedCard
                direction="left"
                animationType="slide"
                trigger={triggers.slideLeft || false}
              >
                <Text>From Left</Text>
              </AnimatedCard>
            </Box>

            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('slideRight')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Slide from Right
              </Button>
              <AnimatedCard
                direction="right"
                animationType="slide"
                trigger={triggers.slideRight || false}
              >
                <Text>From Right</Text>
              </AnimatedCard>
            </Box>
          </Box>
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Other Entrance Types
          </Text>
          
          <Box style={styles.grid}>
            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('fade')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Fade In
              </Button>
              <AnimatedCard
                animationType="fade"
                trigger={triggers.fade || false}
              >
                <Text>Fade Effect</Text>
              </AnimatedCard>
            </Box>

            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('scale')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Scale In
              </Button>
              <AnimatedCard
                animationType="scale"
                trigger={triggers.scale || false}
              >
                <Text>Scale Effect</Text>
              </AnimatedCard>
            </Box>

            <Box style={styles.gridItem}>
              <Button
                onPress={() => triggerAnimation('combined')}
                variant="secondary"
                size="small"
                style={styles.triggerButton}
              >
                Combined Effect
              </Button>
              <AnimatedCard
                direction="bottom"
                animationType="combined"
                trigger={triggers.combined || false}
              >
                <Text>Slide + Scale + Fade</Text>
              </AnimatedCard>
            </Box>
          </Box>
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Staggered List Animation
          </Text>
          <Button
            onPress={() => triggerAnimation('staggered')}
            variant="secondary"
            size="small"
            style={styles.triggerButton}
          >
            Animate List
          </Button>
          <StaggeredList trigger={triggers.staggered || false} />
        </Box>

        <Box style={styles.section}>
          <Text variant="heading" size="medium" style={styles.sectionTitle}>
            Sequential Steps Animation
          </Text>
          <Button
            onPress={() => triggerAnimation('sequential')}
            variant="secondary"
            size="small"
            style={styles.triggerButton}
          >
            Start Sequence
          </Button>
          <SequentialCards trigger={triggers.sequential || false} />
        </Box>

        <Text variant="caption" style={[styles.note, { color: theme.colors.text.tertiary }]}>
          Entrance animations help establish hierarchy and guide user attention to important content.
        </Text>
      </Box>
    </ScrollView>
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
  controlsSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  triggerAllButton: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  triggerButton: {
    marginBottom: 8,
    width: '100%',
  },
  demoCard: {
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sequentialContainer: {
    marginTop: 12,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
});