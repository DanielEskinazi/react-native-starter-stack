# React Native Gesture Handler Documentation

## Overview
React Native Gesture Handler provides a declarative API for native-driven gesture management in React Native, enabling smooth and deterministic touch interactions that run on the UI thread.

## Core Concepts

### GestureDetector
The main component that wraps your views and handles gestures.

```javascript
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

function App() {
  const tap = Gesture.Tap();
  return (
    <GestureDetector gesture={tap}>
      <Animated.View />
    </GestureDetector>
  );
}
```

### Gesture Builder Pattern
All gestures use a builder pattern with method chaining.

```javascript
const tapGesture = Gesture.Tap()
  .numberOfTaps(2)
  .maxDuration(500)
  .onStart(() => console.log('Double tap!'));
```

## Main Gesture Types

### 1. Tap Gesture
```javascript
const tapGesture = Gesture.Tap()
  .numberOfTaps(1)           // Number of taps required
  .maxDuration(500)          // Max time for tap (ms)
  .maxDelay(500)             // Max delay between taps (ms)
  .maxDistance(10)           // Max finger movement (points)
  .onStart(() => {
    console.log('Tap detected!');
  });
```

### 2. Pan Gesture
```javascript
const panGesture = Gesture.Pan()
  .minDistance(10)           // Min distance to activate
  .minPointers(1)            // Min fingers required
  .maxPointers(1)            // Max fingers allowed
  .onUpdate((event) => {
    // event.translationX, event.translationY
    // event.velocityX, event.velocityY
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    translateX.value = withSpring(0);
  });
```

### 3. Pinch Gesture
```javascript
const pinchGesture = Gesture.Pinch()
  .onUpdate((event) => {
    // event.scale - scale factor
    // event.velocity - scale velocity
    // event.focalX, event.focalY - center point
    scale.value = savedScale.value * event.scale;
  })
  .onEnd(() => {
    savedScale.value = scale.value;
  });
```

### 4. Long Press Gesture
```javascript
const longPressGesture = Gesture.LongPress()
  .minDuration(800)          // Min duration to activate (ms)
  .maxDistance(10)           // Max movement allowed (points)
  .onStart(() => {
    console.log('Long press detected!');
  });
```

## Gesture Composition

### Simultaneous Gestures
Allow multiple gestures to be recognized at the same time.

```javascript
const panGesture = Gesture.Pan();
const pinchGesture = Gesture.Pinch();
const rotationGesture = Gesture.Rotation();

const composedGesture = Gesture.Simultaneous(
  panGesture,
  pinchGesture,
  rotationGesture
);
```

### Exclusive Gestures
Only one gesture can be active at a time (prioritized by order).

```javascript
const singleTap = Gesture.Tap();
const doubleTap = Gesture.Tap().numberOfTaps(2);

// Double tap takes precedence over single tap
const exclusiveGesture = Gesture.Exclusive(doubleTap, singleTap);
```

### Race Gestures
First gesture to activate wins.

```javascript
const panGesture = Gesture.Pan();
const longPressGesture = Gesture.LongPress();

const raceGesture = Gesture.Race(panGesture, longPressGesture);
```

## Gesture Callbacks

### Lifecycle Methods
```javascript
const gesture = Gesture.Tap()
  .onBegin(() => {
    // Gesture starts receiving touches
  })
  .onStart(() => {
    // Gesture recognized and activated
  })
  .onUpdate((event) => {
    // Continuous updates while active
  })
  .onChange((event) => {
    // Called after onUpdate with change values
  })
  .onEnd((event, success) => {
    // Gesture finished (success = true/false)
  })
  .onFinalize((event, success) => {
    // Always called when gesture completes
  });
```

### Touch Events
```javascript
const gesture = Gesture.Pan()
  .onTouchesDown((event) => {
    // Finger touches screen
  })
  .onTouchesMove((event) => {
    // Finger moves on screen
  })
  .onTouchesUp((event) => {
    // Finger lifts from screen
  })
  .onTouchesCancelled((event) => {
    // Touch cancelled
  });
```

## Advanced Configuration

### External Gesture Relations
```javascript
const innerGesture = Gesture.Tap().numberOfTaps(2);
const outerGesture = Gesture.Tap()
  .simultaneousWithExternalGesture(innerGesture)    // Run together
  .requireExternalGestureToFail(innerGesture);     // Wait for failure
```

### Hit Testing
```javascript
const gesture = Gesture.Tap()
  .hitSlop({                    // Define touch area
    left: 20,
    right: 20, 
    top: 10,
    bottom: 10
  });
```

### Platform-Specific
```javascript
// Mouse button support (Web & Android)
const gesture = Gesture.Pan()
  .mouseButton(MouseButton.LEFT | MouseButton.RIGHT);

// Trackpad gestures (iOS)
const panGesture = Gesture.Pan()
  .enableTrackpadTwoFingerGesture(true);

// Average touches (Android)
const panGesture = Gesture.Pan()
  .averageTouches(true);
```

## Event Data Properties

### Pan Gesture Events
```javascript
{
  translationX: number,        // Accumulated translation
  translationY: number,
  velocityX: number,           // Current velocity
  velocityY: number,
  x: number,                   // Current position relative to view
  y: number,
  absoluteX: number,           // Position relative to window
  absoluteY: number
}
```

### Pinch Gesture Events
```javascript
{
  scale: number,               // Scale factor
  velocity: number,            // Scale velocity
  focalX: number,              // Center point X
  focalY: number               // Center point Y
}
```

### Tap Gesture Events
```javascript
{
  x: number,                   // Tap position relative to view
  y: number,
  absoluteX: number,           // Tap position relative to window
  absoluteY: number
}
```

## Integration with Reanimated

### Basic Example
```javascript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function DraggableBox() {
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
}
```

### Complex Multi-Gesture Example
```javascript
function TransformableImage() {
  const offset = useSharedValue({ x: 0, y: 0 });
  const start = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const dragGesture = Gesture.Pan()
    .averageTouches(true)
    .onUpdate((e) => {
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      start.value = offset.value;
    });

  const zoomGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    dragGesture,
    Gesture.Simultaneous(zoomGesture, rotateGesture)
  );

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value.x },
      { translateY: offset.value.y },
      { scale: scale.value },
      { rotateZ: `${rotation.value}rad` },
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.image, animatedStyles]} />
    </GestureDetector>
  );
}
```

## Setup Requirements

### Installation
```bash
npm install react-native-gesture-handler
```

### Root Component Wrapper
```javascript
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## Migration from V1 to V2

### Old API (V1)
```javascript
// V1 - Component-based
<PanGestureHandler onGestureEvent={handler}>
  <TapGestureHandler onHandlerStateChange={tapHandler}>
    <Animated.View />
  </TapGestureHandler>
</PanGestureHandler>
```

### New API (V2)
```javascript
// V2 - Builder pattern
const panGesture = Gesture.Pan().onUpdate(handler);
const tapGesture = Gesture.Tap().onStart(tapHandler);
const composed = Gesture.Simultaneous(panGesture, tapGesture);

<GestureDetector gesture={composed}>
  <Animated.View />
</GestureDetector>
```

## Common Patterns

### Double Tap to Zoom
```javascript
const doubleTap = Gesture.Tap()
  .numberOfTaps(2)
  .onEnd(() => {
    scale.value = withTiming(scale.value === 1 ? 2 : 1);
  });
```

### Pull to Refresh
```javascript
const pullGesture = Gesture.Pan()
  .onUpdate((event) => {
    if (event.translationY > 0) {
      pullOffset.value = event.translationY;
    }
  })
  .onEnd((event) => {
    if (pullOffset.value > REFRESH_THRESHOLD) {
      runOnJS(onRefresh)();
    }
    pullOffset.value = withSpring(0);
  });
```

### Swipe to Delete
```javascript
const swipeGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = Math.max(event.translationX, -100);
  })
  .onEnd((event) => {
    if (event.translationX < -50) {
      translateX.value = withTiming(-100);
      runOnJS(onDelete)();
    } else {
      translateX.value = withSpring(0);
    }
  });
```

## Testing

### Jest Testing
```javascript
import { fireGestureHandler, getByGestureTestId } from 'react-native-gesture-handler/jest-utils';

it('handles pan gesture', () => {
  render(<Component />);
  
  fireGestureHandler<PanGesture>(getByGestureTestId('pan'), [
    { state: State.BEGAN, translationX: 0 },
    { state: State.ACTIVE, translationX: 10 },
    { state: State.END, translationX: 20 }
  ]);
  
  expect(mockHandler).toHaveBeenCalled();
});
```

## Best Practices

1. **Always wrap root app with GestureHandlerRootView**
2. **Use builder pattern for better readability**
3. **Combine gestures with Gesture.Simultaneous for complex interactions**
4. **Handle gesture failures gracefully with onEnd success parameter**
5. **Use withTestId for testable gestures**
6. **Prefer new Gesture API over legacy handler components**
7. **Clean up gesture relations properly to avoid memory leaks**

This documentation covers the essential concepts and patterns for React Native Gesture Handler 2.x with the modern Gesture API.