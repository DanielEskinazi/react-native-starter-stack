import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { useCurrentTheme, TypographyVariantToken } from '../../theme';

export interface TextProps {
  children: React.ReactNode;
  variant?: TypographyVariantToken;
  color?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'link' | 'success' | 'warning' | 'error' | string;
  fontSize?: number;
  fontWeight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  lineHeight?: number;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  style?: TextStyle;
}

const getVariantStyle = (variant: TypographyVariantToken | undefined, theme: any): TextStyle => {
  if (!variant) return {};
  
  const [category, size] = variant.split('.') as [string, string?];
  
  if (!size && category in theme.typography.variants) {
    return theme.typography.variants[category as keyof typeof theme.typography.variants];
  }
  
  if (size && category in theme.typography.variants) {
    const categoryVariants = theme.typography.variants[category as keyof typeof theme.typography.variants];
    if (typeof categoryVariants === 'object' && size in categoryVariants) {
      return categoryVariants[size as keyof typeof categoryVariants];
    }
  }
  
  return {};
};

const getTextColor = (color: string | undefined, theme: any): string | undefined => {
  if (!color) return theme.colors.text.primary;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.text[color as keyof typeof theme.colors.text] || color;
};

const getFontWeight = (weight: TextProps['fontWeight'], theme: any): TextStyle['fontWeight'] | undefined => {
  if (!weight) return undefined;
  return theme.typography.fontWeight[weight];
};

export const Text: React.FC<TextProps> = ({
  children,
  variant,
  color,
  fontSize,
  fontWeight,
  textAlign,
  textTransform,
  lineHeight,
  numberOfLines,
  ellipsizeMode,
  selectable,
  style,
  ...props
}) => {
  const theme = useCurrentTheme();

  const variantStyle = getVariantStyle(variant, theme);
  
  const textStyle: TextStyle = {
    ...variantStyle,
    color: getTextColor(color, theme),
    fontSize: fontSize || variantStyle.fontSize,
    fontWeight: getFontWeight(fontWeight, theme) || variantStyle.fontWeight,
    textAlign,
    textTransform,
    lineHeight: lineHeight || variantStyle.lineHeight,
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(textStyle).filter(([_, value]) => value !== undefined)
  );

  return (
    <RNText
      style={[cleanStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      {...props}
    >
      {children}
    </RNText>
  );
};