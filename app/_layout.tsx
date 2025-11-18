import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Image, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '../lib/auth-store';
import { useAppStore } from '../lib/store';
import { useTourStore } from '../lib/tour-store';
import { useLocationStore } from '../lib/location-store';
import { getColors } from '@/constants/colors';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Keep the native splash screen visible while we load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const colors = getColors(isDark);
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading: authLoading, initializeAuth } = useAuthStore();
  const loadAppData = useAppStore((state) => state.loadAppData);
  const loadTourRoutes = useTourStore((state) => state.loadTourRoutes);
  const loadDarkModePreference = useAppStore((state) => state.loadDarkModePreference);
  const initializeLocation = useLocationStore((state) => state.initializeLocation);
  const [appIsReady, setAppIsReady] = useState(false);
  const splashLayoutReady = useRef(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth, dark mode preference, and location on mount
  useEffect(() => {
    async function prepare() {
      try {
        // Initialize in parallel for faster startup
        await Promise.all([
          Promise.resolve(initializeAuth()),
          Promise.resolve(loadDarkModePreference()),
          Promise.resolve(initializeLocation()),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setIsInitialized(true);
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  // Hide native splash screen only after app is fully initialized and custom splash is ready
  const handleSplashLayout = () => {
    if (!splashLayoutReady.current && isInitialized && !authLoading && appIsReady) {
      splashLayoutReady.current = true;
      // Wait a frame to ensure the custom splash is fully painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Double RAF to ensure it's painted
          SplashScreen.hideAsync().catch(() => {
            // Ignore errors if splash screen is already hidden
          });
        });
      });
    }
  };

  // Hide native splash when initialization completes and custom splash is rendered
  useEffect(() => {
    if (isInitialized && !authLoading && appIsReady && !splashLayoutReady.current) {
      // Small delay to ensure custom splash is rendered
      const timer = setTimeout(() => {
        if (!splashLayoutReady.current) {
          splashLayoutReady.current = true;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              SplashScreen.hideAsync().catch(() => {
                // Ignore errors if splash screen is already hidden
              });
            });
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInitialized, authLoading, appIsReady]);

  // Load data when user changes or when auth is ready
  useEffect(() => {
    if (!authLoading) {
      // Load data - if user is logged in, use their ID, otherwise load global data
      loadAppData(user?.uid).catch((error) => {
        console.error('Failed to load app data:', error);
        // Error is logged but app continues - data will be empty if Firestore is unavailable
      });
      loadTourRoutes().catch((error) => {
        console.error('Failed to load tour routes:', error);
      });
    }
  }, [user, authLoading]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    // Only redirect authenticated users away from auth screens
    // Allow unauthenticated users to access the app freely
    if (user && inAuthGroup) {
      // Redirect to tabs if authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [user, segments, authLoading]);

  // Always show splash screen first, before any initialization
  // This ensures it appears immediately when React Native loads
  if (!isInitialized || authLoading || !appIsReady) {
    return (
      <View style={styles.splashContainer} onLayout={handleSplashLayout}>
        <View style={styles.brandRow}>
          <Image
            source={require('../assets/images/LOGO-KABUPATEN-KEPULAUAN-SANGIHE-SULAWESI-UTARA.png')}
            style={styles.brandLogo}
          />
          <View style={styles.divider} />
          <View style={styles.brandTextWrapper}>
            <Text style={styles.brandText}>Visiting Sangihe</Text>
          </View>
        </View>
        <ActivityIndicator size="small" color="#111827" style={styles.spinner} />
      </View>
    );
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="tour-tracking" options={{ headerShown: false }} />
          <Stack.Screen name="checkpoint-detail" options={{ headerShown: false }} />
          <Stack.Screen name="transport-detail" options={{ headerShown: false }} />
          <Stack.Screen name="tour-history" options={{ headerShown: false }} />
        </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Toast />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
  },
  divider: {
    width: 3,
    height: 80,
    backgroundColor: '#000000',
    marginHorizontal: 16,
  },
  brandTextWrapper: {
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 24,
    letterSpacing: 0.5,
    fontWeight: '700',
    color: '#000000',
  },
  spinner: {
    marginTop: 48,
  },
});
