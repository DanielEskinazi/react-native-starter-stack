import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

export default function Index() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotate.value}deg` }
      ],
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.Text style={[styles.title, animatedStyle]}>
          🚀 React Native Starter Stack
        </Animated.Text>
      </TouchableOpacity>
      
      <Text style={styles.subtitle}>Ready for development!</Text>
      <Text style={styles.hint}>👆 Tap the title to test Reanimated!</Text>

      <View style={styles.navigation}>
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
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  navigation: {
    marginTop: 30,
    gap: 15,
    alignItems: 'center',
  },
  link: {
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 160,
  },
  gestureLink: {
    backgroundColor: '#FF6B35',
  },
  zustandLink: {
    backgroundColor: '#8B5A3C',
  },
  storageLink: {
    backgroundColor: '#6A4C93',
  },
  gradientLink: {
    backgroundColor: '#FF6B6B',
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});