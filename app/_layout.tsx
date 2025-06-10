import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/providers/authProvider';
import { WordOfDayProvider } from '@/context/wordOfTheDayProvider';

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
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signin/index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup/index" options={{ headerShown: false }} />
            <Stack.Screen
              name="stats"
              options={{
                headerShown: true,
                headerTitle: "",
              }}
            /><Stack.Screen
              name="rules"
              options={{
                headerShown: true,
                headerTitle: "",
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </WordOfDayProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}