import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  runOnJS,
} from 'react-native-reanimated';
import { useCurrentTheme } from '../../theme';
import { Pressable } from '../base/Pressable';
import { Box } from '../base/Box';

export interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  thumbColor?: string;
  trackColor?: {
    false?: string;
    true?: string;
  };
  style?: ViewStyle;
}

const getSwitchDimensions = (size: SwitchProps['size']) => {
  const dimensions = {
    small: { width: 40, height: 24, thumbSize: 18 },
    medium: { width: 48, height: 28, thumbSize: 22 },
    large: { width: 56, height: 32, thumbSize: 26 },
  };
  
  return dimensions[size || 'medium'];
};

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  thumbColor,
  trackColor,
  style,
}) => {
  const theme = useCurrentTheme();
  const dimensions = getSwitchDimensions(size);
  
  const translateX = useSharedValue(value ? 1 : 0);
  const colorProgress = useSharedValue(value ? 1 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
    colorProgress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      [
        trackColor?.false || theme.colors.colors.neutral[300],
        trackColor?.true || theme.colors.colors.primary[500],
      ]
    );

    return {
      backgroundColor: disabled ? theme.colors.colors.neutral[200] : backgroundColor,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const maxTranslate = dimensions.width - dimensions.thumbSize - 4; // 4px padding
    const translateXValue = translateX.value * maxTranslate;

    return {
      transform: [{ translateX: translateXValue }],
    };
  });

  const handlePress = () => {
    if (disabled) return;
    
    const newValue = !value;
    if (onValueChange) {
      runOnJS(onValueChange)(newValue);
    }
  };

  const trackStyle: ViewStyle = {
    width: dimensions.width,
    height: dimensions.height,
    borderRadius: dimensions.height / 2,
    padding: 2,
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const thumbStyle: ViewStyle = {
    width: dimensions.thumbSize,
    height: dimensions.thumbSize,
    borderRadius: dimensions.thumbSize / 2,
    backgroundColor: thumbColor || '#FFFFFF',
    ...theme.shadows.small,
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      animateScale={false}
      style={style}
    >
      <Animated.View style={[trackStyle, trackAnimatedStyle]}>
        <Animated.View style={[thumbStyle, thumbAnimatedStyle]} />
      </Animated.View>
    </Pressable>
  );
};