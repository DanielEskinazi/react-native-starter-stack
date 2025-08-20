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

### 4. Velocity-Based Animations
```typescript
const velocityGesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd((event) => {
    const velocity = event.velocityX;
    const shouldFling = Math.abs(velocity) > 500;
    
    if (shouldFling) {
      // Fling animation with decay
      translateX.value = withDecay({
        velocity: velocity,
        clamp: [-screenWidth, screenWidth],
        deceleration: 0.998,
      });
    } else {
      // Simple spring back
      translateX.value = withSpring(0);
    }
  });
```

### 5. Multi-Touch Gestures
```typescript
const simultaneousGesture = Gesture.Simultaneous(
  Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  }),
  Gesture.Pinch()
    .onStart(() => {
      baseScale.value = scale.value;
    })
    .onUpdate((event) => {
      scale.value = baseScale.value * event.scale;
    })
    .onEnd(() => {
      // Snap to discrete scale levels
      const targetScale = scale.value > 1.5 ? 2 : 1;
      scale.value = withSpring(targetScale);
    })
);
```

### 6. Scroll-Driven Animations
```typescript
const onScroll = useAnimatedScrollHandler({
  onScroll: (event) => {
    const y = event.contentOffset.y;
    
    // Parallax header
    headerTranslateY.value = -y * 0.5;
    
    // Fade out header at threshold
    headerOpacity.value = interpolate(
      y,
      [0, HEADER_SCROLL_DISTANCE],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    // Scale header based on scroll
    headerScale.value = interpolate(
      y,
      [-100, 0],
      [1.1, 1],
      Extrapolation.CLAMP
    );
  },
});
```

## Layout Animations

### Shared Element Transitions
```typescript
import { SharedTransition, withSpring } from 'react-native-reanimated';

// Shared element transition configuration
const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
    originX: withSpring(values.targetOriginX),
    originY: withSpring(values.targetOriginY),
  };
});

// Usage in components
<Animated.View sharedTransitionTag="photo" sharedTransitionStyle={customTransition}>
  <Image source={image} style={styles.image} />
</Animated.View>
```

### List Item Animations
```typescript
// Entering animation for list items
const listItemEntering = (targetValues) => {
  'worklet';
  return {
    animations: {
      originY: withDelay(
        targetValues.targetOriginY * 50, // Stagger based on position
        withSpring(targetValues.targetOriginY)
      ),
      opacity: withDelay(
        targetValues.targetOriginY * 50,
        withTiming(1, { duration: 300 })
      ),
    },
    initialValues: {
      originY: targetValues.targetOriginY + 50,
      opacity: 0,
    },
  };
};

// Exiting animation
const listItemExiting = (values) => {
  'worklet';
  return {
    animations: {
      originX: withTiming(values.currentOriginX - 100, { duration: 250 }),
      opacity: withTiming(0, { duration: 250 }),
    },
    initialValues: {
      originX: values.currentOriginX,
      opacity: 1,
    },
  };
};
```

### Layout Change Animations
```typescript
// Smooth layout transitions
const layoutTransition = LinearTransition.springify().damping(15);

// Component with layout animation
<Animated.View layout={layoutTransition}>
  {items.map((item) => (
    <Animated.View
      key={item.id}
      entering={listItemEntering}
      exiting={listItemExiting}
      layout={layoutTransition}
    >
      <Text>{item.title}</Text>
    </Animated.View>
  ))}
</Animated.View>
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

// useScrollAnimation - Scroll-driven animation hook
export const useScrollAnimation = () => {
  const scrollY = useSharedValue(0);
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  
  const createParallaxStyle = (speed = 0.5) => {
    return useAnimatedStyle(() => ({
      transform: [{ translateY: -scrollY.value * speed }],
    }));
  };
  
  const createFadeStyle = (startY = 0, endY = 100) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(
        scrollY.value,
        [startY, endY],
        [1, 0],
        Extrapolation.CLAMP
      ),
    }));
  };
  
  return { scrollHandler, createParallaxStyle, createFadeStyle, scrollY };
};

// useVelocityGesture - Velocity-aware gesture hook
export const useVelocityGesture = () => {
  const translateX = useSharedValue(0);
  const context = useSharedValue({ x: 0 });
  
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value };
    })
    .onUpdate((event) => {
      translateX.value = context.value.x + event.translationX;
    })
    .onEnd((event) => {
      const velocity = event.velocityX;
      const shouldFling = Math.abs(velocity) > 500;
      
      if (shouldFling) {
        translateX.value = withDecay({
          velocity: velocity,
          clamp: [-300, 300],
        });
      } else {
        translateX.value = withSpring(0);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  return { gesture, animatedStyle };
};

// useKeyboardAnimation - Keyboard-aware animations
export const useKeyboardAnimation = () => {
  const keyboardHeight = useSharedValue(0);
  
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', (event) => {
      keyboardHeight.value = withSpring(event.endCoordinates.height, {
        damping: 15,
        stiffness: 200,
      });
    });
    
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      keyboardHeight.value = withSpring(0, {
        damping: 15,
        stiffness: 200,
      });
    });
    
    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);
  
  const keyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));
  
  return { keyboardStyle, keyboardHeight };
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

export const GESTURE_THRESHOLDS = {
  SWIPE_VELOCITY: 500,
  DISMISS_DISTANCE: 150,
  LONG_PRESS_DURATION: 500,
  DOUBLE_TAP_INTERVAL: 300,
} as const;

export const INTERPOLATION_CONFIG = {
  EASE_OUT: { easing: Easing.out(Easing.exp) },
  EASE_IN_OUT: { easing: Easing.inOut(Easing.ease) },
  BOUNCE: { easing: Easing.bounce },
} as const;

## Real-World Implementation Examples

### Swipe-to-Delete List Item
```typescript
const SwipeableListItem = ({ item, onDelete }) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow left swipe (negative translation)
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      const shouldDelete = event.translationX < -DISMISS_THRESHOLD;
      
      if (shouldDelete) {
        // Animate out
        translateX.value = withTiming(-screenWidth, { duration: 250 });
        opacity.value = withTiming(0, { duration: 250 });
        itemHeight.value = withTiming(
          0,
          { duration: 300 },
          (finished) => {
            if (finished) {
              runOnJS(onDelete)(item.id);
            }
          }
        );
      } else {
        // Snap back
        translateX.value = withSpring(0);
      }
    });
  
  const itemStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
    height: itemHeight.value,
  }));
  
  const deleteButtonStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-DISMISS_THRESHOLD, 0],
      [1, 0],
      Extrapolation.CLAMP
    );
    
    return {
      opacity: progress,
      transform: [{ scale: progress }],
    };
  });
  
  return (
    <View style={styles.itemContainer}>
      <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
        <Icon name="delete" color="white" />
      </Animated.View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.item, itemStyle]}>
          <Text>{item.title}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
```

### Pull-to-Refresh with Custom Indicator
```typescript
const CustomPullToRefresh = ({ children, onRefresh, refreshing }) => {
  const translateY = useSharedValue(0);
  const refreshProgress = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        const progress = Math.min(event.translationY / REFRESH_THRESHOLD, 1.5);
        translateY.value = event.translationY * 0.5; // Damping effect
        refreshProgress.value = progress;
      }
    })
    .onEnd((event) => {
      if (event.translationY > REFRESH_THRESHOLD && !isRefreshing.value) {
        isRefreshing.value = true;
        translateY.value = withTiming(REFRESH_INDICATOR_HEIGHT);
        runOnJS(onRefresh)();
      } else {
        translateY.value = withSpring(0);
        refreshProgress.value = withTiming(0);
      }
    });
  
  // Reset when refreshing completes
  useEffect(() => {
    if (!refreshing && isRefreshing.value) {
      isRefreshing.value = false;
      translateY.value = withSpring(0);
      refreshProgress.value = withTiming(0);
    }
  }, [refreshing]);
  
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  const indicatorStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      refreshProgress.value,
      [0, 1],
      [0, 360],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      refreshProgress.value,
      [0, 0.5, 1],
      [0, 0.8, 1],
      Extrapolation.CLAMP
    );
    
    return {
      transform: [
        { rotate: `${rotation}deg` },
        { scale }
      ],
      opacity: refreshProgress.value,
    };
  });
  
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.refreshIndicator, indicatorStyle]}>
          <RefreshIcon />
        </Animated.View>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
```

### Modal with Backdrop Blur
```typescript
const BlurModal = ({ visible, onClose, children }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const blurRadius = useSharedValue(0);
  
  const showModal = useCallback(() => {
    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withSpring(1, { damping: 15 });
    blurRadius.value = withTiming(10, { duration: 200 });
  }, []);
  
  const hideModal = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.8, { duration: 200 });
    blurRadius.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });
  }, [onClose]);
  
  useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }
  }, [visible]);
  
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  const blurViewStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  if (!visible && opacity.value === 0) return null;
  
  return (
    <Modal transparent visible={visible} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, blurViewStyle]}>
        <BlurView intensity={blurRadius.value} style={StyleSheet.absoluteFill} />
      </Animated.View>
      
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdrop} onPress={hideModal} />
        
        <Animated.View style={[styles.modal, modalStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
```
```

## Performance Guidelines

### Core Performance Rules
1. **Always use Reanimated** for animations (runs on UI thread)
2. **Avoid animating layout properties** that trigger re-layout
3. **Use transform and opacity** for best performance
4. **Limit concurrent animations** to prevent frame drops
5. **Test on lower-end devices** to ensure smooth performance

### Specific Optimization Patterns

#### Worklet Optimization
```typescript
// ✅ Good - Pure worklet function
const interpolateValue = (value: number) => {
  'worklet';
  return interpolate(value, [0, 1], [0, 100], Extrapolation.CLAMP);
};

// ❌ Bad - Heavy computation in animation callback
const heavyAnimation = useAnimatedStyle(() => {
  // Avoid complex calculations here
  const result = expensiveCalculation(someValue.value);
  return { transform: [{ translateX: result }] };
});
```

#### Memory Management
```typescript
// ✅ Good - Reuse shared values
const useOptimizedAnimation = () => {
  const sharedValues = useRef({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    scale: new Animated.Value(1),
  }).current;
  
  return sharedValues;
};

// ❌ Bad - Creating new shared values on each render
const BadAnimation = () => {
  const x = useSharedValue(0); // Creates new instance each time
  const y = useSharedValue(0);
};
```

#### Reduce Re-renders
```typescript
// ✅ Good - Memoized animation styles
const AnimatedComponent = memo(({ data }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(data.progress, [0, 1], [0, 1]),
    };
  }, [data.progress]); // Only recreate when progress changes
  
  return <Animated.View style={animatedStyle} />;
});

// ❌ Bad - Recreating styles unnecessarily
const BadComponent = ({ data }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.random(), // Non-deterministic calculation
  }));
};
```

#### Gesture Performance
```typescript
// ✅ Good - Efficient gesture handling
const efficientGesture = Gesture.Pan()
  .onUpdate((event) => {
    // Direct assignment is fastest
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  })
  .runOnJS(false); // Keep on UI thread when possible

// ❌ Bad - Switching threads unnecessarily
const inefficientGesture = Gesture.Pan()
  .onUpdate((event) => {
    runOnJS(() => {
      // Avoid switching to JS thread for simple operations
      setPosition({ x: event.translationX, y: event.translationY });
    })();
  });
```

## Accessibility Considerations

### Reduced Motion Support
```typescript
import { AccessibilityInfo } from 'react-native';

const useReducedMotion = () => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState(false);
  
  useEffect(() => {
    const checkReducedMotion = async () => {
      const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      setIsReducedMotionEnabled(isEnabled);
    };
    
    checkReducedMotion();
    
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReducedMotionEnabled
    );
    
    return () => subscription?.remove();
  }, []);
  
  return isReducedMotionEnabled;
};

// Usage in animations
const AccessibleAnimation = () => {
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePress = () => {
    if (reduceMotion) {
      // Skip animation for reduced motion
      onPress?.();
    } else {
      // Normal animation
      scale.value = withSequence(
        withSpring(0.95),
        withSpring(1, {}, onPress)
      );
    }
  };
};
```

### Screen Reader Compatibility
```typescript
// Announce animation state changes
const AccessibleLoadingButton = ({ loading, onPress, children }) => {
  const opacity = useSharedValue(loading ? 0.5 : 1);
  
  useEffect(() => {
    opacity.value = withTiming(loading ? 0.5 : 1, { duration: 200 });
    
    // Announce loading state to screen reader
    AccessibilityInfo.announceForAccessibility(
      loading ? 'Loading' : 'Ready'
    );
  }, [loading]);
  
  return (
    <Animated.View
      style={useAnimatedStyle(() => ({ opacity: opacity.value }))}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ busy: loading }}
      accessibilityHint={loading ? "Please wait" : "Double tap to activate"}
    >
      <Pressable onPress={onPress}>
        {children}
      </Pressable>
    </Animated.View>
  );
};
```

### Focus Management During Animations
```typescript
// Preserve focus during animated transitions
const FocusAwareModal = ({ visible, children }) => {
  const opacity = useSharedValue(0);
  const modalRef = useRef<View>(null);
  
  const showModal = useCallback(() => {
    opacity.value = withTiming(1, { duration: 300 }, (finished) => {
      if (finished) {
        // Set focus to modal content after animation
        runOnJS(() => {
          modalRef.current?.focus();
        })();
      }
    });
  }, []);
  
  const hideModal = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
  }, []);
  
  return (
    <Animated.View
      ref={modalRef}
      style={[
        styles.modal,
        useAnimatedStyle(() => ({ opacity: opacity.value }))
      ]}
      accessible={visible}
      accessibilityViewIsModal={true}
      accessibilityRole="dialog"
    >
      {children}
    </Animated.View>
  );
};
```

## State Management Integration

### Zustand Integration
```typescript
import { create } from 'zustand';

interface AnimationStore {
  isAnimating: boolean;
  animationProgress: number;
  setAnimating: (animating: boolean) => void;
  updateProgress: (progress: number) => void;
}

const useAnimationStore = create<AnimationStore>((set) => ({
  isAnimating: false,
  animationProgress: 0,
  setAnimating: (animating) => set({ isAnimating: animating }),
  updateProgress: (progress) => set({ animationProgress: progress }),
}));

// Component using Zustand with animations
const AnimatedComponent = () => {
  const { isAnimating, setAnimating } = useAnimationStore();
  const progress = useSharedValue(0);
  
  const startAnimation = () => {
    setAnimating(true);
    progress.value = withTiming(
      1,
      { duration: 1000 },
      (finished) => {
        runOnJS(setAnimating)(false);
      }
    );
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));
  
  return <Animated.View style={animatedStyle} />;
};
```

### React Query Integration
```typescript
import { useQuery } from '@tanstack/react-query';

const DataWithLoadingAnimation = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
  
  const opacity = useSharedValue(isLoading ? 0.5 : 1);
  const scale = useSharedValue(isLoading ? 0.95 : 1);
  
  // Animate based on query states
  useEffect(() => {
    if (isLoading) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
      scale.value = withSpring(0.95);
    } else {
      opacity.value = withTiming(1);
      scale.value = withSpring(1);
    }
  }, [isLoading]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  if (error) return <ErrorComponent />;
  
  return (
    <Animated.View style={animatedStyle}>
      {data ? <DataComponent data={data} /> : <PlaceholderComponent />}
    </Animated.View>
  );
};
```

## Integration with Components
- All interactive components include press feedback
- Loading states use consistent pulse/spin animations  
- Form validation shows smooth error state transitions
- Navigation includes slide/fade transitions
- Gesture-based interactions follow platform conventions
- Respect user accessibility preferences (reduced motion)
- Maintain focus management during animated transitions

## Testing Animations

### Unit Testing Setup
```typescript
// jest.setup.js
import 'react-native-reanimated/lib/reanimated2/jestUtils';

// Mock Reanimated for tests
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    WebView: View,
    TapGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    LongPressGestureHandler: View,
    Gesture: {
      Pan: () => ({ onUpdate: jest.fn(), onEnd: jest.fn() }),
      Tap: () => ({ onEnd: jest.fn() }),
      Pinch: () => ({ onUpdate: jest.fn(), onEnd: jest.fn() }),
    },
  };
});
```

### Animation Testing Patterns
```typescript
import { render, act } from '@testing-library/react-native';

describe('AnimatedButton', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  it('should animate on press', async () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AnimatedButton onPress={onPress}>Press Me</AnimatedButton>
    );

    const button = getByText('Press Me');
    
    // Trigger press
    fireEvent.press(button);
    
    // Fast forward animation
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    // Verify callback was called
    expect(onPress).toHaveBeenCalled();
  });

  it('should respect reduced motion preference', () => {
    // Mock reduced motion
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);

    const { getByText } = render(<AnimatedButton>Test</AnimatedButton>);
    
    // Verify no animation styles are applied
    const button = getByText('Test');
    expect(button.props.style).not.toContain({ transform: expect.any(Array) });
  });
});
```

### Performance Testing
```typescript
// Performance benchmark test
import { Profiler } from 'react';

const performanceTest = () => {
  let renderCount = 0;
  let commitTime = 0;

  const onRender = (id, phase, actualDuration) => {
    renderCount++;
    commitTime += actualDuration;
  };

  render(
    <Profiler id="AnimationTest" onRender={onRender}>
      <AnimatedListWithManyItems items={largeDataSet} />
    </Profiler>
  );

  // Assert performance metrics
  expect(renderCount).toBeLessThan(5);
  expect(commitTime).toBeLessThan(100); // 100ms threshold
};
```

### E2E Animation Testing
```typescript
// Detox E2E test example
describe('Animation E2E', () => {
  it('should complete swipe gesture', async () => {
    await element(by.id('swipeable-item')).swipe('right', 'slow');
    await expect(element(by.id('delete-action'))).toBeVisible();
  });

  it('should handle complex gesture sequences', async () => {
    const item = element(by.id('draggable-item'));
    
    // Multi-touch gesture simulation
    await item.multiTap(2); // Double tap
    await expect(element(by.id('edit-mode'))).toBeVisible();
    
    await item.longPress(1000); // Long press
    await expect(element(by.id('context-menu'))).toBeVisible();
  });
});
```

## Debugging & Troubleshooting

### Common Issues and Solutions

#### Animation Not Running
```typescript
// ❌ Problem: Animation not starting
const opacity = useSharedValue(0);
opacity.value = 1; // Direct assignment won't animate

// ✅ Solution: Use animation functions
opacity.value = withTiming(1, { duration: 300 });
```

#### Poor Performance
```typescript
// ❌ Problem: Heavy computation in worklet
const animatedStyle = useAnimatedStyle(() => {
  const expensiveResult = heavyCalculation(someValue.value);
  return { opacity: expensiveResult };
});

// ✅ Solution: Pre-compute or use derived values
const processedValue = useDerivedValue(() => {
  return heavyCalculation(someValue.value);
});

const animatedStyle = useAnimatedStyle(() => ({
  opacity: processedValue.value,
}));
```

#### Gesture Conflicts
```typescript
// ❌ Problem: Conflicting gestures
const panGesture = Gesture.Pan();
const tapGesture = Gesture.Tap();

// ✅ Solution: Proper gesture composition
const composedGesture = Gesture.Race(
  Gesture.Pan().onUpdate(() => { /* pan logic */ }),
  Gesture.Tap().onEnd(() => { /* tap logic */ })
);
```

### Debug Tools
```typescript
// Animation debugging utility
const useAnimationDebugger = (sharedValue: SharedValue<number>, label: string) => {
  useDerivedValue(() => {
    if (__DEV__) {
      console.log(`[${label}] Animation value:`, sharedValue.value);
    }
  });
};

// Usage
const translateX = useSharedValue(0);
useAnimationDebugger(translateX, 'Pan Gesture X');
```

### Performance Monitoring
```typescript
// Monitor frame drops
const useFrameRateMonitor = () => {
  const frameCount = useSharedValue(0);
  const lastTimestamp = useSharedValue(0);
  
  useAnimatedReaction(
    () => {
      const now = Date.now();
      const deltaTime = now - lastTimestamp.value;
      lastTimestamp.value = now;
      frameCount.value++;
      
      if (deltaTime > 16.67) { // 60fps threshold
        console.warn('Frame drop detected:', deltaTime, 'ms');
      }
    },
    []
  );
};
```