# React Native Theme System

A comprehensive, TypeScript-first theme system for React Native applications that provides consistent design tokens, dark/light mode support, and reusable styling patterns.

## 🎯 Overview

This theme system is designed to be:
- **Reusable**: Copy to any React Native project as boilerplate
- **Type-safe**: Full TypeScript support with intellisense
- **Flexible**: Easy customization for different brands/apps
- **Performant**: Optimized for React Native performance
- **Accessible**: Built-in dark/light mode with system detection

## 📁 File Structure

```
src/theme/
├── index.ts           # Main exports and theme creation
├── types.ts           # TypeScript type definitions
├── colors.ts          # Color system and palettes
├── typography.ts      # Typography variants and scales
├── spacing.ts         # Spacing, shadows, and border radius
├── breakpoints.ts     # Responsive design utilities
├── context.tsx        # React Context and hooks
└── README.md         # This documentation
```

## 🚀 Quick Start

### 1. Setup Theme Provider

```tsx
// App.tsx or _layout.tsx
import { ThemeProvider } from './src/theme';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use Theme in Components

```tsx
import { useTheme, createThemedStyles } from './src/theme';

function MyComponent() {
  const { theme, toggleMode } = useTheme();
  
  const styles = createThemedStyles(theme, (t) => ({
    container: {
      backgroundColor: t.colors.background.primary,
      padding: t.spacing.md,
      borderRadius: t.borderRadius.md,
    },
    title: {
      ...t.typography.variants.heading.h1,
      color: t.colors.text.primary,
    },
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Theme!</Text>
      <Button onPress={toggleMode}>Toggle Dark Mode</Button>
    </View>
  );
}
```

## 🎨 Design System

### Colors

The color system uses semantic color palettes with 10 shades each:

```tsx
// Access colors
theme.colors.colors.primary[500]    // Primary brand color
theme.colors.colors.secondary[600]  // Secondary accent
theme.colors.colors.success[500]    // Success green
theme.colors.colors.warning[500]    // Warning amber
theme.colors.colors.error[500]      // Error red
theme.colors.colors.neutral[500]    // Neutral gray

// Contextual colors (auto-generated for light/dark)
theme.colors.background.primary     // Main background
theme.colors.text.primary          // Main text color
theme.colors.border.primary        // Border color
```

#### Custom Color Palettes

```tsx
import { createColorPalette, createTheme } from './src/theme';

const customTheme = createTheme({
  colors: {
    primary: createColorPalette('#FF6B35'),   // Your brand color
    secondary: createColorPalette('#007AFF'),
  },
});
```

### Typography

Comprehensive typography system with semantic variants:

```tsx
// Display text (large, attention-grabbing)
theme.typography.variants.display.large
theme.typography.variants.display.medium
theme.typography.variants.display.small

// Headings (section headers)
theme.typography.variants.heading.h1
theme.typography.variants.heading.h2
theme.typography.variants.heading.h3
theme.typography.variants.heading.h4
theme.typography.variants.heading.h5
theme.typography.variants.heading.h6

// Body text (main content)
theme.typography.variants.body.large
theme.typography.variants.body.medium
theme.typography.variants.body.small

// Caption text (metadata, helper text)
theme.typography.variants.caption.large
theme.typography.variants.caption.small

// Special purpose
theme.typography.variants.button
theme.typography.variants.label
theme.typography.variants.code
```

#### Custom Fonts

```tsx
const customTheme = createTheme({
  fonts: {
    sans: 'CustomFont-Regular',
    serif: 'CustomSerif-Regular',
    mono: 'CustomMono-Regular',
  },
});
```

### Spacing

8px grid system for consistent spacing:

```tsx
theme.spacing.xs    // 4px
theme.spacing.sm    // 8px
theme.spacing.md    // 16px
theme.spacing.lg    // 24px
theme.spacing.xl    // 32px
theme.spacing['2xl'] // 40px
theme.spacing['3xl'] // 48px
theme.spacing['4xl'] // 64px
```

### Shadows

Consistent elevation system:

```tsx
theme.shadows.none
theme.shadows.small
theme.shadows.medium
theme.shadows.large
theme.shadows.extraLarge
```

### Border Radius

Scalable radius system:

```tsx
theme.borderRadius.none  // 0
theme.borderRadius.xs    // 2px
theme.borderRadius.sm    // 4px
theme.borderRadius.md    // 8px
theme.borderRadius.lg    // 12px
theme.borderRadius.xl    // 16px
theme.borderRadius.full  // 9999px (pill shape)
```

## 🌙 Dark Mode

### Automatic System Detection

```tsx
<ThemeProvider followSystemTheme={true}>
  <App />
</ThemeProvider>
```

### Manual Control

```tsx
const { theme, toggleMode, setMode } = useTheme();

// Toggle between light/dark
toggleMode();

// Set specific mode
setMode('dark');
setMode('light');

// Check current mode
if (theme.mode === 'dark') {
  // Dark mode specific logic
}
```

### Theme Persistence

Themes are automatically persisted to AsyncStorage and restored on app launch.

## 📱 Responsive Design

### Breakpoints

```tsx
import { getCurrentBreakpoint, isBreakpointUp } from './src/theme';

// Get current breakpoint
const currentSize = getCurrentBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Check breakpoints
const isTablet = isBreakpointUp('md');
const isMobile = isBreakpointDown('md');
```

### Responsive Values

```tsx
const { useResponsiveValue } = useTheme();

const fontSize = useResponsiveValue({
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
});
```

## 🔧 Advanced Usage

### Custom Theme Creation

```tsx
import { createTheme, createColorPalette } from './src/theme';

const brandTheme = createTheme({
  // Custom colors
  colors: {
    primary: createColorPalette('#FF6B35'),
    secondary: createColorPalette('#007AFF'),
  },
  
  // Custom fonts
  fonts: {
    sans: 'Inter-Regular',
    serif: 'Crimson-Regular',
  },
  
  // Custom spacing (optional)
  spacing: {
    xs: 2,
    sm: 4,
    md: 8,
    // ... rest will use defaults
  },
  
  // Theme metadata
  name: 'Brand Theme',
  mode: 'light',
});
```

### Theme Merging

```tsx
import { mergeThemes, lightTheme } from './src/theme';

const customTheme = mergeThemes(lightTheme, {
  colors: {
    colors: {
      primary: createColorPalette('#FF6B35'),
    },
  },
});
```

### Styled Components Pattern

```tsx
const createStyledComponent = <T extends Record<string, any>>(
  stylesFn: (theme: Theme) => T
) => {
  return (props: any) => {
    const { theme } = useTheme();
    const styles = stylesFn(theme);
    return <View style={styles.container} {...props} />;
  };
};

const Card = createStyledComponent((theme) => ({
  container: {
    backgroundColor: theme.colors.surface.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
}));
```

## 🎯 Theme Hooks

### useTheme()
Main theme hook with full context access:

```tsx
const {
  theme,                    // Current theme object
  toggleMode,              // Toggle light/dark
  setMode,                 // Set specific mode
  updateTheme,             // Update theme config
  isSystemThemeEnabled,    // Is following system theme?
  setSystemThemeEnabled,   // Enable/disable system theme
} = useTheme();
```

### useCurrentTheme()
Get just the theme object:

```tsx
const theme = useCurrentTheme();
```

### useThemeColors()
Get just the colors:

```tsx
const colors = useThemeColors();
```

### useThemeTypography()
Get just the typography:

```tsx
const typography = useThemeTypography();
```

### useThemeSpacing()
Get just the spacing:

```tsx
const spacing = useThemeSpacing();
```

## 🛠 Utilities

### createThemedStyles()
Create styles with theme access:

```tsx
const styles = createThemedStyles(theme, (t) => ({
  container: {
    backgroundColor: t.colors.background.primary,
    padding: t.spacing.md,
  },
}));
```

### getThemeTokens()
Quick access to common tokens:

```tsx
const tokens = getThemeTokens(theme);
const primaryColor = tokens.primary;
const mediumSpacing = tokens.spacingMd;
```

## 🎨 Customization Examples

### Brand Colors

```tsx
// Define your brand colors
const brandColors = {
  primary: createColorPalette('#FF6B35'),    // Orange
  secondary: createColorPalette('#007AFF'),  // Blue
  success: createColorPalette('#34C759'),    // Green
};

const brandTheme = createTheme({
  colors: brandColors,
  name: 'Brand Theme',
});
```

### Custom Typography

```tsx
const typographyTheme = createTheme({
  fonts: {
    sans: 'Inter-Regular',
    serif: 'Crimson-Regular',
    mono: 'FiraCode-Regular',
  },
});
```

### Different Spacing Scale

```tsx
const compactTheme = createTheme({
  spacing: createSpacingScale(4), // 4px base instead of 8px
});
```

## 📦 Copying to New Projects

This theme system is designed as reusable boilerplate:

1. **Copy the entire `src/theme/` folder** to your new project
2. **Install dependencies**: Ensure you have `@react-native-async-storage/async-storage`
3. **Add ThemeProvider** to your app root
4. **Customize** colors, fonts, and spacing as needed
5. **Start building** with consistent design tokens!

## 🔍 TypeScript Support

Full TypeScript support with:
- **Intellisense** for all theme properties
- **Type safety** for color tokens, spacing, and typography
- **Autocomplete** for theme utilities
- **Error detection** for invalid theme usage

## 🎭 Examples in Action

Check `app/index.tsx` to see the theme system in action with:
- Theme provider setup
- Dark/light mode toggle
- Themed styling patterns
- Typography usage
- Color system implementation

## 🤝 Contributing

When extending this theme system:
1. **Maintain TypeScript types** for new additions
2. **Follow naming conventions** (semantic color names, consistent spacing)
3. **Add examples** for new features
4. **Test dark/light modes** for new components
5. **Update this README** with new features

---

**Happy theming!** 🎨 This system provides a solid foundation for consistent, maintainable React Native applications.