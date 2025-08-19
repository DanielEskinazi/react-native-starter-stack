import React from 'react';
import { ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useCurrentTheme } from '../../theme';
import { Pressable } from '../base/Pressable';
import { Text } from '../base/Text';
import { Box } from '../base/Box';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const getButtonStyles = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  disabled: boolean,
  theme: any
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Size styles
  const sizeStyles: Record<NonNullable<ButtonProps['size']>, ViewStyle> = {
    small: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: 32,
    },
    medium: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
    },
    large: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      minHeight: 52,
    },
  };

  // Variant styles
  const variantStyles: Record<NonNullable<ButtonProps['variant']>, ViewStyle> = {
    primary: {
      backgroundColor: disabled
        ? theme.colors.colors.neutral[300]
        : theme.colors.colors.primary[500],
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: disabled
        ? theme.colors.background.secondary
        : theme.colors.background.secondary,
      borderWidth: 1,
      borderColor: disabled
        ? theme.colors.border.primary
        : theme.colors.colors.primary[500],
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size || 'medium'],
    ...variantStyles[variant || 'primary'],
  };
};

const getTextStyles = (
  variant: ButtonProps['variant'],
  size: ButtonProps['size'],
  disabled: boolean,
  theme: any
): TextStyle => {
  const baseStyle: TextStyle = {
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  };

  // Size styles
  const sizeStyles: Record<NonNullable<ButtonProps['size']>, TextStyle> = {
    small: {
      fontSize: theme.typography.fontSize.sm,
      lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
    },
    medium: {
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    },
    large: {
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    },
  };

  // Variant styles
  const variantStyles: Record<NonNullable<ButtonProps['variant']>, TextStyle> = {
    primary: {
      color: disabled
        ? theme.colors.text.tertiary
        : '#FFFFFF',
    },
    secondary: {
      color: disabled
        ? theme.colors.text.tertiary
        : theme.colors.colors.primary[500],
    },
    ghost: {
      color: disabled
        ? theme.colors.text.tertiary
        : theme.colors.colors.primary[500],
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size || 'medium'],
    ...variantStyles[variant || 'primary'],
  };
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const theme = useCurrentTheme();
  const isDisabled = disabled || loading;

  const buttonStyles = getButtonStyles(variant, size, isDisabled, theme);
  const textStyles = getTextStyles(variant, size, isDisabled, theme);

  const handlePress = () => {
    if (!isDisabled && onPress) {
      onPress();
    }
  };

  const combinedStyles = [
    buttonStyles,
    fullWidth && { width: '100%' as const },
    style,
  ].filter(Boolean) as ViewStyle[];

  const combinedTextStyles = [textStyles, textStyle].filter(Boolean) as TextStyle[];

  return (
    <Pressable
      style={combinedStyles}
      onPress={handlePress}
      disabled={isDisabled}
      animateScale={!isDisabled}
    >
      <Box flexDirection="row" alignItems="center" justifyContent="center">
        {loading && (
          <ActivityIndicator
            size="small"
            color={textStyles.color as string}
            style={{ marginRight: theme.spacing.xs }}
          />
        )}
        <Text style={combinedTextStyles}>
          {children}
        </Text>
      </Box>
    </Pressable>
  );
};