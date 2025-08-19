import React from 'react';
import { ViewStyle } from 'react-native';
import { useCurrentTheme, SpacingToken } from '../../theme';
import { Pressable } from '../base/Pressable';
import { Box } from '../base/Box';

export interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'small' | 'medium' | 'large' | 'extraLarge';
  padding?: SpacingToken | number;
  paddingHorizontal?: SpacingToken | number;
  paddingVertical?: SpacingToken | number;
  margin?: SpacingToken | number;
  marginTop?: SpacingToken | number;
  marginRight?: SpacingToken | number;
  marginBottom?: SpacingToken | number;
  marginLeft?: SpacingToken | number;
  marginHorizontal?: SpacingToken | number;
  marginVertical?: SpacingToken | number;
  backgroundColor?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | string;
  borderRadius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
  borderColor?: 'primary' | 'secondary' | 'focus' | 'error' | string;
  borderWidth?: number;
  pressable?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const getElevationStyle = (elevation: CardProps['elevation'], theme: any): ViewStyle => {
  if (!elevation || elevation === 'none') return {};
  return theme.shadows[elevation] || {};
};

const getBackgroundColor = (color: string | undefined, theme: any): string => {
  if (!color) return theme.colors.surface.primary;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.surface[color as keyof typeof theme.colors.surface] || color;
};

const getBorderColor = (color: string | undefined, theme: any): string | undefined => {
  if (!color) return undefined;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.border[color as keyof typeof theme.colors.border];
};

const getBorderRadius = (radius: CardProps['borderRadius'], theme: any): number => {
  if (radius === undefined) return theme.borderRadius.lg;
  if (typeof radius === 'number') return radius;
  return theme.borderRadius[radius];
};

const getSpacingValue = (value: SpacingToken | number | undefined, theme: any): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return theme.spacing[value];
};

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 'small',
  padding = 'md',
  paddingHorizontal,
  paddingVertical,
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  marginHorizontal,
  marginVertical,
  backgroundColor,
  borderRadius,
  borderColor,
  borderWidth,
  pressable = false,
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useCurrentTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(backgroundColor, theme),
    borderRadius: getBorderRadius(borderRadius, theme),
    borderColor: getBorderColor(borderColor, theme),
    borderWidth,
    padding: getSpacingValue(padding, theme),
    paddingHorizontal: getSpacingValue(paddingHorizontal, theme),
    paddingVertical: getSpacingValue(paddingVertical, theme),
    margin: getSpacingValue(margin, theme),
    marginTop: getSpacingValue(marginTop, theme),
    marginRight: getSpacingValue(marginRight, theme),
    marginBottom: getSpacingValue(marginBottom, theme),
    marginLeft: getSpacingValue(marginLeft, theme),
    marginHorizontal: getSpacingValue(marginHorizontal, theme),
    marginVertical: getSpacingValue(marginVertical, theme),
    ...getElevationStyle(elevation, theme),
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(cardStyle).filter(([_, value]) => value !== undefined)
  );

  const finalStyle = [cleanStyle, style].filter(Boolean) as ViewStyle[];

  if (pressable) {
    return (
      <Pressable
        style={finalStyle}
        onPress={onPress}
        disabled={disabled}
        animateScale={!disabled}
        scaleValue={0.98}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <Box style={finalStyle}>
      {children}
    </Box>
  );
};