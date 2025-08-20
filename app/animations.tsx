/**
 * Animation Showcase Screen
 *
 * A comprehensive demo screen showcasing all animation patterns
 * and components implemented in the animation system.
 */

import React, { useState, useRef } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "../src/components/base/Box";
import { Text } from "../src/components/base/Text";
import { Button } from "../src/components/form/Button";
import { Card } from "../src/components/layout/Card";
import { useCurrentTheme } from "../src/theme";

// Animation Demo Components
import { PressAnimationDemo } from "../src/components/animations/demos/PressAnimationDemo";
import { LoadingAnimationDemo } from "../src/components/animations/demos/LoadingAnimationDemo";
import { EntranceAnimationDemo } from "../src/components/animations/demos/EntranceAnimationDemo";
import { SwipeGestureDemo } from "../src/components/animations/demos/SwipeGestureDemo";
import { MultiTouchDemo } from "../src/components/animations/demos/MultiTouchDemo";
import { LayoutAnimationDemo } from "../src/components/animations/demos/LayoutAnimationDemo";

// Real-world Examples
import {
  SwipeableListItem,
  SwipeAction,
} from "../src/components/animations/examples/SwipeableListItem";
import {
  AnimatedModal,
  AnimatedModalRef,
} from "../src/components/animations/examples/AnimatedModal";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

type DemoSection =
  | "overview"
  | "press"
  | "loading"
  | "entrance"
  | "swipe"
  | "multitouch"
  | "layout"
  | "examples";

interface DemoCategory {
  id: DemoSection;
  title: string;
  description: string;
  component?: React.ComponentType<any>;
  color: string;
}

// Simple working parallax demo
const SimpleParallaxDemo: React.FC = () => {
  const theme = useCurrentTheme();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Header that fades out as you scroll
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 150],
      [1, 0],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, -50],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  // Background that moves slower (parallax effect)
  const backgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 300],
      [0, -100], // Moves slower than scroll
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Box style={{ flex: 1, position: 'relative' }}>
      {/* Background Layer - moves slower */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            backgroundColor: theme.colors.colors.primary[500],
            zIndex: 1,
          },
          backgroundStyle,
        ]}
      />

      {/* Header Text - fades out */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 3,
            alignItems: 'center',
          },
          headerStyle,
        ]}
      >
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
          🌄 Parallax Demo
        </Text>
        <Text style={{ color: 'white', fontSize: 16, marginTop: 8 }}>
          Scroll to see the magic! ✨
        </Text>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={{ flex: 1, zIndex: 2 }}
        contentContainerStyle={{ paddingTop: 150 }}
      >
        <Box style={{ backgroundColor: 'white', minHeight: 600, padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            📱 Scroll Content
          </Text>
          <Text style={{ marginBottom: 20 }}>
            As you scroll, notice how the blue background moves slower than this content - that's the parallax effect!
          </Text>

          {Array.from({ length: 10 }, (_, i) => (
            <Box
              key={i}
              style={{
                backgroundColor: theme.colors.colors.primary[50],
                padding: 16,
                marginBottom: 16,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>Content Item {i + 1}</Text>
              <Text style={{ color: theme.colors.text.secondary }}>
                {i === 0 && "👆 Look at the header - it's fading out!"}
                {i === 3 && "🎭 The background is moving slower than this text"}
                {i === 6 && "✨ This is the parallax effect in action!"}
                {i !== 0 && i !== 3 && i !== 6 && "Keep scrolling to see more effects..."}
              </Text>
            </Box>
          ))}

          <Box
            style={{
              backgroundColor: theme.colors.colors.success[100],
              padding: 20,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.colors.success[700] }}>
              🎉 Great job!
            </Text>
            <Text style={{ textAlign: 'center', marginTop: 8, color: theme.colors.colors.success[600] }}>
              You've experienced the parallax effect! The header faded out and the background moved at a different speed than the content.
            </Text>
          </Box>
        </Box>
      </Animated.ScrollView>
    </Box>
  );
};

export default function AnimationsScreen() {
  const theme = useCurrentTheme();
  const [activeSection, setActiveSection] = useState<DemoSection>("overview");
  const modalRef = useRef<AnimatedModalRef>(null);
  const [showModal, setShowModal] = useState(false);

  const demoCategories: DemoCategory[] = [
    {
      id: "overview",
      title: "Animation Overview",
      description: "Introduction to the animation system and its capabilities",
      color: theme.colors.colors.primary[500],
    },
    {
      id: "press",
      title: "Press Feedback",
      description: "Interactive button press animations with haptic feedback",
      component: PressAnimationDemo,
      color: theme.colors.colors.primary[500],
    },
    {
      id: "loading",
      title: "Loading States",
      description: "Various loading animation patterns and skeleton screens",
      component: LoadingAnimationDemo,
      color: theme.colors.colors.secondary[500],
    },
    {
      id: "entrance",
      title: "Entrance Effects",
      description: "Slide, fade, and scale entrance animations with staggering",
      component: EntranceAnimationDemo,
      color: theme.colors.colors.success[500],
    },
    {
      id: "swipe",
      title: "Swipe Gestures",
      description: "Advanced swipe-to-delete and action reveal patterns",
      component: SwipeGestureDemo,
      color: theme.colors.colors.warning[500],
    },
    {
      id: "multitouch",
      title: "Multi-Touch",
      description: "Combined pan, pinch, and rotation gesture handling",
      component: MultiTouchDemo,
      color: theme.colors.colors.error[500],
    },
    {
      id: "layout",
      title: "Layout Animations",
      description: "Dynamic layout changes with smooth transitions",
      component: LayoutAnimationDemo,
      color: theme.colors.colors.primary[600],
    },
    {
      id: "examples",
      title: "Real-World Examples",
      description: "Production-ready components with advanced animations",
      color: theme.colors.colors.neutral[600],
    },
  ];

  const renderOverview = () => (
    <Box style={styles.overviewContainer}>
      <Box style={styles.overviewContent}>
        <Text variant="heading.h2" style={styles.overviewTitle}>
          🎬 Animation System Showcase
        </Text>

        <Text
          variant="body.large"
          style={[styles.overviewDescription, { color: "#333333" }] as any}
        >
          Explore a comprehensive collection of animation patterns and
          components built with React Native Reanimated 3 and Gesture Handler.
          Each demo showcases smooth, performant animations that enhance user
          experience.
        </Text>

        <Card
          padding="lg"
          style={[
            styles.featuresCard,
            { backgroundColor: theme.colors.colors.primary[50] },
          ]}
        >
          <Text variant="heading.h3" style={styles.featuresTitle}>
            ✨ Key Features
          </Text>

          <Box style={styles.featuresList}>
            {[
              "60fps animations running on UI thread",
              "Gesture-driven interactions with velocity detection",
              "Accessibility support with reduced motion preferences",
              "Production-ready components with TypeScript",
              "Haptic feedback integration",
              "Customizable animation parameters",
              "Layout animations with automatic transitions",
              "Real-world usage examples",
            ].map((feature, index) => (
              <Box key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </Box>
            ))}
          </Box>
        </Card>

        <Card padding="lg" style={styles.performanceCard}>
          <Text variant="heading" size="medium" style={styles.performanceTitle}>
            ⚡ Performance Guidelines
          </Text>
          <Text
            variant="body"
            size="small"
            style={[styles.performanceText, { color: "#666666" }]}
          >
            All animations are optimized for performance using worklets, shared
            values, and UI thread execution. Test on lower-end devices to ensure
            smooth 60fps performance.
          </Text>
        </Card>

        <Text
          variant="body"
          size="small"
          style={[styles.instructionText, { color: "#666666" }]}
        >
          Select a category above to explore specific animation patterns and
          interactions.
        </Text>
      </Box>
    </Box>
  );

  const renderRealWorldExamples = () => (
    <Box style={styles.examplesContainer}>
      <Box padding="lg">
        <Text variant="heading" size="large" style={styles.examplesTitle}>
          🚀 Production Components
        </Text>

        <Text
          variant="body"
          size="medium"
          style={[
            styles.examplesDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          Ready-to-use components that combine multiple animation patterns for
          real-world applications.
        </Text>

        {/* Swipeable List Items */}
        <Box style={styles.exampleSection}>
          <Text
            variant="heading"
            size="medium"
            style={styles.exampleSectionTitle}
          >
            Swipeable List Items
          </Text>

          <SwipeableListItem
            id="example-1"
            rightActions={[
              {
                id: "archive",
                label: "Archive",
                color: "#FFFFFF",
                backgroundColor: theme.colors.colors.warning[500],
                onPress: () => console.log("Archive pressed"),
              } as SwipeAction,
              {
                id: "delete",
                label: "Delete",
                color: "#FFFFFF",
                backgroundColor: theme.colors.colors.error[500],
                onPress: () => console.log("Delete pressed"),
              } as SwipeAction,
            ]}
            leftActions={[
              {
                id: "edit",
                label: "Edit",
                color: "#FFFFFF",
                backgroundColor: theme.colors.colors.primary[500],
                onPress: () => console.log("Edit pressed"),
              } as SwipeAction,
            ]}
          >
            <Box padding="md">
              <Text variant="heading" size="medium">
                Important Document
              </Text>
              <Text
                variant="body"
                size="small"
                style={{ color: theme.colors.text.secondary }}
              >
                Swipe left or right to reveal actions
              </Text>
            </Box>
          </SwipeableListItem>

          <SwipeableListItem
            id="example-2"
            onDelete={() => console.log("Quick delete")}
            confirmDelete={false}
          >
            <Box padding="md">
              <Text variant="heading" size="medium">
                Quick Delete Item
              </Text>
              <Text
                variant="body"
                size="small"
                style={{ color: theme.colors.text.secondary }}
              >
                Swipe left past threshold for instant delete
              </Text>
            </Box>
          </SwipeableListItem>
        </Box>

        {/* Animated Modal */}
        <Box style={styles.exampleSection}>
          <Text
            variant="heading"
            size="medium"
            style={styles.exampleSectionTitle}
          >
            Animated Modals
          </Text>

          <Button
            onPress={() => setShowModal(true)}
            variant="primary"
            style={styles.modalButton}
          >
            Show Animated Modal
          </Button>

          <AnimatedModal
            ref={modalRef}
            visible={showModal}
            onClose={() => setShowModal(false)}
            title="Demo Modal"
            animationType="slideUp"
            gestureEnabled={true}
            blurBackdrop={false}
          >
            <Box style={styles.modalContent}>
              <Text variant="body" size="medium" style={styles.modalText}>
                This modal supports multiple animation types, gesture dismissal,
                and keyboard handling.
              </Text>

              <Box style={styles.modalActions}>
                <Button
                  onPress={() => setShowModal(false)}
                  variant="secondary"
                  style={styles.modalActionButton}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => setShowModal(false)}
                  variant="primary"
                  style={styles.modalActionButton}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </AnimatedModal>
        </Box>

        {/* Parallax Scroll View */}
        <Box style={styles.exampleSection}>
          <Text
            variant="heading"
            size="medium"
            style={styles.exampleSectionTitle}
          >
            Parallax Scroll View
          </Text>

          <Card style={styles.parallaxPreview}>
            <SimpleParallaxDemo />
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderContent = () => {
    if (activeSection === "overview") {
      return renderOverview();
    }

    if (activeSection === "examples") {
      return renderRealWorldExamples();
    }

    const category = demoCategories.find((cat) => cat.id === activeSection);
    if (category?.component) {
      const Component = category.component;
      // Enable debug mode for Press Animation Demo
      const props = category.id === "press" ? { debugMode: true } : {};
      return <Component {...props} />;
    }

    return renderOverview();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Box
        style={[
          styles.header,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text variant="heading" size="large" style={styles.headerTitle}>
          Animations
        </Text>
        <Link href="/" style={styles.headerLink}>
          <Text
            style={[
              styles.headerLinkText,
              { color: theme.colors.colors.primary[500] },
            ]}
          >
            ← Back
          </Text>
        </Link>
      </Box>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        style={styles.tabsContainer}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {demoCategories.map((category) => (
          <Button
            key={category.id}
            onPress={() => setActiveSection(category.id)}
            variant={activeSection === category.id ? "primary" : "ghost"}
            size="small"
            style={[
              styles.tab,
              activeSection === category.id && {
                backgroundColor: category.color,
              },
            ]}
          >
            {category.title}
          </Button>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  headerTitle: {
    fontWeight: "bold",
  },
  headerLink: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerLinkText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabsContainer: {
    backgroundColor: "#F8F9FA",
    borderBottomColor: "#E5E5E7",
    borderBottomWidth: 1,
  },
  tabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tab: {
    marginRight: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 0,
    height: 32,
    fontSize: 12,
  },
  content: {
    flexShrink: 1,
  },
  contentContainer: {
    flexGrow: 0,
  },
  overviewContainer: {
    marginTop: 0,
    paddingTop: 0,
  },
  overviewContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  overviewTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  overviewDescription: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresCard: {
    marginBottom: 24,
  },
  featuresTitle: {
    marginBottom: 16,
    fontWeight: "600",
    color: "#000000",
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  featureBullet: {
    fontSize: 16,
    marginRight: 8,
    color: "#007AFF",
    fontWeight: "bold",
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#333333",
  },
  performanceCard: {
    marginBottom: 24,
    backgroundColor: "#FFF3E0",
  },
  performanceTitle: {
    marginBottom: 12,
    fontWeight: "600",
    color: "#FF9500",
  },
  performanceText: {
    lineHeight: 20,
  },
  instructionText: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 16,
  },
  examplesContainer: {
    // No flex properties - just take up natural content size
  },
  examplesTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "bold",
  },
  examplesDescription: {
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  exampleSection: {
    marginBottom: 32,
  },
  exampleSectionTitle: {
    marginBottom: 16,
    fontWeight: "600",
  },
  modalButton: {
    alignSelf: "center",
    marginBottom: 16,
  },
  modalContent: {
    paddingVertical: 20,
  },
  modalText: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  modalActionButton: {
    minWidth: 100,
  },
  parallaxPreview: {
    height: 400, // Increased height for better parallax effect
    overflow: "hidden",
  },
  parallaxContainer: {
    flex: 1,
  },
  parallaxIntro: {
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  parallaxCard: {
    marginBottom: 12,
  },
});
