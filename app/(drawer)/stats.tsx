import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import TopBar from "@/components/topBar";
import { supabase } from "@/lib/supabase";
import WavesBackground from "@/assets/svg/wavesBackground2";
import { Shadow } from 'react-native-shadow-2';

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
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar />
      <WavesBackground style={styles.wavesBackground} pointerEvents="none" />
      <View style={styles.centerContentWrapper}>
        <Shadow
          distance={6}
          startColor="rgba(0,0,0,0.2)"
          offset={[0, 4]}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.69)",
            borderRadius: 24,
          }}
        >
          <View style={styles.contentBox}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Estadísticas</Text>
            </View>
            <View style={styles.statContainer}>
              <View style={styles.statRow}>
                <StatBlock label="Jugados" value={played} />
                <StatBlock label="Ganados" value={wins} />
                <StatBlock label="% Éxito" value={winPercentage} />
              </View>

              <View style={styles.statRowTight}>
                <StatBlock label="Racha actual" value={currentStreak} />
                <StatBlock label="Racha máxima" value={maxStreak} />
              </View>
            </View>
            <Text style={styles.subTitle}>Distribución de intentos</Text>
            {guessDistribution.map((count, i) => (
              <View key={i} style={styles.guessDistributionRow}>
                <Text style={styles.try}>{i + 1}</Text>
                <View style={[styles.bar, { width: count * 20 }]} />
                <Text style={styles.count}>{count}</Text>
              </View>
            ))}
            <Text style={[styles.statLabel, { textAlign: 'center' }]}>
              Este gráfico muestra cuantas veces ganaste en cada intento.
            </Text>
          </View>
        </Shadow>
      </View>
    </ScrollView>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.statShadowWrapper}>
      <View style={styles.statBlock}>
        <Text style={styles.statValue}>{value}</Text>
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
  wavesBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  centerContentWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 40,
  },
  contentBox: {
    position: 'relative',
    borderRadius: 24,
    paddingBottom: 24,
  },
  titleContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FFF',
    margin: 0,
    padding: 10,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  statContainer: {
    padding: 20,
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

  statShadowWrapper: {
    width: 100,
    borderRadius: 12,
    //sombra para ios
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 3,
  },

  statBlock: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },

  subTitle: {
    width: '100%',
    backgroundColor: '#fff',
    color: '#222',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    padding: 10,
  },
  guessDistributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 10,
    paddingHorizontal: 20,
  },
  try: {
    width: 24,
    textAlign: 'center',
    backgroundColor: 'rgba(197, 226, 251, 0.85)',
    color: '#222',
    paddingVertical: 4,
    borderRadius: 4,
  },
  bar: {
    height: 20,
    backgroundColor: 'rgba(140, 201, 255, 0.85)',
    borderRadius: 6,
    marginLeft: 8,
  },
  count: {
    marginLeft: 8,
    color: '#222',
    fontWeight: '500',
  },
});
