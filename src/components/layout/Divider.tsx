import React from 'react';
import { ViewStyle, DimensionValue } from 'react-native';
import { useCurrentTheme, SpacingToken } from '../../theme';
import { Box } from '../base/Box';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: 'primary' | 'secondary' | 'focus' | 'error' | string;
  margin?: SpacingToken | number;
  marginHorizontal?: SpacingToken | number;
  marginVertical?: SpacingToken | number;
  marginTop?: SpacingToken | number;
  marginBottom?: SpacingToken | number;
  marginLeft?: SpacingToken | number;
  marginRight?: SpacingToken | number;
  length?: DimensionValue;
  style?: ViewStyle;
}

const getBorderColor = (color: string | undefined, theme: any): string => {
  if (!color) return theme.colors.border.primary;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.border[color as keyof typeof theme.colors.border] || color;
};

const getSpacingValue = (value: SpacingToken | number | undefined, theme: any): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return theme.spacing[value];
};

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 1,
  color,
  margin,
  marginHorizontal,
  marginVertical,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  length,
  style,
}) => {
  const theme = useCurrentTheme();

  const isHorizontal = orientation === 'horizontal';
  
  const dividerStyle: ViewStyle = {
    backgroundColor: getBorderColor(color, theme),
    margin: getSpacingValue(margin, theme),
    marginHorizontal: getSpacingValue(marginHorizontal, theme),
    marginVertical: getSpacingValue(marginVertical, theme),
    marginTop: getSpacingValue(marginTop, theme),
    marginBottom: getSpacingValue(marginBottom, theme),
    marginLeft: getSpacingValue(marginLeft, theme),
    marginRight: getSpacingValue(marginRight, theme),
  };

  if (isHorizontal) {
    dividerStyle.height = thickness;
    dividerStyle.width = length || '100%';
  } else {
    dividerStyle.width = thickness;
    dividerStyle.height = length || '100%';
  }

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(dividerStyle).filter(([_, value]) => value !== undefined)
  );

  const finalStyle = [cleanStyle, style].filter(Boolean) as ViewStyle[];

  return <Box style={finalStyle} />;
};