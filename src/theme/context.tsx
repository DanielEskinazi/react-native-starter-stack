/**
 * Theme Context & Hooks
 * 
 * React Context and hooks for theme management, including theme switching,
 * persistence, and system theme detection.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeConfig, ThemeContextValue } from './types';
import { createTheme } from './theme';

// ===== CONSTANTS =====

const THEME_STORAGE_KEY = '@theme_preference';
const THEME_MODE_STORAGE_KEY = '@theme_mode';

// ===== CONTEXT CREATION =====

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ===== UTILITY FUNCTIONS =====

/**
 * Extract theme configuration from theme object
 * (Helper function to reverse-engineer config from theme)
 */
function extractThemeConfig(theme: Theme): ThemeConfig {
  return {
    name: theme.name,
    mode: theme.mode,
    // Note: In a real implementation, you might want to store
    // the original config separately to avoid this reverse-engineering
  };
}

// ===== THEME PROVIDER PROPS =====

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Theme;
  initialConfig?: ThemeConfig;
  persistTheme?: boolean;
  followSystemTheme?: boolean;
}

// ===== THEME PROVIDER COMPONENT =====

/**
 * Theme Provider Component
 * 
 * Provides theme context to the app with persistence and system theme detection.
 * 
 * @param children - React children
 * @param initialTheme - Initial theme (optional)
 * @param initialConfig - Initial theme configuration (optional)
 * @param persistTheme - Whether to persist theme preference (default: true)
 * @param followSystemTheme - Whether to follow system theme (default: true)
 * 
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  initialConfig,
  persistTheme = true,
  followSystemTheme = true,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (initialTheme) return initialTheme;
    
    const systemColorScheme = Appearance.getColorScheme();
    const mode = systemColorScheme === 'dark' ? 'dark' : 'light';
    
    return createTheme({ ...initialConfig, mode });
  });
  
  const [isSystemThemeEnabled, setIsSystemThemeEnabled] = useState(followSystemTheme);

  // ===== THEME PERSISTENCE =====

  /**
   * Load theme preference from storage
   */
  const loadThemeFromStorage = useCallback(async () => {
    if (!persistTheme) return;
    
    try {
      const [storedConfig, storedMode, storedSystemTheme] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(THEME_MODE_STORAGE_KEY),
        AsyncStorage.getItem(`${THEME_STORAGE_KEY}_system`),
      ]);
      
      const config: ThemeConfig = storedConfig ? JSON.parse(storedConfig) : {};
      const mode = storedMode as 'light' | 'dark' | null;
      const systemThemeEnabled = storedSystemTheme ? JSON.parse(storedSystemTheme) : followSystemTheme;
      
      setIsSystemThemeEnabled(systemThemeEnabled);
      
      if (systemThemeEnabled) {
        // Use system theme
        const systemColorScheme = Appearance.getColorScheme();
        const systemMode = systemColorScheme === 'dark' ? 'dark' : 'light';
        setTheme(createTheme({ ...config, mode: systemMode }));
      } else if (mode) {
        // Use saved theme mode
        setTheme(createTheme({ ...config, mode }));
      }
    } catch (error) {
      console.warn('Failed to load theme from storage:', error);
    }
  }, [persistTheme, followSystemTheme]);

  /**
   * Save theme preference to storage
   */
  const saveThemeToStorage = useCallback(async (
    config: ThemeConfig,
    mode: 'light' | 'dark',
    systemThemeEnabled: boolean
  ) => {
    if (!persistTheme) return;
    
    try {
      await Promise.all([
        AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config)),
        AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode),
        AsyncStorage.setItem(`${THEME_STORAGE_KEY}_system`, JSON.stringify(systemThemeEnabled)),
      ]);
    } catch (error) {
      console.warn('Failed to save theme to storage:', error);
    }
  }, [persistTheme]);

  // ===== SYSTEM THEME DETECTION =====

  /**
   * Handle system theme changes
   */
  useEffect(() => {
    if (!isSystemThemeEnabled) return;
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const mode = colorScheme === 'dark' ? 'dark' : 'light';
      setTheme(currentTheme => createTheme({ 
        ...extractThemeConfig(currentTheme), 
        mode 
      }));
    });
    
    return () => subscription.remove();
  }, [isSystemThemeEnabled]);

  // ===== LOAD THEME ON MOUNT =====

  useEffect(() => {
    loadThemeFromStorage();
  }, [loadThemeFromStorage]);

  // ===== THEME MANAGEMENT FUNCTIONS =====

  /**
   * Toggle between light and dark mode
   */
  const toggleMode = useCallback(() => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    const config = extractThemeConfig(theme);
    const newTheme = createTheme({ ...config, mode: newMode });
    
    setTheme(newTheme);
    setIsSystemThemeEnabled(false);
    saveThemeToStorage(config, newMode, false);
  }, [theme, saveThemeToStorage]);

  /**
   * Set specific theme mode
   */
  const setMode = useCallback((mode: 'light' | 'dark') => {
    const config = extractThemeConfig(theme);
    const newTheme = createTheme({ ...config, mode });
    
    setTheme(newTheme);
    setIsSystemThemeEnabled(false);
    saveThemeToStorage(config, mode, false);
  }, [theme, saveThemeToStorage]);

  /**
   * Update theme configuration
   */
  const updateTheme = useCallback((config: ThemeConfig) => {
    const currentConfig = extractThemeConfig(theme);
    const mergedConfig = { ...currentConfig, ...config };
    const newTheme = createTheme(mergedConfig);
    
    setTheme(newTheme);
    saveThemeToStorage(mergedConfig, newTheme.mode, isSystemThemeEnabled);
  }, [theme, isSystemThemeEnabled, saveThemeToStorage]);

  /**
   * Enable or disable system theme following
   */
  const setSystemThemeEnabled = useCallback((enabled: boolean) => {
    setIsSystemThemeEnabled(enabled);
    
    if (enabled) {
      const systemColorScheme = Appearance.getColorScheme();
      const mode = systemColorScheme === 'dark' ? 'dark' : 'light';
      const config = extractThemeConfig(theme);
      const newTheme = createTheme({ ...config, mode });
      
      setTheme(newTheme);
      saveThemeToStorage(config, mode, true);
    } else {
      const config = extractThemeConfig(theme);
      saveThemeToStorage(config, theme.mode, false);
    }
  }, [theme, saveThemeToStorage]);

  // ===== CONTEXT VALUE =====

  const contextValue = {
    theme,
    toggleMode,
    setMode,
    updateTheme,
    isSystemThemeEnabled,
    setSystemThemeEnabled,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== HOOKS =====

/**
 * Hook to access theme context
 * 
 * @returns ThemeContextValue
 * @throws Error if used outside ThemeProvider
 * 
 * @example
 * const { theme, toggleMode } = useTheme();
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

/**
 * Hook to access current theme object
 * 
 * @returns Current theme
 * 
 * @example
 * const theme = useCurrentTheme();
 * const backgroundColor = theme.colors.background.primary;
 */
export const useCurrentTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

/**
 * Hook to access theme colors
 * 
 * @returns Theme colors object
 * 
 * @example
 * const colors = useThemeColors();
 * const primaryColor = colors.colors.primary[500];
 */
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

/**
 * Hook to access theme typography
 * 
 * @returns Theme typography object
 * 
 * @example
 * const typography = useThemeTypography();
 * const headingStyle = typography.variants.heading.h1;
 */
export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

/**
 * Hook to access theme spacing
 * 
 * @returns Theme spacing object
 * 
 * @example
 * const spacing = useThemeSpacing();
 * const padding = spacing.md;
 */
export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return theme.spacing;
};

/**
 * Hook for responsive values based on current breakpoint
 * 
 * @param values - Values for each breakpoint
 * @returns Value for current breakpoint
 * 
 * @example
 * const fontSize = useResponsiveValue({
 *   xs: 14,
 *   sm: 16,
 *   md: 18,
 * });
 */
export const useResponsiveValue = <T extends any>(
  values: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', T>>
): T | undefined => {
  const { theme } = useTheme();
  
  // This would need to be implemented with the breakpoint utilities
  // For now, returning the 'md' value or first available
  return values.md || values.sm || values.xs || values.lg || values.xl;
};

// ===== EXTENDED CONTEXT VALUE TYPE =====

// Update the context type (this would typically be in types.ts)
declare module './types' {
  interface ThemeContextValue {
    isSystemThemeEnabled?: boolean;
    setSystemThemeEnabled?: (enabled: boolean) => void;
  }
}