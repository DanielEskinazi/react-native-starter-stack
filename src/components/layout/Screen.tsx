import React from 'react';
import { ViewStyle, ScrollView, ScrollViewProps, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrentTheme, SpacingToken } from '../../theme';
import { Box } from '../base/Box';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  backgroundColor?: 'primary' | 'secondary' | 'tertiary' | 'elevated' | 'overlay' | string;
  padding?: SpacingToken | number;
  paddingHorizontal?: SpacingToken | number;
  paddingVertical?: SpacingToken | number;
  paddingTop?: SpacingToken | number;
  paddingBottom?: SpacingToken | number;
  paddingLeft?: SpacingToken | number;
  paddingRight?: SpacingToken | number;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;
}

const getBackgroundColor = (color: string | undefined, theme: any): string => {
  if (!color) return theme.colors.background.primary;
  if (color.startsWith('#') || color.startsWith('rgb')) return color;
  return theme.colors.background[color as keyof typeof theme.colors.background] || color;
};

const getSpacingValue = (value: SpacingToken | number | undefined, theme: any): number | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  return theme.spacing[value];
};

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  backgroundColor,
  padding,
  paddingHorizontal,
  paddingVertical,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  edges = ['top', 'bottom', 'left', 'right'],
  style,
  contentContainerStyle,
  scrollViewProps,
}) => {
  const theme = useCurrentTheme();

  const screenStyle: ViewStyle = {
    flex: 1,
    backgroundColor: getBackgroundColor(backgroundColor, theme),
  };

  const paddingStyle: ViewStyle = {
    padding: getSpacingValue(padding, theme),
    paddingHorizontal: getSpacingValue(paddingHorizontal, theme),
    paddingVertical: getSpacingValue(paddingVertical, theme),
    paddingTop: getSpacingValue(paddingTop, theme),
    paddingBottom: getSpacingValue(paddingBottom, theme),
    paddingLeft: getSpacingValue(paddingLeft, theme),
    paddingRight: getSpacingValue(paddingRight, theme),
  };

  // Remove undefined values
  const cleanPaddingStyle = Object.fromEntries(
    Object.entries(paddingStyle).filter(([_, value]) => value !== undefined)
  );

  const contentStyle = StyleSheet.flatten([{ flex: 1 }, cleanPaddingStyle, contentContainerStyle]);

  const content = (
    <Box style={contentStyle}>
      {children}
    </Box>
  );

  const wrappedContent = scrollable ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      {...scrollViewProps}
    >
      {content}
    </ScrollView>
  ) : (
    content
  );

  const keyboardAvoidingContent = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {wrappedContent}
    </KeyboardAvoidingView>
  ) : (
    wrappedContent
  );

  return (
    <SafeAreaView
      style={[screenStyle, style]}
      edges={edges}
    >
      {keyboardAvoidingContent}
    </SafeAreaView>
  );
};