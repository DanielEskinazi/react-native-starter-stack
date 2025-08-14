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

      <Link href="/about" style={styles.link}>
        <Text style={styles.linkText}>Go to About</Text>
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
  link: {
    marginTop: 30,
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