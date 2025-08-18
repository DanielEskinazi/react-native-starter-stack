# Expo Router Documentation

## Overview
Expo Router is a file-based routing library designed for React Native and web applications. It simplifies navigation management by using a file-based system that automatically generates routes based on your file structure, built on top of React Navigation.

## Core Concepts

### File-Based Routing Rules
1. **All screens/pages are files inside the `app` directory**
2. **All pages have a URL path matching their file location**
3. **The first `index.tsx` file found is the initial route**
4. **A root `_layout.tsx` file replaces `App.jsx/tsx` for initialization**
5. **Non-navigation components should live outside the app directory**
6. **Expo Router is built on top of React Navigation**

### File Structure to Route Mapping
```typescript
Project Structure:
app/index.tsx           -> / (root route)
app/home.tsx           -> /home
app/_layout.tsx        -> Root layout for initialization
app/profile/friends.tsx -> /profile/friends
app/users/[id].tsx     -> /users/:id (dynamic route)
app/(tabs)/index.tsx   -> / (grouped route)
app/+not-found.tsx     -> 404 Not Found route

components/TextField.tsx -> Not a route (outside app directory)
```

## Installation and Setup

### Basic Installation
```bash
npm install expo-router
# or
yarn add expo-router
```

### Configure Plugin in app.json
```json
{
  "expo": {
    "plugins": ["expo-router"]
  }
}
```

### Root Layout Setup (app/_layout.tsx)
```javascript
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
    </Stack>
  );
}
```

### Home Route (app/index.tsx)
```javascript
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link href="/about">Go to About</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Navigation

### Declarative Navigation with Link
```javascript
import { Link } from 'expo-router';
import { View } from 'react-native';

export default function Page() {
  return (
    <View>
      {/* Simple navigation */}
      <Link href="/about">About</Link>
      
      {/* Navigation with query parameters */}
      <Link href="/users?limit=20">View users</Link>
      
      {/* Dynamic route navigation */}
      <Link href="/user/bacon">View user</Link>
      
      {/* Object-based href with params */}
      <Link
        href={{
          pathname: '/user/[id]',
          params: { id: 'bacon' }
        }}
      >
        View user
      </Link>
      
      {/* Custom touchable component */}
      <Link href="/other" asChild>
        <Pressable>
          <Text>Custom Button</Text>
        </Pressable>
      </Link>
    </View>
  );
}
```

### Imperative Navigation with useRouter
```javascript
import { useRouter } from 'expo-router';
import { Button, Pressable, Text } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View>
      {/* Basic navigation */}
      <Button 
        title="Go to About" 
        onPress={() => router.navigate('/about')} 
      />
      
      {/* Push new screen */}
      <Button 
        title="Push Profile" 
        onPress={() => router.push('/profile')} 
      />
      
      {/* Replace current screen */}
      <Button 
        title="Replace with Login" 
        onPress={() => router.replace('/login')} 
      />
      
      {/* Go back */}
      <Button 
        title="Go Back" 
        onPress={() => router.back()} 
      />
      
      {/* Update current route parameters */}
      <Pressable onPress={() => router.setParams({ limit: 50 })}>
        <Text>View more users</Text>
      </Pressable>
    </View>
  );
}
```

### Navigation API Reference
```javascript
// Navigation methods available via useRouter()
router.navigate(href, params?)  // Navigate to route (unwind if exists)
router.push(href, params?)      // Always push new instance
router.replace(href, params?)   // Replace current route
router.back()                   // Go back one screen
router.setParams(params)        // Update current route parameters
```

## Route Types

### Static Routes
Files with regular names create static routes:
```typescript
app/home.tsx           -> /home
app/feed/favorites.tsx -> /feed/favorites
```

### Dynamic Routes
Use square brackets for dynamic segments:
```typescript
app/[userName].tsx              -> /:userName
app/products/[productId].tsx    -> /products/:productId
app/users/[id]/posts/[postId].tsx -> /users/:id/posts/:postId
```

### Catch-All Routes
Use `[...param]` for catch-all segments:
```typescript
app/blog/[...slug].tsx -> /blog/* (matches /blog/a, /blog/a/b, etc.)
```

### Index Files
`index.tsx` files serve as default routes:
```typescript
app/index.tsx          -> / (root)
app/profile/index.tsx  -> /profile
app/(tabs)/index.tsx   -> / (grouped default)
```

## Accessing Route Parameters

### useLocalSearchParams Hook
```javascript
import { useLocalSearchParams } from 'expo-router';

export default function UserProfile() {
  const { id, limit } = useLocalSearchParams();

  return (
    <View>
      <Text>User ID: {id}</Text>
      <Text>Limit: {limit}</Text>
    </View>
  );
}
```

### useGlobalSearchParams Hook
```javascript
import { useGlobalSearchParams } from 'expo-router';

// Access parameters from any level of the route hierarchy
export default function Component() {
  const globalParams = useGlobalSearchParams();
  console.log(globalParams);
}
```

## Layout Types

### Stack Navigator
```javascript
import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen 
        name="modal" 
        options={{ presentation: 'modal' }} 
      />
    </Stack>
  );
}
```

### Tabs Navigator
```javascript
import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Slot Layout
Use for custom layouts without navigation:
```javascript
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <>
      <Header />
      <Slot />
      <Footer />
    </>
  );
}
```

## Route Groups

### Basic Groups
Use parentheses `()` to organize routes without affecting the URL:
```typescript
app/(tabs)/
  _layout.tsx    -> Tab navigator layout
  index.tsx      -> /
  profile.tsx    -> /profile
app/(auth)/
  _layout.tsx    -> Auth layout
  login.tsx      -> /login
  register.tsx   -> /register
```

### Group Layout Example
```javascript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

## Advanced Features

### Not Found Routes
Create custom 404 screens:
```javascript
// app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist." }} />
      <View style={styles.container}>
        <Link href="/">Go to home screen</Link>
      </View>
    </>
  );
}
```

### Modal Presentation
```javascript
// Configure modal in layout
<Stack.Screen 
  name="modal" 
  options={{ 
    presentation: 'modal',
    headerShown: false 
  }} 
/>
```

### Deep Linking Configuration
```javascript
// Configure initial route for proper deep linking
export const unstable_settings = {
  initialRouteName: 'index',
};
```

### Redirects
```javascript
// Programmatic redirect
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/home" />;
}

// Imperative redirect
import { useRouter, useFocusEffect } from 'expo-router';

function MyScreen() {
  const router = useRouter();

  useFocusEffect(() => {
    router.replace('/profile/settings');
  });
}
```

### Static Redirects in app.json
```json
{
  "plugins": [
    [
      "expo-router",
      {
        "redirects": [
          {
            "source": "/old-path",
            "destination": "/new-path"
          },
          {
            "source": "/redirect/[slug]",
            "destination": "/target/[slug]"
          }
        ]
      }
    ]
  ]
}
```

## Typed Routes

### Enable Typed Routes
```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Using Typed Routes
```javascript
// TypeScript will validate these routes
✅ <Link href="/about" />
✅ <Link href="/user/1" />
✅ <Link href={{ pathname: "/user/[id]", params: { id: 1 }}} />

// TypeScript will error on invalid routes
❌ <Link href="/invalid-route" />
❌ <Link href={{ pathname: "/user/[id]", params: { wrongParam: 1 }}} />
```

### Typed Hook Usage
```javascript
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  // Strongly typed parameters
  const { profile, search } = useLocalSearchParams<'/[profile]/[...search]'>();
  
  return (
    <View>
      <Text>Profile: {profile}</Text>
      <Text>Search: {search.join(',')}</Text>
    </View>
  );
}
```

## Testing

### Mock Router for Testing
```javascript
import { renderRouter, screen } from 'expo-router/testing-library';

// Test with mock routes
it('navigates correctly', async () => {
  renderRouter(['index', 'about', 'users/[id]'], {
    initialUrl: '/about',
  });
  
  expect(screen).toHavePathname('/about');
});

// Test with component mapping
it('renders components', async () => {
  const MockComponent = jest.fn(() => <View />);
  
  renderRouter({
    index: MockComponent,
    about: MockComponent,
  });
});
```

## API Routes

### Basic API Route
```javascript
// app/api/hello+api.ts
export function GET(request: Request) {
  return Response.json({ hello: 'world' });
}

export function POST(request: Request) {
  return Response.json({ message: 'Created' });
}
```

### Dynamic API Route
```javascript
// app/api/posts/[id]+api.ts
export async function GET(request: Request, { id }: { id: string }) {
  // Fetch post by id
  return Response.json({ id, title: 'Post title' });
}
```

## Migration from React Navigation

### Parameter Access Migration
```javascript
// React Navigation
export default function Page({ route }) {
  const user = route?.params?.user;
}

// Expo Router
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
  const { user } = useLocalSearchParams();
}
```

### Navigation Migration
```javascript
// React Navigation
navigation.navigate('Profile', { userId: 1 });

// Expo Router
router.push('/profile/1');
// or
router.push({
  pathname: '/profile/[id]',
  params: { id: '1' }
});
```

## Best Practices

### File Organization
1. **Keep non-route components outside `app` directory**
2. **Use route groups `()` to organize without affecting URLs**
3. **Create `_layout.tsx` files for shared navigation structures**
4. **Use `index.tsx` for default routes in directories**

### Navigation Patterns
1. **Use `Link` for declarative navigation**
2. **Use `router` hooks for programmatic navigation**
3. **Implement proper deep linking with `initialRouteName`**
4. **Handle loading states properly in root layouts**

### Performance
1. **Use `prefetch` prop on Links for faster navigation**
2. **Implement proper error boundaries**
3. **Handle navigation events carefully in prefetched screens**

### Type Safety
1. **Enable typed routes for better development experience**
2. **Use proper TypeScript types for route parameters**
3. **Validate route parameters at runtime when needed**

## Common Patterns

### Tab Navigator with Stack
```javascript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

// app/(tabs)/(home)/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function HomeLayout() {
  return <Stack />;
}
```

### Authentication Flow
```javascript
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>
    </Stack>
  );
}
```

### Modal Navigation
```javascript
// Link to modal
<Link href="/modal">Open modal</Link>

// Programmatic modal
router.push('/modal');

// Modal layout configuration
<Stack.Screen 
  name="modal" 
  options={{ 
    presentation: 'modal',
    headerTitle: 'Modal Screen'
  }} 
/>
```

This documentation covers the essential concepts and usage patterns for Expo Router, providing a comprehensive guide for file-based routing in React Native applications.