// components/StatsContainer.tsx

import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

function getCurrentStreak(games: { win: boolean }[]) {
  let streak = 0;
  for (let i = games.length - 1; i >= 0; i--) {
    if (games[i].win) streak++;
    else break;
  }
  return streak;
}

function getMaxStreak(games: { win: boolean }[]) {
  let maxStreak = 0;
  let currentStreak = 0;
  for (const game of games) {
    if (game.win) {
      currentStreak++;
      if (currentStreak > maxStreak) maxStreak = currentStreak;
    } else currentStreak = 0;
  }
  return maxStreak;
}

function getGuessDistribution(games: { win: boolean; win_attempt?: number }[]) {
  const distribution = [0, 0, 0, 0, 0, 0];
  games.forEach(game => {
    if (game.win && typeof game.win_attempt === 'number' && game.win_attempt >= 1 && game.win_attempt <= 6) {
      distribution[game.win_attempt - 1]++;
    }
  });
  return distribution;
}

export default function StatsContainer({ title, games }: {
  title: string,
  games: { win: boolean; win_attempt?: number }[]
}) {
  const played = games.length;
  const wins = games.filter(g => g.win).length;
  const winPercentage = played ? Math.round((wins / played) * 100) : 0;
  const currentStreak = getCurrentStreak(games);
  const maxStreak = getMaxStreak(games);
  const guessDistribution = getGuessDistribution(games.filter(g => g.win));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.modeTitle}>{title}</Text>
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
  wrapper: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
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
    backgroundColor: '#fff',
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
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  guessDistributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
