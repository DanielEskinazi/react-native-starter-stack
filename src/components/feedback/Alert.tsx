import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useCurrentTheme, SpacingToken } from '../../theme';
import { Box } from '../base/Box';
import { Text } from '../base/Text';
import { Pressable } from '../base/Pressable';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onPress: () => void;
  };
  padding?: SpacingToken | number;
  margin?: SpacingToken | number;
  style?: ViewStyle;
}

const getAlertColors = (variant: AlertProps['variant'], theme: any) => {
  const variants = {
    info: {
      backgroundColor: theme.colors.colors.primary[50],
      borderColor: theme.colors.colors.primary[200],
      textColor: theme.colors.colors.primary[700],
      iconColor: theme.colors.colors.primary[500],
    },
    success: {
      backgroundColor: theme.colors.colors.success[50],
      borderColor: theme.colors.colors.success[200],
      textColor: theme.colors.colors.success[700],
      iconColor: theme.colors.colors.success[500],
    },
    warning: {
      backgroundColor: theme.colors.colors.warning[50],
      borderColor: theme.colors.colors.warning[200],
      textColor: theme.colors.colors.warning[700],
      iconColor: theme.colors.colors.warning[500],
    },
    error: {
      backgroundColor: theme.colors.colors.error[50],
      borderColor: theme.colors.colors.error[200],
      textColor: theme.colors.colors.error[700],
      iconColor: theme.colors.colors.error[500],
    },
  };

  return variants[variant || 'info'];
};

const getSpacingValue = (value: SpacingToken | number | undefined, theme: any): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return theme.spacing[value];
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  action,
  padding = 'md',
  margin,
  style,
}) => {
  const theme = useCurrentTheme();
  const colors = getAlertColors(variant, theme);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handleDismiss = () => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.95, { duration: 200 }, () => {
      if (onDismiss) {
        runOnJS(onDismiss)();
      }
    });
  };

  const alertStyle: ViewStyle = {
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: getSpacingValue(padding, theme),
    margin: getSpacingValue(margin, theme),
  };

  // Remove undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(alertStyle).filter(([_, value]) => value !== undefined)
  );

  return (
    <Animated.View style={[animatedStyle, cleanStyle, style]}>
      <Box flexDirection="row" alignItems="flex-start">
        {icon && (
          <Box marginRight="sm" marginTop="xs">
            {icon}
          </Box>
        )}
        
        <Box flex={1}>
          {title && (
            <Text
              variant="heading.h6"
              color={colors.textColor}
              style={{ marginBottom: theme.spacing.xs }}
            >
              {title}
            </Text>
          )}
          
          <Text
            variant="body.medium"
            color={colors.textColor}
          >
            {children}
          </Text>
          
          {action && (
            <Box marginTop="sm">
              <Pressable onPress={action.onPress}>
                <Text
                  variant="button"
                  color={colors.iconColor}
                  style={{
                    fontWeight: theme.typography.fontWeight.semibold,
                  }}
                >
                  {action.label}
                </Text>
              </Pressable>
            </Box>
          )}
        </Box>
        
        {dismissible && (
          <Pressable
            onPress={handleDismiss}
            style={{
              marginLeft: theme.spacing.sm,
              padding: theme.spacing.xs,
            }}
          >
            <Text
              variant="body.medium"
              color={colors.textColor}
              style={{
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: 18,
              }}
            >
              ×
            </Text>
          </Pressable>
        )}
      </Box>
    </Animated.View>
  );
};