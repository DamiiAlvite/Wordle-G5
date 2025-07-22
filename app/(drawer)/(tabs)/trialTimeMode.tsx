// app/(drawer)/(tabs)/clasico.tsx
import { View, Text, StyleSheet } from 'react-native'

export default function Clasico() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Modo contrarreloj</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 }
})
