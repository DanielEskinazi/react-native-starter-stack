import React, { useState, useRef } from 'react';
import { TextInput, TextInputProps, ViewStyle, TextStyle, View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useCurrentTheme } from '../../theme';
import { Text } from '../base/Text';
import { Box } from '../base/Box';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  state?: 'default' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  fullWidth?: boolean;
}

const getInputStyles = (
  state: InputProps['state'],
  size: InputProps['size'],
  variant: InputProps['variant'],
  disabled: boolean,
  isFocused: boolean,
  theme: any
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
  };

  // Size styles
  const sizeStyles: Record<NonNullable<InputProps['size']>, ViewStyle> = {
    small: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      minHeight: 36,
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
  const variantStyles: Record<NonNullable<InputProps['variant']>, ViewStyle> = {
    outlined: {
      backgroundColor: theme.colors.background.primary,
      borderWidth: 1,
    },
    filled: {
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 0,
    },
  };

  // State and focus styles
  let borderColor = theme.colors.border.primary;
  if (disabled) {
    borderColor = theme.colors.border.primary;
  } else if (state === 'error') {
    borderColor = theme.colors.border.error;
  } else if (isFocused) {
    borderColor = theme.colors.border.focus;
  }

  return {
    ...baseStyle,
    ...sizeStyles[size || 'medium'],
    ...variantStyles[variant || 'outlined'],
    borderColor: variant === 'outlined' ? borderColor : 'transparent',
    opacity: disabled ? 0.6 : 1,
  };
};

const getTextInputStyles = (
  size: InputProps['size'],
  disabled: boolean,
  theme: any
): TextStyle => {
  const sizeStyles: Record<NonNullable<InputProps['size']>, TextStyle> = {
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

  return {
    flex: 1,
    color: disabled ? theme.colors.text.tertiary : theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.sans,
    fontWeight: theme.typography.fontWeight.regular,
    minHeight: 20,
    paddingVertical: 0,
    ...sizeStyles[size || 'medium'],
  };
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  state = 'default',
  size = 'medium',
  variant = 'outlined',
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  fullWidth = true,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useCurrentTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  const focusAnimation = useSharedValue(0);

  const actualState = error ? 'error' : state;
  const inputStyles = getInputStyles(actualState, size, variant, disabled, isFocused, theme);
  const textInputStyles = getTextInputStyles(size, disabled, theme);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusAnimation.value,
      [0, 1],
      [theme.colors.border.primary, theme.colors.border.focus]
    );

    return {
      borderColor: actualState === 'error' 
        ? theme.colors.border.error 
        : variant === 'outlined' 
          ? borderColor 
          : 'transparent',
    };
  });

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnimation.value = withTiming(1, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnimation.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  return (
    <Box style={fullWidth ? { width: '100%' } : undefined}>
      {label && (
        <Text
          variant="label"
          color={disabled ? 'tertiary' : 'primary'}
          style={{ marginBottom: theme.spacing.xs }}
        >
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        disabled={disabled}
      >
        <Animated.View style={[inputStyles, animatedStyle, style]}>
          {leftIcon && (
            <View style={{ marginRight: theme.spacing.xs }}>
              {leftIcon}
            </View>
          )}
          
          <TextInput
            ref={inputRef}
            style={[textInputStyles, inputStyle]}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={theme.colors.text.tertiary}
            {...props}
          />
          
          {rightIcon && (
            <View style={{ marginLeft: theme.spacing.xs }}>
              {rightIcon}
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
      
      {(error || helperText) && (
        <Text
          variant="caption.small"
          color={error ? 'error' : 'secondary'}
          style={{ marginTop: theme.spacing.xs }}
        >
          {error || helperText}
        </Text>
      )}
    </Box>
  );
};