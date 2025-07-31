import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '@/providers/authProvider';
import TopBar from "@/components/topBar";
import { supabase } from "@/lib/supabase";
import WavesBackground from "@/assets/svg/wavesBackground2";
import { Shadow } from 'react-native-shadow-2';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '@/context/themeContext';

type Game = {
  win: boolean;
  win_attempt?: number;
};

type Stats = {
  played: number;
  wins: number;
  winPercentage: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
};

export default function StatsScreen() {
  const { userId } = useAuth();
  const { theme } = useTheme();

  const [classicStats, setClassicStats] = useState<Stats | null>(null);
  const [slangStats, setSlangStats] = useState<Stats | null>(null);
  const [timeTrialStats, setTimeTrialStats] = useState<Stats | null>(null);

  function getCurrentStreak(games: Game[]) {
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

  function getMaxStreak(games: Game[]) {
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

  function getGuessDistribution(games: Game[]) {
    const distribution = [0, 0, 0, 0, 0, 0];
    games.forEach(game => {
      if (
        game.win &&
        typeof game.win_attempt === 'number' &&
        game.win_attempt >= 1 &&
        game.win_attempt <= 6
      ) {
        distribution[game.win_attempt - 1]++;
      }
    });
    return distribution;
  }

  async function getGamesByMode(mode: string): Promise<Stats | null> {
    if (!userId) return null;
    const { data: games, error } = await supabase
      .from('game')
      .select('*')
      .eq('user_id', userId)
      .eq('mode', mode);

    if (error) {
      console.error(`Error fetching ${mode} games:`, error);
      return null;
    }

    if (!games) return null;

    const played = games.length;
    const wins = games.filter(g => g.win).length;
    const winPercentage = played > 0 ? Math.round((wins / played) * 100) : 0;
    const currentStreak = getCurrentStreak(games);
    const maxStreak = getMaxStreak(games);
    const guessDistribution = getGuessDistribution(games.filter(g => g.win));

    return {
      played,
      wins,
      winPercentage,
      currentStreak,
      maxStreak,
      guessDistribution,
    };
  }

  const loadStats = useCallback(async () => {
    if (!userId) return;
    
    const [classic, slang, timeTrial] = await Promise.all([
      getGamesByMode('classic'),
      getGamesByMode('slang'),
      getGamesByMode('timeTrial'),
    ]);

    setClassicStats(classic);
    setSlangStats(slang);
    setTimeTrialStats(timeTrial);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background2 }]}>
      <TopBar />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <WavesBackground style={styles.wavesBackground} waveColor={theme.colors.waves} pointerEvents="none" />
        <View style={styles.centerContentWrapper}>
          {classicStats && (
            <GameStats title="Modo Clásico" stats={classicStats} />
          )}
          {slangStats && (
            <GameStats title="Modo Lunfardo" stats={slangStats} />
          )}
          {timeTrialStats && (
            <GameStats title="Modo Contrarreloj" stats={timeTrialStats} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function GameStats({ title, stats }: { title: string; stats: Stats }) {
  const { theme } = useTheme();
  
  return (
    <Shadow
      distance={6}
      startColor="rgba(0,0,0,0.2)"
      offset={[0, 4]}
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: 24,
        marginBottom: 32,
      }}
    >
      <View style={styles.contentBox}>
        <View style={[styles.titleContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        </View>
        <View style={styles.statContainer}>
          <View style={styles.statRow}>
            <StatBlock label="Jugados" value={stats.played} />
            <StatBlock label="Ganados" value={stats.wins} />
            <StatBlock label="% Éxito" value={stats.winPercentage} />
          </View>

          <View style={styles.statRowTight}>
            <StatBlock label="Racha actual" value={stats.currentStreak} />
            <StatBlock label="Racha máxima" value={stats.maxStreak} />
          </View>
        </View>
        <Text style={[styles.subTitle, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}>Distribución de intentos</Text>
        {stats.guessDistribution.map((count, i) => (
          <View key={i} style={styles.guessDistributionRow}>
            <Text style={[styles.try, { backgroundColor: theme.colors.primary + '40', color: theme.colors.text }]}>{i + 1}</Text>
            <View style={[styles.bar, { width: count * 20, backgroundColor: theme.colors.primary + '60' }]} />
            <Text style={[styles.count, { color: theme.colors.text }]}>{count}</Text>
          </View>
        ))}
        <Text style={[styles.statLabel, { textAlign: 'center', color: theme.colors.textSecondary }]}>
          Este gráfico muestra cuántas veces ganaste en cada intento.
        </Text>
      </View>
    </Shadow>
  );
}

function StatBlock({ label, value }: { label: string; value: number | string }) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.statShadowWrapper, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.statBlock, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "relative",
  },
  container: {
    flexGrow: 1,
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
    borderRadius: 24,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  titleContainer: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBlock: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: 12,
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
    marginBottom: 4,
  },
  subTitle: {
    width: '100%',
    fontSize: 18,
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
    paddingVertical: 4,
    borderRadius: 4,
  },
  bar: {
    height: 20,
    borderRadius: 6,
    marginLeft: 8,
  },
  count: {
    marginLeft: 8,
    fontWeight: '500',
  },
});