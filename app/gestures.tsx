import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useState } from 'react';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Gestures() {
  const [gestureInfo, setGestureInfo] = useState('👋 Try the gestures!');
  
  // Pan gesture values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  // Pinch gesture values
  const scale = useSharedValue(1);
  const baseScale = useSharedValue(1);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setGestureInfo)('🖐️ Panning...');
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(setGestureInfo)('✅ Pan completed - snapped back!');
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      scale.value = withSpring(scale.value === 1 ? 1.2 : 1);
      runOnJS(setGestureInfo)('👆 Tap detected!');
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
      runOnJS(setGestureInfo)('🤏 Pinching...');
    })
    .onUpdate((event) => {
      scale.value = baseScale.value * event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      runOnJS(setGestureInfo)('✅ Pinch completed - reset scale!');
    });

  const composedGestures = Gesture.Simultaneous(panGesture, tapGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎮 Gesture Handler Test</Text>
      <Text style={styles.instructions}>
        • Drag the blue box around{'\n'}
        • Tap the box to scale{'\n'}
        • Pinch to zoom{'\n'}
      </Text>
      
      <Text style={styles.status}>{gestureInfo}</Text>

      <View style={styles.gestureArea}>
        <GestureDetector gesture={composedGestures}>
          <Animated.View style={[styles.gestureBox, animatedStyle]}>
            <Text style={styles.boxText}>🎯{'\n'}Gesture Me!</Text>
          </Animated.View>
        </GestureDetector>
      </View>

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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  status: {
    fontSize: 18,
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
    minHeight: 25,
    fontWeight: '500',
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  gestureBox: {
    width: 120,
    height: 120,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  boxText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});