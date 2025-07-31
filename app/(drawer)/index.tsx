import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/themeContext';

export default function RedirectHome() {
  const { theme } = useTheme();
  
  useEffect(() => {
    router.replace('/(drawer)/(tabs)/classicMode');
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: theme.colors.background 
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
}