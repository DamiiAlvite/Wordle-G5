import { Slot } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import BottomBar from '@/components/bottomBar'
import TopBar from "@/components/topBar";
import { useTheme } from '@/context/themeContext';

export default function TabsLayout() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TopBar />
      <Slot />
      <BottomBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})
