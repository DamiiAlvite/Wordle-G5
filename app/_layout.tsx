import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/providers/authProvider';
import { WordOfDayProvider } from '@/context/wordOfTheDayProvider';
import { ThemeProvider } from '@/context/themeContext';

// Evita que la pantalla inicial se oculte hasta que las fuentes estén cargadas.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoBold: require('../assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <WordOfDayProvider>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)/signin/index" />
              <Stack.Screen name="(auth)/signup/index" />
              <Stack.Screen name="(drawer)" />
            </Stack>
          </ThemeProvider>
          <StatusBar style="auto" />
        </WordOfDayProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}