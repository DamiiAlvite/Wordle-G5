import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function StatsScreen() {

  // Valores simulados hasta tener la BBDD
  const stats = {
    played: 10,
    wins: 8,
    winPercentage: 80,
    currentStreak: 3,
    maxStreak: 5,
    guessDistribution: [0, 1, 2, 3, 1, 1], // victorias en el intento 1 a 6
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Estadísticas</Text>

      <View style={styles.statRow}>
        <StatBlock label="Jugados" value={stats.played} />
        <StatBlock label="Ganados" value={stats.wins} />
        <StatBlock label="% Éxito" value={stats.winPercentage} />
      </View>

      <View style={styles.statRow}>
        <StatBlock label="Racha actual" value={stats.currentStreak} />
        <StatBlock label="Racha máxima" value={stats.maxStreak} />
      </View>

      <Text style={styles.subTitle}>Distribución de intentos</Text>
      {stats.guessDistribution.map((count, i) => (
        <View key={i} style={styles.guessDistributionRow}>
          <Text style={styles.try}>{i + 1}</Text>
          <View
            style={{
              height: 20,
              width: count * 20,
              backgroundColor: '#4caf50',
              borderRadius: 4,
              marginLeft: 4,
            }}
          />
          <Text style={{ marginLeft: 8 }}>{count}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{value}</Text>
      <Text style={{ fontSize: 14 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    title: { 
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    statRow:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 60
    },
    subTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30
    },
    guessDistributionRow:{ flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    count:{
        backgroundColor: 'grey',
        marginLeft: 8
    },
    try:{
        backgroundColor: 'grey',
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 8,
        borderRadius: 4,
        color: 'white',
    }
});
