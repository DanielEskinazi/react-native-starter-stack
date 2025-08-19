# Animation & Interaction Patterns Specification

## Overview
Establish consistent animation and interaction patterns using React Native Reanimated and Gesture Handler to create delightful user experiences throughout the application.

## Animation Philosophy
- **Purposeful**: Every animation serves a functional purpose
- **Fast**: Prefer 200-300ms durations for most interactions
- **Natural**: Use spring physics over linear transitions
- **Subtle**: Enhance without distracting from content
- **Performant**: Always run on UI thread using Reanimated

## Core Animation Patterns

### 1. Feedback Animations
```typescript
// Press feedback (universal pattern)
const pressScale = useSharedValue(1);
const pressStyle = useAnimatedStyle(() => ({
  transform: [{ scale: pressScale.value }]
}));

const handlePress = () => {
  pressScale.value = withSequence(
    withSpring(0.95, { duration: 100 }),
    withSpring(1, { duration: 100 })
  );
};
```

### 2. Loading States
```typescript
// Pulse animation for loading
const pulseOpacity = useSharedValue(1);
useEffect(() => {
  pulseOpacity.value = withRepeat(
    withSequence(
      withTiming(0.5, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    ),
    -1,
    true
  );
}, []);
```

### 3. Entrance Animations
```typescript
// Slide in from bottom
const translateY = useSharedValue(100);
const opacity = useSharedValue(0);

useEffect(() => {
  translateY.value = withSpring(0, { damping: 15 });
  opacity.value = withTiming(1, { duration: 300 });
}, []);
```

## Gesture Patterns

### 1. Swipe to Dismiss
```typescript
const dismissGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd((event) => {
    if (Math.abs(event.translationX) > DISMISS_THRESHOLD) {
      // Dismiss item
      translateX.value = withTiming(screenWidth);
      opacity.value = withTiming(0);
    } else {
      // Snap back
      translateX.value = withSpring(0);
    }
  });
```

### 2. Pull to Refresh
```typescript
const pullGesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationY > 0) {
      pullDistance.value = Math.min(event.translationY, MAX_PULL_DISTANCE);
    }
  })
  .onEnd(() => {
    if (pullDistance.value > REFRESH_THRESHOLD) {
      onRefresh();
    }
    pullDistance.value = withSpring(0);
  });
```

### 3. Long Press Actions
```typescript
const longPressGesture = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {
    scale.value = withSpring(1.05);
    runOnJS(hapticFeedback)();
  })
  .onEnd(() => {
    scale.value = withSpring(1);
    runOnJS(showContextMenu)();
  });
```

## Shared Animation Utilities

### Custom Hooks
```typescript
// usePressAnimation - Reusable press feedback
export const usePressAnimation = () => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));
  
  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
  }, []);
  
  return { animatedStyle, handlePress };
};

// useFadeIn - Entrance animation
export const useFadeIn = (delay = 0) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
  }, [delay]);
  
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};
```

### Animation Constants
```typescript
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
} as const;

export const SPRING_CONFIG = {
  BOUNCY: { damping: 10, stiffness: 100 },
  GENTLE: { damping: 15, stiffness: 80 },
  STIFF: { damping: 20, stiffness: 200 },
} as const;
```

## Performance Guidelines
1. **Always use Reanimated** for animations (runs on UI thread)
2. **Avoid animating layout properties** that trigger re-layout
3. **Use transform and opacity** for best performance
4. **Limit concurrent animations** to prevent frame drops
5. **Test on lower-end devices** to ensure smooth performance

## Integration with Components
- All interactive components include press feedback
- Loading states use consistent pulse/spin animations  
- Form validation shows smooth error state transitions
- Navigation includes slide/fade transitions
- Gesture-based interactions follow platform conventions

## Testing Animations
- Mock Reanimated in tests using jest setup
- Test animation completion using act() and flush timers
- Verify gesture callbacks are triggered correctly
- Performance testing with Flipper or React DevTools