import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import TopBar from "@/components/topBar";
import { supabase } from "@/lib/supabase";

export default function StatsScreen() {
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
      const playedCount = games.length;
      const winsCount = games.filter(game => game.win === true).length;
      const percentage = playedCount > 0 ? Math.round((winsCount / playedCount) * 100) : 0;

      setPlayed(playedCount);
      setWins(winsCount);
      setWinPercentage(percentage);
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
      <View style={styles.contentBox}>
        <Text style={styles.title}>Estadísticas</Text>

        <View style={styles.statRow}>
          <StatBlock label="Jugados" value={played} />
          <StatBlock label="Ganados" value={wins} />
          <StatBlock label="% Éxito" value={winPercentage} />
        </View>

        <View style={styles.statRowTight}>
          <StatBlock label="Racha actual" value={currentStreak} />
          <StatBlock label="Racha máxima" value={maxStreak} />
        </View>

        <Text style={styles.subTitle}>Distribución de intentos</Text>
        {guessDistribution.map((count, i) => (
          <View key={i} style={styles.guessDistributionRow}>
            <Text style={styles.try}>{i + 1}</Text>
            <View style={[styles.bar, { width: count * 20 }]} />
            <Text style={styles.count}>{count}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statBlock}>
      <View style={styles.statValueBox}>
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <View style={styles.statLabelBox}>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E8F0FE',
    flex: 1,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    margin: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 32,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 28,
  },
  statRowTight: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  statBlock: {
    width: 100,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValueBox: {
    backgroundColor: '#EAF2FF',
    paddingVertical: 12,
    alignItems: 'center',
  },
  statLabelBox: {
    backgroundColor: 'white',
    paddingVertical: 6,
    alignItems: 'center',
  },

  statLabel: {
    fontSize: 12,
    color: '#2C3E50',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F3A93',
  },

  subTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2C3E50',
    marginBottom: 16,
    marginTop: 16,
  },
  guessDistributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 10,
  },
  try: {
    width: 24,
    textAlign: 'center',
    backgroundColor: '#EAF2FF',
    color: '#2C3E50',
    paddingVertical: 4,
    borderRadius: 4,
  },
  bar: {
    height: 20,
    backgroundColor: '#1F3A93',
    borderRadius: 6,
    marginLeft: 8,
  },
  count: {
    marginLeft: 8,
    color: '#2C3E50',
    fontWeight: '500',
  },
});
