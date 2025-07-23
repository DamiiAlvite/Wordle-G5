import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

export default function RedirectHome() {
  useEffect(() => {
    router.replace('/(drawer)/(tabs)/classicMode');
  }, []);

  // Mostrar un loading mientras redirige
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}