/**
 * Press Animation Demo Component
 * 
 * Demonstrates various press feedback patterns including:
 * - Basic scale feedback
 * - Long press interactions
 * - Disabled state handling
 * - Accessibility support
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { runOnJS, withSpring, withSequence } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

// Safe imports with fallbacks
let Box, Text, useCurrentTheme, usePressAnimation, useReducedMotion;
let GESTURE_THRESHOLDS, SCALE_VALUES;

try {
  ({ Box } = require('../../base/Box'));
  ({ Text } = require('../../base/Text'));
  ({ useCurrentTheme } = require('../../../theme'));
  ({ usePressAnimation, useReducedMotion } = require('../hooks/useAnimationHooks'));
  ({ GESTURE_THRESHOLDS, SCALE_VALUES } = require('../constants'));
  console.log('[PressAnimationDemo] All imports loaded successfully');
} catch (importError) {
  console.error('[PressAnimationDemo] Import error:', importError);
  Alert.alert('Import Error', `Failed to load dependencies: ${importError.message}`);
}

interface PressAnimationDemoProps {
  title?: string;
  debugMode?: boolean;
}

interface DemoButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  scaleValue?: number;
  variant?: 'primary' | 'secondary' | 'danger';
}

const DemoButton: React.FC<DemoButtonProps> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  scaleValue = SCALE_VALUES?.PRESS_SCALE || 0.95,
  variant = 'primary',
}) => {
  console.log('[PressAnimationDemo] DemoButton rendering with props:', {
    hasChildren: !!children,
    hasOnPress: !!onPress,
    hasOnLongPress: !!onLongPress,
    disabled,
    scaleValue,
    variant
  });

  // Safe hook calls with error handling
  let theme, reduceMotion, animatedStyle, handlePress;
  
  try {
    theme = useCurrentTheme ? useCurrentTheme() : null;
    console.log('[PressAnimationDemo] Theme loaded:', !!theme);
  } catch (error) {
    console.error('[PressAnimationDemo] Error loading theme:', error);
    theme = null;
  }

  try {
    reduceMotion = useReducedMotion ? useReducedMotion() : false;
    console.log('[PressAnimationDemo] Reduced motion:', reduceMotion);
  } catch (error) {
    console.error('[PressAnimationDemo] Error checking reduced motion:', error);
    reduceMotion = false;
  }

  let animationHook, scale;
  try {
    animationHook = usePressAnimation ? usePressAnimation(scaleValue) : null;
    animatedStyle = animationHook?.animatedStyle;
    handlePress = animationHook?.handlePress;
    // Get access to the scale shared value if possible
    scale = animationHook?.scale;
    console.log('[PressAnimationDemo] Animation hook loaded:', !!animationHook);
  } catch (error) {
    console.error('[PressAnimationDemo] Error loading press animation:', error);
    animatedStyle = null;
    handlePress = null;
    scale = null;
  }

  let longPressGesture, tapGesture;
  
  // Skip creating gestures for now - they're causing crashes
  longPressGesture = null;

  // Skip creating gestures for now - they're causing crashes
  tapGesture = null;

  let composedGesture;
  try {
    if (Gesture?.Exclusive && longPressGesture && tapGesture) {
      composedGesture = Gesture.Exclusive(longPressGesture, tapGesture);
      console.log('[PressAnimationDemo] Gesture composed successfully');
    } else if (tapGesture) {
      console.warn('[PressAnimationDemo] Using tap gesture only');
      composedGesture = tapGesture;
    } else if (longPressGesture) {
      console.warn('[PressAnimationDemo] Using long press gesture only');
      composedGesture = longPressGesture;
    } else {
      console.warn('[PressAnimationDemo] No gestures available');
      composedGesture = null;
    }
  } catch (error) {
    console.error('[PressAnimationDemo] Error composing gestures:', error);
    composedGesture = tapGesture || longPressGesture; // Fallback to any available gesture
  }

  const getVariantStyles = useCallback(() => {
    try {
      console.log('[PressAnimationDemo] Getting variant styles for:', variant, { disabled, theme: !!theme });
      
      // Defensive theme access with fallbacks
      const safeTheme = {
        colors: {
          colors: {
            neutral: theme?.colors?.colors?.neutral || { 300: '#D1D5DB' },
            primary: theme?.colors?.colors?.primary || { 500: '#3B82F6' },
            error: theme?.colors?.colors?.error || { 500: '#EF4444' },
          },
          background: {
            secondary: theme?.colors?.background?.secondary || '#F3F4F6',
          },
          border: {
            primary: theme?.colors?.border?.primary || '#E5E7EB',
          },
        },
      };

      const variants = {
        primary: {
          backgroundColor: disabled ? safeTheme.colors.colors.neutral[300] : safeTheme.colors.colors.primary[500],
          borderColor: safeTheme.colors.colors.primary[500],
        },
        secondary: {
          backgroundColor: disabled ? safeTheme.colors.background.secondary : 'transparent',
          borderColor: disabled ? safeTheme.colors.border.primary : safeTheme.colors.colors.primary[500],
          borderWidth: 1,
        },
        danger: {
          backgroundColor: disabled ? safeTheme.colors.colors.neutral[300] : safeTheme.colors.colors.error[500],
          borderColor: safeTheme.colors.colors.error[500],
        },
      };
      
      console.log('[PressAnimationDemo] Generated variant styles:', variants[variant]);
      return variants[variant];
    } catch (error) {
      console.error('[PressAnimationDemo] Error in getVariantStyles:', error);
      // Return safe fallback styles
      return {
        backgroundColor: disabled ? '#D1D5DB' : '#3B82F6',
        borderColor: '#3B82F6',
      };
    }
  }, [variant, disabled, theme]);

  const getTextColor = useCallback(() => {
    try {
      console.log('[PressAnimationDemo] Getting text color for:', { variant, disabled, theme: !!theme });
      
      if (disabled) return theme?.colors?.text?.tertiary || '#9CA3AF';
      if (variant === 'secondary') return theme?.colors?.colors?.primary?.[500] || '#3B82F6';
      return '#FFFFFF';
    } catch (error) {
      console.error('[PressAnimationDemo] Error in getTextColor:', error);
      return '#000000'; // Safe fallback
    }
  }, [variant, disabled, theme]);

  // Fallback components if imports failed
  const SafeBox = Box || View;
  const SafeText = Text || (({ children, style }: any) => (
    <View style={style}><View>{children}</View></View>
  ));
  const SafeGestureDetector = GestureDetector || (({ children }: any) => children);
  const SafeAnimatedView = Animated?.View || View;

  try {
    const buttonContent = (
      <SafeAnimatedView
        style={[
          styles.button,
          getVariantStyles(),
          reduceMotion ? {} : (animatedStyle || {}),
          disabled && styles.disabledButton,
        ]}
      >
        <SafeText
          style={[
            styles.buttonText,
            { color: getTextColor() },
            disabled && styles.disabledText,
          ]}
        >
          {children}
        </SafeText>
      </SafeAnimatedView>
    );

    // If we have a composed gesture, use GestureDetector, otherwise use TouchableOpacity
    if (composedGesture) {
      return (
        <SafeGestureDetector gesture={composedGesture}>
          {buttonContent}
        </SafeGestureDetector>
      );
    } else {
      // Fallback to TouchableOpacity if gestures fail
      const { TouchableOpacity } = require('react-native');
      
      const handleTouchablePress = () => {
        console.log('[PressAnimationDemo] TouchableOpacity press');
        if (!disabled && onPress) {
          // Try to trigger animation if available
          if (handlePress && !reduceMotion) {
            try {
              console.log('[PressAnimationDemo] Using handlePress animation');
              handlePress(onPress);
            } catch (error) {
              console.error('[PressAnimationDemo] handlePress failed, calling onPress directly:', error);
              onPress();
            }
          } else {
            console.log('[PressAnimationDemo] Direct onPress call');
            onPress();
          }
        }
      };

      const handleTouchableLongPress = () => {
        console.log('[PressAnimationDemo] TouchableOpacity long press');
        if (!disabled && onLongPress) {
          onLongPress();
        }
      };

      return (
        <TouchableOpacity
          onPress={handleTouchablePress}
          onLongPress={handleTouchableLongPress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {buttonContent}
        </TouchableOpacity>
      );
    }
  } catch (error) {
    console.error('[PressAnimationDemo] Error rendering DemoButton:', error);
    // Ultra-safe fallback
    return (
      <View style={[styles.button, { backgroundColor: '#EF4444' }]}>
        <SafeText style={[styles.buttonText, { color: '#FFFFFF' }]}>
          Error: {error.message}
        </SafeText>
      </View>
    );
  }
};

export const PressAnimationDemo: React.FC<PressAnimationDemoProps> = ({
  title = "Press Animation Patterns",
  debugMode = false,
}) => {
  const [feedback, setFeedback] = useState('');
  const [errorLog, setErrorLog] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [animationState, setAnimationState] = useState('idle');

  // Component error tracking and debug info
  useEffect(() => {
    console.log('[PressAnimationDemo] Component mounted with debugMode:', debugMode);
    
    // Collect debug info
    const debugData = {
      reactNativeVersion: require('react-native/package.json')?.version || 'unknown',
      reanimatedAvailable: !!require('react-native-reanimated'),
      gestureHandlerAvailable: !!require('react-native-gesture-handler'),
      platform: require('react-native').Platform.OS,
      constants: {
        SCALE_VALUES: SCALE_VALUES || 'missing',
        GESTURE_THRESHOLDS: GESTURE_THRESHOLDS || 'missing',
      },
      timestamp: new Date().toISOString(),
    };
    
    setDebugInfo(debugData);
    console.log('[PressAnimationDemo] Debug info collected:', debugData);
    
    return () => {
      console.log('[PressAnimationDemo] Component unmounted');
    };
  }, [debugMode]);

  let theme;
  try {
    theme = useCurrentTheme ? useCurrentTheme() : null;
    console.log('[PressAnimationDemo] Main component theme loaded:', !!theme);
  } catch (error) {
    console.error('[PressAnimationDemo] Error loading theme in main component:', error);
    setErrorLog(prev => [...prev, `Theme error: ${error.message}`]);
    theme = null;
  }

  const showFeedback = useCallback((message: string) => {
    try {
      console.log('[PressAnimationDemo] Showing feedback:', message);
      setAnimationState('feedback');
      setFeedback(message);
      setTimeout(() => {
        console.log('[PressAnimationDemo] Clearing feedback');
        setFeedback('');
        setAnimationState('idle');
      }, 2000);
    } catch (error) {
      console.error('[PressAnimationDemo] Error in showFeedback:', error);
      setErrorLog(prev => [...prev, `Feedback error: ${error.message}`]);
      Alert.alert('Feedback Error', `Failed to show feedback: ${error.message}`);
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrorLog([]);
    console.log('[PressAnimationDemo] Error log cleared');
  }, []);

  // Create a test hook at component level (following rules of hooks)
  let testHook;
  try {
    testHook = usePressAnimation ? usePressAnimation(0.9) : null;
  } catch (error) {
    console.error('[PressAnimationDemo] Error creating test hook:', error);
    testHook = null;
  }

  const testAnimationHook = useCallback(() => {
    try {
      console.log('[PressAnimationDemo] Testing animation hook manually');
      setAnimationState('testing');
      if (testHook?.handlePress) {
        testHook.handlePress(() => {
          setAnimationState('test-complete');
          showFeedback('Animation hook test completed!');
        });
      } else {
        showFeedback('Animation hook test failed - no handlePress function');
        setAnimationState('test-failed');
      }
    } catch (error) {
      console.error('[PressAnimationDemo] Animation hook test failed:', error);
      setErrorLog(prev => [...prev, `Hook test failed: ${error.message}`]);
      setAnimationState('test-failed');
    }
  }, [testHook, showFeedback]);

  const SafeBox = Box || View;
  const SafeText = Text || (({ children, style }: any) => (
    <View style={style}><View>{children}</View></View>
  ));

  try {
    return (
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <SafeBox padding={Box ? "lg" : undefined} style={styles.container}>
        {debugMode && (
          <SafeBox style={styles.debugContainer}>
            <SafeText style={styles.debugTitle}>🔧 Debug Panel</SafeText>
            <SafeText style={styles.debugText}>
              Animation State: {animationState}
            </SafeText>
            <SafeText style={styles.debugText}>
              Platform: {debugInfo.platform}
            </SafeText>
            <SafeText style={styles.debugText}>
              Reanimated: {debugInfo.reanimatedAvailable ? '✅' : '❌'}
            </SafeText>
            <SafeText style={styles.debugText}>
              Gesture Handler: {debugInfo.gestureHandlerAvailable ? '✅' : '❌'}
            </SafeText>
            
            <View style={styles.debugButtonRow}>
              <TouchableOpacity style={styles.debugButton} onPress={testAnimationHook}>
                <SafeText style={styles.debugButtonText}>Test Hook</SafeText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.debugButton} onPress={clearErrors}>
                <SafeText style={styles.debugButtonText}>Clear Errors</SafeText>
              </TouchableOpacity>
            </View>
          </SafeBox>
        )}

        {errorLog.length > 0 && (
          <SafeBox style={[styles.errorContainer]}>
            <SafeText style={styles.errorTitle}>🐛 Debug Errors:</SafeText>
            {errorLog.map((error, index) => (
              <SafeText key={index} style={styles.errorText}>
                {error}
              </SafeText>
            ))}
          </SafeBox>
        )}

        <SafeText variant={Text ? "heading.h2" : undefined} style={styles.title}>
          {title}
        </SafeText>
        
        <SafeText variant={Text ? "body.large" : undefined} style={StyleSheet.flatten([styles.description, { color: theme?.colors?.text?.secondary || '#666666' }])}>
          Tap buttons for normal press feedback. Long press for alternative actions.
        </SafeText>

        {feedback ? (
          <SafeBox padding={Box ? "md" : undefined} style={[styles.feedback, { backgroundColor: theme?.colors?.colors?.success?.[100] || '#D1FAE5' }]}>
            <SafeText style={{ color: theme?.colors?.colors?.success?.[700] || '#065F46' }}>{feedback}</SafeText>
          </SafeBox>
        ) : null}

        <SafeBox style={styles.section}>
          <SafeText variant={Text ? "heading.h3" : undefined} style={styles.sectionTitle}>
            Basic Press Feedback
          </SafeText>
        
        <DemoButton
          onPress={() => showFeedback('Primary button pressed!')}
          onLongPress={() => showFeedback('Primary button long pressed!')}
          variant="primary"
        >
          Primary Button
        </DemoButton>

        <DemoButton
          onPress={() => showFeedback('Secondary button pressed!')}
          onLongPress={() => showFeedback('Secondary button long pressed!')}
          variant="secondary"
        >
          Secondary Button
        </DemoButton>

        <DemoButton
          onPress={() => showFeedback('Danger button pressed!')}
          onLongPress={() => showFeedback('Danger button long pressed!')}
          variant="danger"
        >
          Danger Button
        </DemoButton>
        </SafeBox>

        <SafeBox style={styles.section}>
          <SafeText variant={Text ? "heading.h3" : undefined} style={styles.sectionTitle}>
            Different Scale Values
          </SafeText>
        
        <DemoButton
          onPress={() => showFeedback('Light press feedback')}
          scaleValue={0.98}
          variant="secondary"
        >
          Light Feedback (0.98)
        </DemoButton>

        <DemoButton
          onPress={() => showFeedback('Strong press feedback')}
          scaleValue={0.90}
          variant="secondary"
        >
          Strong Feedback (0.90)
        </DemoButton>
        </SafeBox>

        <SafeBox style={styles.section}>
          <SafeText variant={Text ? "heading.h3" : undefined} style={styles.sectionTitle}>
            Disabled States
          </SafeText>
        
        <DemoButton
          onPress={() => showFeedback('This should not appear')}
          variant="primary"
          disabled
        >
          Disabled Primary
        </DemoButton>

        <DemoButton
          onPress={() => showFeedback('This should not appear')}
          variant="secondary"
          disabled
        >
          Disabled Secondary
        </DemoButton>
        </SafeBox>

          <SafeText variant={Text ? "caption.medium" : undefined} style={StyleSheet.flatten([styles.note, { color: theme?.colors?.text?.tertiary || '#9CA3AF' }])}>
            Note: Animations respect the system's reduced motion accessibility setting
          </SafeText>
        </SafeBox>
      </ScrollView>
    );
  } catch (error) {
    console.error('[PressAnimationDemo] Error rendering main component:', error);
    return (
      <View style={styles.container}>
        <View style={[styles.errorContainer, { backgroundColor: '#FEE2E2' }]}>
          <SafeText style={[styles.errorTitle, { color: '#DC2626' }]}>🚨 Component Error</SafeText>
          <SafeText style={[styles.errorText, { color: '#DC2626' }]}>
            {error.message}
          </SafeText>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    lineHeight: 20,
  },
  feedback: {
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.7,
  },
  note: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 18,
    marginBottom: 4,
  },
  debugContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369A1',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 13,
    color: '#0369A1',
    lineHeight: 16,
    marginBottom: 2,
  },
  debugButtonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  debugButton: {
    backgroundColor: '#0369A1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flex: 1,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});