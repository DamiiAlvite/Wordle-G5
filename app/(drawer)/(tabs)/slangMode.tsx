// app/(drawer)/(tabs)/clasico.tsx
import { View, Text, StyleSheet } from 'react-native'
import WavesBackground from "@/assets/svg/wavesBackground2";

export default function Clasico() {
  return (
    <View style={styles.screen}>
      <WavesBackground />
      <Text style={styles.text}>Modo Lunfardo</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 }
})
