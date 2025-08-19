import React from 'react';
import { View, ViewStyle, StyleSheet, DimensionValue } from 'react-native';
import { useCurrentTheme, SpacingToken } from '../../theme';

export interface BoxProps {
  children?: React.ReactNode;
  padding?: SpacingToken | number;
  paddingTop?: SpacingToken | number;
  paddingRight?: SpacingToken | number;
  paddingBottom?: SpacingToken | number;
  paddingLeft?: SpacingToken | number;
  paddingHorizontal?: SpacingToken | number;
  paddingVertical?: SpacingToken | number;
  margin?: SpacingToken | number;
  marginTop?: SpacingToken | number;
  marginRight?: SpacingToken | number;
  marginBottom?: SpacingToken | number;
  marginLeft?: SpacingToken | number;
  marginHorizontal?: SpacingToken | number;
  marginVertical?: SpacingToken | number;
  backgroundColor?: 'primary' | 'secondary' | 'tertiary' | 'elevated' | 'overlay' | string;
  borderColor?: 'primary' | 'secondary' | 'focus' | 'error' | string;
  borderWidth?: number;
  borderRadius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
  flex?: number;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: DimensionValue;
  height?: DimensionValue;
  minWidth?: DimensionValue;
  minHeight?: DimensionValue;
  maxWidth?: DimensionValue;
  maxHeight?: DimensionValue;
  overflow?: 'visible' | 'hidden' | 'scroll';
  opacity?: number;
  style?: ViewStyle;
}

const getSpacingValue = (value: SpacingToken | number | undefined, theme: any): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return theme.spacing[value];
};

const getBackgroundColor = (color: string | undefined, theme: any): string | undefined => {
  if (!color) return undefined;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.background[color as keyof typeof theme.colors.background];
};

const getBorderColor = (color: string | undefined, theme: any): string | undefined => {
  if (!color) return undefined;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.border[color as keyof typeof theme.colors.border];
};

const getBorderRadius = (radius: BoxProps['borderRadius'], theme: any): number | undefined => {
  if (radius === undefined) return undefined;
  if (typeof radius === 'number') return radius;
  return theme.borderRadius[radius];
};

export const Box: React.FC<BoxProps> = ({
  children,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
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
  borderColor,
  borderWidth,
  borderRadius,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  alignSelf,
  position,
  top,
  right,
  bottom,
  left,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  overflow,
  opacity,
  style,
  ...props
}) => {
  const theme = useCurrentTheme();

  const boxStyle: ViewStyle = {
    // Padding
    padding: getSpacingValue(padding, theme),
    paddingTop: getSpacingValue(paddingTop, theme),
    paddingRight: getSpacingValue(paddingRight, theme),
    paddingBottom: getSpacingValue(paddingBottom, theme),
    paddingLeft: getSpacingValue(paddingLeft, theme),
    paddingHorizontal: getSpacingValue(paddingHorizontal, theme),
    paddingVertical: getSpacingValue(paddingVertical, theme),
    
    // Margin
    margin: getSpacingValue(margin, theme),
    marginTop: getSpacingValue(marginTop, theme),
    marginRight: getSpacingValue(marginRight, theme),
    marginBottom: getSpacingValue(marginBottom, theme),
    marginLeft: getSpacingValue(marginLeft, theme),
    marginHorizontal: getSpacingValue(marginHorizontal, theme),
    marginVertical: getSpacingValue(marginVertical, theme),
    
    // Background and borders
    backgroundColor: getBackgroundColor(backgroundColor, theme),
    borderColor: getBorderColor(borderColor, theme),
    borderWidth,
    borderRadius: getBorderRadius(borderRadius, theme),
    
    // Layout
    flex,
    flexDirection,
    justifyContent,
    alignItems,
    alignSelf,
    position,
    top,
    right,
    bottom,
    left,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    overflow,
    opacity,
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(boxStyle).filter(([_, value]) => value !== undefined)
  );

  return (
    <View style={[cleanStyle, style]} {...props}>
      {children}
    </View>
  );
};