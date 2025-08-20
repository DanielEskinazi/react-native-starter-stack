# Component Library Specification

## Overview
Build a comprehensive set of reusable components using React Native StyleSheet and our theme system, with integrated animation and gesture support.

## Design Principles
- **Consistent**: All components follow theme system
- **Accessible**: Proper accessibility props and behavior
- **Performant**: Optimized StyleSheet usage, no unnecessary re-renders
- **Flexible**: Configurable props with sensible defaults
- **Animated**: Smooth micro-interactions using Reanimated

## Component Structure
```
src/components/
├── index.ts              # Component exports
├── base/                 # Foundation components
│   ├── Box.tsx           # Flexible container with theme spacing
│   ├── Text.tsx          # Typography component with variants
│   └── Pressable.tsx     # Enhanced TouchableOpacity with animations
├── form/                 # Form components
│   ├── Input.tsx         # Text input with validation states
│   ├── Button.tsx        # Primary, secondary, ghost variants
│   └── Switch.tsx        # Animated toggle switch
├── layout/               # Layout components
│   ├── Screen.tsx        # Safe area wrapper with common patterns
│   ├── Card.tsx          # Content container with shadows
│   └── Divider.tsx       # Separator line
├── feedback/             # User feedback
│   ├── Alert.tsx         # Inline alerts/notifications
│   ├── Spinner.tsx       # Loading indicators
│   └── Toast.tsx         # Temporary notifications
└── navigation/           # Navigation aids
    ├── TabBar.tsx        # Custom tab navigation
    └── Header.tsx        # Screen headers
```

## Component API Design
Each component follows consistent patterns:

```typescript
// Props interface with theme integration
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  // Style overrides
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// Animation integration
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  onPress,
  children,
  ...props 
}) => {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    onPress?.();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={handlePress} style={getButtonStyles(variant, size)}>
        <Text style={getTextStyles(variant, size)}>{children}</Text>
      </Pressable>
    </Animated.View>
  );
};
```

## Core Components Priority
1. **Box** - Foundation layout component
2. **Text** - Typography with theme variants
3. **Button** - Primary interaction component
4. **Input** - Form input with validation
5. **Screen** - Page wrapper with safe areas
6. **Card** - Content container

## Animation Standards
- **Press feedback**: 95% scale on touch
- **Loading states**: Gentle pulse or spin
- **Transitions**: 200-300ms spring animations
- **Gestures**: Integrated with react-native-gesture-handler

## Testing Strategy
- Storybook-style component preview screens
- Unit tests for component logic
- Visual regression testing
- Accessibility testing with react-native-testing-library