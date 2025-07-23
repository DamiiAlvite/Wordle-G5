import { Slot } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import BottomBar from '@/components/bottomBar'
import TopBar from "@/components/topBar";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <TopBar />
      <Slot />
      <BottomBar />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8'
  }
})
