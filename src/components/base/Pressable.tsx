import React from 'react';
import { Pressable as RNPressable, ViewStyle, PressableProps as RNPressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

export interface PressableProps extends Omit<RNPressableProps, 'style'> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  animateScale?: boolean;
  scaleValue?: number;
  style?: ViewStyle;
  pressedStyle?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export const Pressable: React.FC<PressableProps> = ({
  children,
  onPress,
  disabled = false,
  animateScale = true,
  scaleValue = 0.95,
  style,
  pressedStyle,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (animateScale && !disabled) {
      scale.value = withSpring(scaleValue, {
        duration: 150,
        dampingRatio: 0.8,
      });
    }
  };

  const handlePressOut = () => {
    if (animateScale && !disabled) {
      scale.value = withSpring(1, {
        duration: 150,
        dampingRatio: 0.8,
      });
    }
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (animateScale) {
      scale.value = withSequence(
        withSpring(scaleValue, { duration: 100, dampingRatio: 0.8 }),
        withSpring(1, { duration: 100, dampingRatio: 0.8 }, () => {
          if (onPress) {
            runOnJS(onPress)();
          }
        })
      );
    } else {
      onPress?.();
    }
  };

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPress={animateScale ? handlePress : onPress}
      onPressIn={animateScale ? handlePressIn : undefined}
      onPressOut={animateScale ? handlePressOut : undefined}
      disabled={disabled}
      {...props}
    >
      {({ pressed }) => (
        <Animated.View style={pressed && pressedStyle ? [pressedStyle] : undefined}>
          {children}
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};