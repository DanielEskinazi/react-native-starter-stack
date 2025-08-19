import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useTheme, createThemedStyles } from "../src/theme";

export default function Index() {
  const { theme, toggleMode } = useTheme();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const styles = createThemedStyles(theme, (t) => ({
    container: {
      flex: 1,
      backgroundColor: t.colors.background.primary,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      paddingHorizontal: t.spacing.md,
    },
    title: {
      ...t.typography.variants.heading.h2,
      color: t.colors.text.primary,
      textAlign: "center" as const,
    },
    subtitle: {
      ...t.typography.variants.body.large,
      color: t.colors.text.secondary,
      textAlign: "center" as const,
      marginTop: t.spacing.md,
    },
    hint: {
      ...t.typography.variants.body.small,
      color: t.colors.colors.primary[600],
      textAlign: "center" as const,
      fontStyle: "italic" as const,
      marginTop: t.spacing.sm,
    },
    navigation: {
      marginTop: t.spacing.xl,
      gap: t.spacing.md,
      alignItems: "center" as const,
    },
    link: {
      padding: t.spacing.md,
      backgroundColor: t.colors.colors.primary[500],
      borderRadius: t.borderRadius.md,
      minWidth: 160,
      ...t.shadows.small,
    },
    themeToggle: {
      padding: t.spacing.md,
      backgroundColor: t.colors.colors.secondary[500],
      borderRadius: t.borderRadius.md,
      minWidth: 160,
      ...t.shadows.small,
    },
    gestureLink: {
      backgroundColor: t.colors.colors.secondary[500],
    },
    zustandLink: {
      backgroundColor: t.colors.colors.warning[600],
    },
    storageLink: {
      backgroundColor: t.colors.colors.success[600],
    },
    gradientLink: {
      backgroundColor: t.colors.colors.error[500],
    },
    linkText: {
      ...t.typography.variants.button,
      color: t.colors.text.inverse,
      textAlign: "center" as const,
    },
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotateZ: `${rotate.value}deg` }],
    };
  });

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.2, { duration: 200 }),
      withSpring(1, { duration: 200 })
    );
    rotate.value = withSequence(
      withSpring(10, { duration: 200 }),
      withSpring(0, { duration: 200 })
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.Text style={[styles.title, animatedStyle]}>
          🚀 React Native Starter Stack
        </Animated.Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Ready for development!</Text>
      <Text style={styles.hint}>👆 Tap the title to test Reanimated!</Text>

      <View style={styles.navigation}>
        <TouchableOpacity style={styles.themeToggle} onPress={toggleMode}>
          <Text style={styles.linkText}>
            {theme.mode === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </Text>
        </TouchableOpacity>

        <Link href="/about" style={styles.link}>
          <Text style={styles.linkText}>Go to About</Text>
        </Link>

        <Link href="/gestures" style={[styles.link, styles.gestureLink]}>
          <Text style={styles.linkText}>🎮 Test Gestures</Text>
        </Link>

        <Link href="/zustand" style={[styles.link, styles.zustandLink]}>
          <Text style={styles.linkText}>🐻 Test Zustand</Text>
        </Link>

        <Link href="/storage" style={[styles.link, styles.storageLink]}>
          <Text style={styles.linkText}>📦 Test AsyncStorage</Text>
        </Link>

        <Link href="/gradients" style={[styles.link, styles.gradientLink]}>
          <Text style={styles.linkText}>🌈 Test Linear Gradients</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
