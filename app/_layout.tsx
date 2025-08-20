import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/theme';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="components" options={{ title: 'Component Library' }} />
            <Stack.Screen name="input-test" options={{ title: 'Input Test' }} />
            <Stack.Screen name="about" options={{ title: 'About' }} />
            <Stack.Screen name="gestures" options={{ title: 'Gestures Test' }} />
            <Stack.Screen name="zustand" options={{ title: 'Zustand State Management' }} />
            <Stack.Screen name="storage" options={{ title: 'AsyncStorage Test' }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}