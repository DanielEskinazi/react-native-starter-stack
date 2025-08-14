import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

export default function About() {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    opacity.value = withTiming(opacity.value === 0.3 ? 1 : 0.3, {
      duration: 800,
      easing: Easing.inOut(Easing.quad),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <Text style={styles.title}>About Screen</Text>
      <Text style={styles.subtitle}>✅ Expo Router is working!</Text>
      <Text style={styles.subtitle}>✅ Safe Area Context is working!</Text>
      
      <Text style={styles.info}>
        Safe Area Insets: Top: {insets.top}px, Bottom: {insets.bottom}px
      </Text>

      <TouchableOpacity onPress={handlePress} style={styles.animationTest}>
        <Animated.Text style={[styles.animatedText, animatedStyle]}>
          🎨 Tap to test fade animation
        </Animated.Text>
      </TouchableOpacity>

      <Link href="/" style={styles.link}>
        <Text style={styles.linkText}>Back to Home</Text>
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  animationTest: {
    marginTop: 25,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
  },
  animatedText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  link: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});