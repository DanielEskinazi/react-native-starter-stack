import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useCurrentTheme } from '../../theme';
import { Box } from '../base/Box';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large' | number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | string;
  thickness?: number;
  style?: ViewStyle;
}

const getSpinnerSize = (size: SpinnerProps['size']): number => {
  if (typeof size === 'number') return size;
  
  const sizes = {
    small: 16,
    medium: 24,
    large: 32,
  };
  
  return sizes[size || 'medium'];
};

const getSpinnerColor = (color: string | undefined, theme: any): string => {
  if (!color) return theme.colors.colors.primary[500];
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.colors[color as keyof typeof theme.colors.colors]?.[500] || color;
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color,
  thickness = 2,
  style,
}) => {
  const theme = useCurrentTheme();
  const rotation = useSharedValue(0);
  
  const spinnerSize = getSpinnerSize(size);
  const spinnerColor = getSpinnerColor(color, theme);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const spinnerStyle: ViewStyle = {
    width: spinnerSize,
    height: spinnerSize,
    borderRadius: spinnerSize / 2,
    borderWidth: thickness,
    borderColor: `${spinnerColor}20`, // 20% opacity for background
    borderTopColor: spinnerColor,
  };

  return (
    <Box style={style}>
      <Animated.View style={[spinnerStyle, animatedStyle]} />
    </Box>
  );
};