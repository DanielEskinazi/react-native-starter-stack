# React Native Reanimated Documentation

## Overview
React Native Reanimated is a library that provides smooth animations with excellent developer experience for React Native applications. It enables animations to run on the UI thread for better performance.

## Key Concepts

### Worklets
Worklets are functions that can be executed on the UI thread. They are marked with the `'worklet';` directive.

```javascript
function myWorklet() {
  'worklet';
  console.log('Hello from the UI thread');
}
```

### Shared Values
Shared values are used to store animation state that can be accessed from both JS and UI thread.

```javascript
const offset = useSharedValue(0);
```

### useAnimatedStyle
Creates animated styles that react to shared values and run on the UI thread.

```javascript
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offset.value }],
  };
});
```

## Animation Functions

### withSpring
Creates spring-based animations with physics.

```javascript
offset.value = withSpring(100);
```

### withTiming
Creates time-based animations.

```javascript
opacity.value = withTiming(1, { duration: 500 });
```

### withDecay
Creates decay animations based on velocity.

```javascript
translateX.value = withDecay({
  velocity: event.velocityX,
  clamp: [-100, 100],
});
```

## Gesture Integration

### New Gesture API (Reanimated 4.0+)
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onStart(() => {
    console.log('Pan started');
  })
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
  });

// Usage
<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle} />
</GestureDetector>
```

### Legacy API (Reanimated 2.x-3.x)
```javascript
// Note: useAnimatedGestureHandler was removed in Reanimated 4.0
const gestureHandler = useAnimatedGestureHandler({
  onStart: (_, ctx) => {
    ctx.startX = x.value;
  },
  onActive: (event, ctx) => {
    x.value = ctx.startX + event.translationX;
  },
  onEnd: (_) => {
    x.value = withSpring(0);
  },
});
```

## Layout Animations

### Entering Animations
```javascript
import { FadeIn, SlideInUp } from 'react-native-reanimated';

<Animated.View entering={FadeIn.duration(500)} />
<Animated.View entering={SlideInUp.springify()} />
```

### Exiting Animations
```javascript
import { FadeOut, SlideOutDown } from 'react-native-reanimated';

<Animated.View exiting={FadeOut.duration(300)} />
```

## Custom Animations

### Creating Custom Worklets
```javascript
function CustomAnimation(values) {
  'worklet';
  const animations = {
    opacity: withTiming(1),
    transform: [{ scale: withSpring(1) }],
  };
  const initialValues = {
    opacity: 0,
    transform: [{ scale: 0.5 }],
  };
  const callback = (finished) => {
    console.log('Animation finished:', finished);
  };
  return {
    initialValues,
    animations,
    callback,
  };
}
```

## Best Practices

1. **Use worklets for UI thread operations**: Mark functions with `'worklet';` when they need to run on the UI thread
2. **Prefer useAnimatedStyle**: Use `useAnimatedStyle` over direct shared value manipulation
3. **Combine gestures**: Use `Gesture.Simultaneous()` to combine multiple gestures
4. **Use spring animations**: Spring animations feel more natural than timing animations
5. **Clean up**: Properly clean up gesture handlers and listeners

## Migration from Reanimated 3.x to 4.0

### Key Changes:
- `useAnimatedGestureHandler` removed - use new Gesture API
- Worklets moved to separate `react-native-worklets` package
- Babel plugin changed from `react-native-reanimated/plugin` to `react-native-worklets/plugin`

### Before (3.x):
```javascript
import { PanGestureHandler } from 'react-native-gesture-handler';
const handler = useAnimatedGestureHandler({...});
<PanGestureHandler onGestureEvent={handler}>
```

### After (4.0):
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
const gesture = Gesture.Pan().onStart(...).onUpdate(...);
<GestureDetector gesture={gesture}>
```

## Configuration

### Babel Configuration
```javascript
// babel.config.js
module.exports = {
  plugins: ['react-native-worklets/plugin'],
};
```

### Package Requirements
- `react-native-reanimated@4.0.2`
- `react-native-worklets@0.4.1`
- `react-native-gesture-handler@2.28.0`

## Performance Tips

1. **Minimize worklet dependencies**: Keep captured variables minimal
2. **Use runOnUI sparingly**: Prefer hooks like useAnimatedStyle
3. **Avoid frequent rerenders**: Use shared values instead of state
4. **Profile animations**: Use Flipper or dev tools to monitor performance

## Common Patterns

### Draggable Component
```javascript
const DraggableBox = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </GestureDetector>
  );
};
```

### Animated Button
```javascript
const AnimatedButton = ({ onPress, children }) => {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.9);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      runOnJS(onPress)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.button, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
```

This documentation covers the essential concepts and patterns for React Native Reanimated 4.0+.