# Expo Linear Gradient Documentation

## Overview
`expo-linear-gradient` provides a native linear gradient component for React Native applications. It allows you to create smooth color transitions in your UI elements.

## Installation
```bash
npx expo install expo-linear-gradient
```

## Basic Usage

### Import
```tsx
import { LinearGradient } from 'expo-linear-gradient';
```

### Simple Gradient
```tsx
<LinearGradient
  colors={['#FF6B6B', '#4ECDC4']}
  style={{ flex: 1 }}
>
  <Text>Content here</Text>
</LinearGradient>
```

## Props

### colors (required)
- **Type**: `string[]`
- **Description**: Array of colors for the gradient
- **Example**: `['#FF6B6B', '#4ECDC4', '#45B7D1']`

### start
- **Type**: `{ x: number, y: number }`
- **Default**: `{ x: 0.5, y: 0 }`
- **Description**: Starting point of gradient (0-1 range)
- **Examples**:
  - `{ x: 0, y: 0 }` - Top left
  - `{ x: 1, y: 0 }` - Top right
  - `{ x: 0, y: 1 }` - Bottom left

### end
- **Type**: `{ x: number, y: number }`
- **Default**: `{ x: 0.5, y: 1 }`
- **Description**: Ending point of gradient (0-1 range)
- **Examples**:
  - `{ x: 1, y: 1 }` - Bottom right
  - `{ x: 0, y: 1 }` - Bottom left
  - `{ x: 1, y: 0 }` - Top right

### locations
- **Type**: `number[]`
- **Description**: Array of numbers defining color stop positions (0-1 range)
- **Example**: `[0, 0.3, 1]` for three colors

## Common Patterns

### Horizontal Gradient
```tsx
<LinearGradient
  colors={['#667eea', '#764ba2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.container}
>
  <Text>Horizontal gradient</Text>
</LinearGradient>
```

### Vertical Gradient
```tsx
<LinearGradient
  colors={['#FFD89B', '#19547B']}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.container}
>
  <Text>Vertical gradient</Text>
</LinearGradient>
```

### Diagonal Gradient
```tsx
<LinearGradient
  colors={['#667eea', '#764ba2']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.container}
>
  <Text>Diagonal gradient</Text>
</LinearGradient>
```

### Multiple Colors with Locations
```tsx
<LinearGradient
  colors={['#ff9a9e', '#fecfef', '#fecfef']}
  locations={[0, 0.5, 1]}
  style={styles.container}
>
  <Text>Custom color stops</Text>
</LinearGradient>
```

## Styling Tips

### Button with Gradient
```tsx
const GradientButton = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={{
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {children}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);
```

### Card with Gradient Background
```tsx
<LinearGradient
  colors={['#a8edea', '#fed6e3']}
  style={{
    padding: 20,
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  }}
>
  <Text>Card content</Text>
</LinearGradient>
```

## Performance Notes
- Linear gradients are rendered natively, providing good performance
- Avoid creating many complex gradients in lists without proper optimization
- Consider using `getItemLayout` for FlatLists containing gradient items

## Common Color Combinations

### Sunset
```tsx
colors={['#ff9a9e', '#fecfef']}
```

### Ocean
```tsx
colors={['#667eea', '#764ba2']}
```

### Forest
```tsx
colors={['#56ab2f', '#a8e6cf']}
```

### Purple Dream
```tsx
colors={['#667eea', '#764ba2', '#f093fb']}
```

### Warm Flame
```tsx
colors={['#ff6b6b', '#feca57']}
```

## Troubleshooting

### Gradient Not Showing
- Ensure the container has proper dimensions (width/height)
- Check that colors array is not empty
- Verify color format (use hex codes: `#FF6B6B`)

### Performance Issues
- Limit the number of simultaneous gradients on screen
- Use `shouldRasterizeIOS` prop for complex gradient layouts
- Consider caching gradient styles

## Integration with Other Libraries

### React Native Reanimated
```tsx
import Animated from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Use in animated components
<AnimatedLinearGradient
  colors={['#667eea', '#764ba2']}
  style={animatedStyle}
>
  <Text>Animated gradient</Text>
</AnimatedLinearGradient>
```

This documentation covers the essential usage patterns and configurations for expo-linear-gradient in React Native applications.