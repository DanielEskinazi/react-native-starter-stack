# React Native Safe Area Context Documentation

## Overview
React Native Safe Area Context provides a flexible way to handle safe area insets in React Native applications, supporting Android, iOS, web, macOS, and Windows platforms. It offers components and hooks to manage safe areas around system elements like status bars, notches, and navigation bars.

## Core Components and Hooks

### SafeAreaProvider
The root component that provides safe area context to all descendant components. Must be placed at the top of your application.

```javascript
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <YourAppContent />
    </SafeAreaProvider>
  );
}
```

**Props:**
- Inherits all React Native `View` props
- `initialMetrics` (optional): Provides initial frame and insets for immediate rendering optimization
- Default style: `{flex: 1}`

### SafeAreaView
The preferred component for consuming safe area insets. Automatically applies insets as padding or margin with better performance than hook-based solutions.

```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
      <View style={{ flex: 1, backgroundColor: 'blue' }} />
    </SafeAreaView>
  );
}
```

**Props:**
- Inherits all React Native `View` props
- `edges`: Array or object specifying which edges to apply insets to
- `mode`: Controls whether insets are applied as 'padding' (default) or 'margin'

**Edge Configuration Examples:**
```javascript
// Array format - specific edges
<SafeAreaView edges={['top', 'left', 'right']} />

// Object format with modes
<SafeAreaView 
  style={{paddingBottom: 24}} 
  edges={{bottom: 'maximum'}} 
/>
```

**Modes:**
- `'additive'`: Adds safe area insets to existing padding/margin
- `'maximum'`: Uses the maximum of safe area insets or existing padding/margin

### useSafeAreaInsets Hook
Provides direct access to safe area inset values. Use when you need more control over how insets are applied.

```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MyComponent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, 16)
    }}>
      <Text>Top inset: {insets.top}</Text>
      <Text>Bottom inset: {insets.bottom}</Text>
    </View>
  );
}
```

**Returns:**
```javascript
{
  top: number,
  bottom: number,
  left: number,
  right: number
}
```

### useSafeAreaFrame Hook
Returns the frame dimensions of the nearest safe area provider.

```javascript
import { useSafeAreaFrame } from 'react-native-safe-area-context';

function MyComponent() {
  const frame = useSafeAreaFrame();

  return (
    <View style={{ 
      width: frame.width, 
      height: frame.height 
    }}>
      {/* Your content */}
    </View>
  );
}
```

**Returns:**
```javascript
{
  x: number,
  y: number,
  width: number,
  height: number
}
```

### SafeAreaListener
Component that listens for safe area changes without triggering re-renders.

```javascript
import { SafeAreaListener } from 'react-native-safe-area-context';

function Component() {
  return (
    <SafeAreaListener
      onChange={({ insets, frame }) => {
        console.log('Safe area changed:', { insets, frame });
      }}>
      {/* Your content */}
    </SafeAreaListener>
  );
}
```

**Props:**
- Inherits all React Native `View` props
- `onChange`: Required callback function called when insets or frame change

## Context API

### SafeAreaInsetsContext
Direct context access for class components or advanced use cases.

```javascript
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

class ClassComponent extends React.Component {
  render() {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) => (
          <View style={{ paddingTop: insets?.top || 0 }} />
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}
```

### SafeAreaFrameContext
Direct context access for frame information.

```javascript
import React, { useContext } from 'react';
import { SafeAreaFrameContext } from 'react-native-safe-area-context';

function MyComponent() {
  const frame = useContext(SafeAreaFrameContext);

  if (!frame) {
    return null;
  }

  return (
    <View style={{ 
      marginTop: frame.top, 
      marginLeft: frame.left 
    }}>
      {/* Content */}
    </View>
  );
}
```

### Higher-Order Component (HOC)
Use `withSafeAreaInsets` for class components.

```javascript
import { withSafeAreaInsets, WithSafeAreaInsetsProps } from 'react-native-safe-area-context';

type Props = WithSafeAreaInsetsProps & {
  someProp: number;
};

class ClassComponent extends React.Component<Props> {
  render() {
    return (
      <View style={{ paddingTop: this.props.insets.top }} />
    );
  }
}

const ClassComponentWithInsets = withSafeAreaInsets(ClassComponent);
```

## Installation and Setup

### Installation
```bash
npm install react-native-safe-area-context
# or
yarn add react-native-safe-area-context
```

### Basic Setup
```javascript
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* Your app content */}
    </SafeAreaProvider>
  );
}
```

### Optimized Setup with Initial Metrics
```javascript
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* Your app content */}
    </SafeAreaProvider>
  );
}
```

## Common Patterns

### Screen with Safe Areas
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>This content respects safe areas</Text>
    </SafeAreaView>
  );
}
```

### Custom Safe Area Implementation
```javascript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CustomScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ 
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <Text>Custom safe area handling</Text>
    </View>
  );
}
```

### Bottom Tab Bar Safe Area
```javascript
function TabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      paddingBottom: insets.bottom,
      backgroundColor: 'white',
    }}>
      {/* Tab bar content */}
    </View>
  );
}
```

### Modal with Safe Areas
```javascript
function Modal() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Modal content */}
      </View>
      <SafeAreaView edges={['bottom']}>
        {/* Bottom buttons */}
      </SafeAreaView>
    </SafeAreaView>
  );
}
```

## Testing

### Jest Mock
```javascript
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
```

### Custom Test Provider
```javascript
export function TestSafeAreaProvider({ children }) {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 375, height: 812 },
        insets: { top: 44, left: 0, right: 0, bottom: 34 },
      }}
    >
      {children}
    </SafeAreaProvider>
  );
}
```

### Jest Transform Configuration
```javascript
// jest.config.js
module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-safe-area-context)/)'
  ],
};
```

## Initial Window Metrics

### Structure
```typescript
{
  frame: { x: number, y: number, width: number, height: number },
  insets: { top: number, left: number, right: number, bottom: number },
}
```

### Usage for SSR Optimization
```javascript
import { initialWindowMetrics } from 'react-native-safe-area-context';

// Access initial metrics before provider setup
console.log(initialWindowMetrics);
```

## Deprecated APIs

**Avoid these deprecated APIs:**

### ❌ useSafeArea (deprecated)
```javascript
// DON'T USE
import { useSafeArea } from 'react-native-safe-area-context';
const insets = useSafeArea();

// USE INSTEAD
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const insets = useSafeAreaInsets();
```

### ❌ SafeAreaConsumer (deprecated)
```javascript
// DON'T USE
import { SafeAreaConsumer } from 'react-native-safe-area-context';

// USE INSTEAD
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
<SafeAreaInsetsContext.Consumer>
  {insets => <YourComponent insets={insets} />}
</SafeAreaInsetsContext.Consumer>
```

### ❌ initialWindowSafeAreaInsets (deprecated)
```javascript
// DON'T USE
import { initialWindowSafeAreaInsets } from 'react-native-safe-area-context';

// USE INSTEAD
import { initialWindowMetrics } from 'react-native-safe-area-context';
console.log(initialWindowMetrics.insets);
```

## Performance Tips

1. **Use SafeAreaView when possible**: It offers better performance than hooks
2. **Avoid unnecessary re-renders**: Use SafeAreaListener for change notifications without re-renders
3. **Optimize initial render**: Use `initialWindowMetrics` with `SafeAreaProvider`
4. **Choose appropriate edges**: Only apply insets where needed using the `edges` prop
5. **Consider mode selection**: Use 'maximum' mode for consistent spacing across devices

## Best Practices

1. **Always wrap your app** with `SafeAreaProvider`
2. **Use SafeAreaView for screens** - it's the recommended approach
3. **Use hooks for custom layouts** when you need fine-grained control
4. **Handle edge cases** - check for null values when using context directly
5. **Test on multiple devices** with different safe area configurations
6. **Use appropriate edges** - not all screens need all safe area edges
7. **Consider performance** - SafeAreaView is generally faster than hooks

This documentation covers the essential concepts and usage patterns for React Native Safe Area Context, providing safe area management across all supported platforms.