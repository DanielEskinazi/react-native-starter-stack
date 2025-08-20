/**
 * Production-Ready Parallax Scroll View
 * 
 * A feature-rich parallax scroll view component with:
 * - Multiple parallax layers with different speeds
 * - Header fade and scale effects
 * - Sticky header behavior
 * - Scroll-driven animations
 * - Performance optimizations
 */

import React, { ReactNode, useCallback } from 'react';
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  useDerivedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '../../base/Box';
import { Text } from '../../base/Text';
import { useCurrentTheme } from '../../../theme';
import { useScrollAnimation } from '../hooks/useAnimationHooks';
import { SCROLL_ANIMATION } from '../constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface ParallaxLayer {
  id: string;
  component: ReactNode;
  speed: number; // 0 = fixed, 1 = normal scroll speed, 0.5 = half speed
  zIndex?: number;
  height?: number;
}

export interface ParallaxScrollViewProps {
  children: ReactNode;
  headerImage?: string;
  headerHeight?: number;
  headerTitle?: string;
  headerSubtitle?: string;
  stickyHeaderHeight?: number;
  layers?: ParallaxLayer[];
  backgroundColor?: string;
  showScrollIndicator?: boolean;
  onScroll?: (scrollY: number) => void;
  contentContainerStyle?: any;
  style?: any;
}

const DEFAULT_HEADER_HEIGHT = 300;
const DEFAULT_STICKY_HEIGHT = 80;

export const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  children,
  headerImage,
  headerHeight = DEFAULT_HEADER_HEIGHT,
  headerTitle,
  headerSubtitle,
  stickyHeaderHeight = DEFAULT_STICKY_HEIGHT,
  layers = [],
  backgroundColor,
  showScrollIndicator = true,
  onScroll,
  contentContainerStyle,
  style,
}) => {
  const theme = useCurrentTheme();
  const insets = useSafeAreaInsets();
  
  const scrollY = useSharedValue(0);
  const headerScrollThreshold = headerHeight - stickyHeaderHeight - insets.top;

  // Add debug logging
  console.log('[ParallaxScrollView] Debug values:', {
    headerHeight,
    stickyHeaderHeight,
    insetsTop: insets.top,
    headerScrollThreshold,
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      console.log('[ParallaxScrollView] Scroll Y:', event.contentOffset.y);
      if (onScroll) {
        onScroll(event.contentOffset.y);
      }
    },
  });

  // Header background parallax effect
  const headerBackgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, -headerHeight * 0.3],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  // Header content fade and scale
  const headerContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerScrollThreshold * 0.7],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, headerScrollThreshold],
      [0, -50],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [0, headerScrollThreshold],
      [1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [
        { translateY },
        { scale },
      ],
    };
  });

  // Sticky header reveal - only show after significant scroll
  const stickyHeaderStyle = useAnimatedStyle(() => {
    const showThreshold = Math.max(headerScrollThreshold, 100); // Ensure minimum scroll distance
    const opacity = interpolate(
      scrollY.value,
      [showThreshold - 20, showThreshold + 20],
      [0, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [showThreshold - 20, showThreshold + 20],
      [-40, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
      display: opacity < 0.01 ? 'none' : 'flex', // Hide completely when not needed
    };
  });

  // Dynamic layers with different parallax speeds
  const createLayerStyle = useCallback((layer: ParallaxLayer) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        scrollY.value,
        [0, headerHeight * 2],
        [0, -(headerHeight * 2) * (1 - layer.speed)],
        Extrapolation.EXTEND
      );

      return {
        transform: [{ translateY }],
        zIndex: layer.zIndex || 0,
      };
    });
  }, [headerHeight]);

  // Content reveal animation - make sure content is always visible
  const contentStyle = useAnimatedStyle(() => {
    return { opacity: 1 }; // Keep content fully visible for now
  });

  return (
    <Box style={[styles.container, { backgroundColor: backgroundColor || theme.colors.background.primary }, style]}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={showScrollIndicator}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: headerHeight },
          contentContainerStyle,
        ]}
      >
        {/* Parallax Layers */}
        {layers.map((layer) => (
          <Animated.View
            key={layer.id}
            style={[
              styles.parallaxLayer,
              createLayerStyle(layer),
              { height: layer.height },
            ]}
            pointerEvents="none"
          >
            {layer.component}
          </Animated.View>
        ))}

        {/* Main Content */}
        <Animated.View style={[styles.content, contentStyle]}>
          {console.log('[ParallaxScrollView] Rendering content with children:', !!children)}
          {children}
        </Animated.View>
      </Animated.ScrollView>

      {/* Header Background */}
      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]}>
        {headerImage ? (
          <ImageBackground
            source={{ uri: headerImage }}
            style={styles.headerImageBackground}
            resizeMode="cover"
          >
            <Box style={styles.headerOverlay} />
          </ImageBackground>
        ) : (
          <Box
            style={[
              styles.headerColorBackground,
              { backgroundColor: theme.colors.colors.primary[500] },
            ]}
          />
        )}
      </Animated.View>

      {/* Header Content */}
      <Animated.View
        style={[
          styles.headerContent,
          headerContentStyle,
          { height: headerHeight, paddingTop: insets.top },
        ]}
      >
        <Box style={styles.headerTextContainer}>
          {headerTitle && (
            <Text
              variant="heading"
              size="large"
              style={[styles.headerTitle, { color: headerImage ? '#FFFFFF' : theme.colors.text.primary }]}
            >
              {headerTitle}
            </Text>
          )}
          {headerSubtitle && (
            <Text
              variant="body"
              size="medium"
              style={[
                styles.headerSubtitle,
                { color: headerImage ? 'rgba(255, 255, 255, 0.9)' : theme.colors.text.secondary },
              ]}
            >
              {headerSubtitle}
            </Text>
          )}
        </Box>
      </Animated.View>

      {/* Sticky Header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          stickyHeaderStyle,
          {
            height: stickyHeaderHeight + insets.top,
            paddingTop: insets.top,
            backgroundColor: theme.colors.background.primary,
          },
        ]}
      >
        <Box style={styles.stickyHeaderContent}>
          {headerTitle && (
            <Text
              variant="heading"
              size="medium"
              style={[styles.stickyHeaderTitle, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {headerTitle}
            </Text>
          )}
        </Box>
      </Animated.View>
    </Box>
  );
};

// Example usage components
export const ParallaxLayerBackground: React.FC<{ color: string }> = ({ color }) => (
  <Box style={[styles.layerBackground, { backgroundColor: color }]} />
);

export const ParallaxLayerElements: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Box style={styles.layerElements}>
    {children}
  </Box>
);

export const ParallaxFloatingElement: React.FC<{
  children: ReactNode;
  top?: number;
  left?: number;
  right?: number;
}> = ({ children, top, left, right }) => (
  <Box
    style={[
      styles.floatingElement,
      {
        top: top,
        left: left,
        right: right,
      },
    ]}
  >
    {children}
  </Box>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: {
    backgroundColor: '#FFFFFF', // Make background visible for debugging
    minHeight: screenHeight,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: DEFAULT_HEADER_HEIGHT + 200, // Extra height for parallax
    zIndex: 1,
  },
  headerImageBackground: {
    flex: 1,
  },
  headerColorBackground: {
    flex: 1,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
    zIndex: 2,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stickyHeaderContent: {
    alignItems: 'center',
  },
  stickyHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  parallaxLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  layerBackground: {
    flex: 1,
  },
  layerElements: {
    flex: 1,
    padding: 20,
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 5,
  },
});