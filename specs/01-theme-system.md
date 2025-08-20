# Theme System Specification

## Overview
Define a comprehensive theme system for the React Native Starter Stack that provides consistent design tokens, colors, typography, and spacing throughout the application.

## Goals
- Centralized design system with TypeScript support
- Dark/light mode capability
- Consistent spacing and typography scales
- Easy to use and maintain
- No external dependencies

## File Structure
```
src/theme/
├── index.ts              # Main theme exports
├── colors.ts             # Color definitions
├── typography.ts         # Font sizes, weights, line heights
├── spacing.ts            # Spacing scale
├── breakpoints.ts        # Screen size breakpoints
└── types.ts              # TypeScript type definitions
```

## Color System
- **Primary**: Blue scale (#007AFF family)
- **Secondary**: Orange/Red accents (#FF6B35, #FF6B6B)
- **Neutral**: Grays for text and backgrounds
- **Semantic**: Success (green), warning (yellow), error (red)
- **Support for light/dark modes**

## Typography Scale
- **Display**: Large headings (32px, 28px, 24px)
- **Heading**: Section headers (20px, 18px, 16px)
- **Body**: Regular text (16px, 14px)
- **Caption**: Small text (12px, 10px)
- **Font weights**: Regular (400), Medium (500), Bold (700)

## Spacing System
- Based on 8px grid system
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Named tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl

## Usage Pattern
```typescript
import { theme } from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.heading.large,
    color: theme.colors.text.primary,
  },
});
```

## Theme Context
- React Context for theme switching
- useTheme hook for components
- Automatic persistence of theme preference
- System theme detection support