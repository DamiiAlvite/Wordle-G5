import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import TopBar from "@/components/topBar";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from 'react';
import { set } from 'react-hook-form';

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

  const { userId } = useAuth();

  const [wins, setWins] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winPercentage, setWinPercentage] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [guessDistribution, setGuessDistribution] = useState([0, 0, 0, 0, 0, 0]);

  function getCurrentStreak(games: { win: boolean }[]) {
    let streak = 0;
    for (let i = games.length - 1; i >= 0; i--) {
      if (games[i].win) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
  function getMaxStreak(games: { win: boolean }[]) {
    let maxStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < games.length; i++) {
      if (games[i].win) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }
    return maxStreak;
  }
  function getGuessDistribution(games: { win: boolean; win_attemp?: number }[]) {
    const distribution = [0, 0, 0, 0, 0, 0];
    games.forEach(game => {
      if (game.win && typeof game.win_attemp === 'number' && game.win_attemp >= 1 && game.win_attemp <= 6) {
        distribution[game.win_attemp - 1]++;
      }
    });
    console.log('Guess distribution:', distribution);
    return distribution;
  }

  const getGames = async () => {
    if (!userId) return;
    const { data: games, error } = await supabase
      .from('game')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      console.error('Error fetching games:', error);
      return;
    }
    if (games) {
      console.log('Games data:', games);
      setPlayed(games.length);
      setWins(games.filter(game => game.win === true).length);
      setWinPercentage(
        games.length > 0 ? Math.round((wins / played) * 100) : 0
      );
      setCurrentStreak(getCurrentStreak(games));
      setMaxStreak(getMaxStreak(games));
      setGuessDistribution(getGuessDistribution(games.filter(game => game.win === true)));
    }
  }

  useEffect(() => {
    getGames();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar />
      <View style={styles.statsContainer}>
        <Text style={styles.title}>Estadísticas</Text>
        <View style={styles.statRow}>
          <StatBlock label="Jugados" value={played} />
          <StatBlock label="Ganados" value={wins} />
          <StatBlock label="% Éxito" value={winPercentage} />
        </View>

        <View style={styles.statRow}>
          <StatBlock label="Racha actual" value={currentStreak} />
          <StatBlock label="Racha máxima" value={maxStreak} />
        </View>

        <Text style={styles.subTitle}>Distribución de intentos</Text>
        {guessDistribution.map((count, i) => (
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
      </View>
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
  container: {
    flex: 1,
  },
  statsContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 60
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  guessDistributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  count: {
    backgroundColor: 'grey',
    marginLeft: 8
  },
  try: {
    backgroundColor: 'grey',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
    borderRadius: 4,
    color: 'white',
  }
});
