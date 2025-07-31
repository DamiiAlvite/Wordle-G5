import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/authProvider";
import WavesBackground from "@/assets/svg/wavesBackground";
import Game from "@/components/game";
import EndGame from "@/components/modals/gameOver";
import { useTheme } from "@/context/themeContext";

export default function slangMode() {
  const { theme } = useTheme();

  const [gameOfTheDay, setGameOfTheDay] = useState<{
    win: boolean;
    win_attempt: number;
    word: string;
  } | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { userId } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  const showModalWithAnimation = () => {
    setShowEndModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  };

  const checkTodayGame = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("game")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .eq("mode", "slang")
      .maybeSingle();
    if (error) {
      console.error("Error al verificar juego del día:", error.message);
      setLoading(false);
      return;
    }
    if (data) {
      setGameOfTheDay(data);
      setHasPlayedToday(true);
      setTimeout(() => {
        showModalWithAnimation();
      }, 100);
    }
    setLoading(false);
  };

  const handleGameStart = () => {
    setGameStarted(true);
  };

  useEffect(() => {
    checkTodayGame();
  }, [userId]);

  const saveGame = async (
    win: boolean,
    win_attempt: number,
    word: string,
    wordId: number | null
  ) => {
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase
      .from("game")
      .insert({
        date: today,
        user_id: userId,
        win_attempt: win_attempt,
        win: win,
        word_id: wordId,
        mode: "slang",
      });

    if (error) {
      console.error("Error al guardar el juego:", error.message);
    } else {
      console.log("Juego guardado exitosamente");
    }
  };

  const handleGameEnd = async (gameData: {
    win: boolean;
    win_attempt: number;
    word: string;
    wordId: number | null;
  }) => {
    await saveGame(gameData.win, gameData.win_attempt, gameData.word, gameData.wordId);
    setGameOfTheDay(gameData);
    setHasPlayedToday(true);
    setGameOver(true);
    setTimeout(() => {
      showModalWithAnimation();
    }, 500);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <WavesBackground style={styles.wavesBackground} waveColor={theme.colors.waves} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.secondary }]}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <WavesBackground style={styles.wavesBackground} waveColor={theme.colors.waves} />
      {!hasPlayedToday ? (
        <>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.secondary }]}> Lunfardo </Text>
          </View>
          <View style={styles.gameContainer}>
            <Game
              mode="slang"
              onGameEnd={handleGameEnd}
              onGameStart={handleGameStart}
            />
          </View>
        </>
      ) : (
        <View style={styles.playedContainer}>
          <Text style={[styles.playedText, { color: theme.colors.secondary }]}>Ya jugaste hoy</Text>
          <Text style={[styles.playedSubtext, { color: theme.colors.textSecondary }]}>Vuelve mañana para un nuevo desafío</Text>
        </View>
      )}
      {gameStarted && !gameOver && (
        <>
          <View style={[styles.topNavigationBlocker, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.barBlockText, { color: theme.colors.primary }]}>Finaliza para cambiar de modo</Text>
          </View>
          <View style={[styles.navigationBlocker, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.barBlockText, { color: theme.colors.primary }]}>Finaliza para cambiar de modo</Text>
          </View>
        </>
      )}
      {showEndModal && gameOfTheDay && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: fadeAnim,
            backgroundColor: theme.colors.overlay,
          }
        ]}>
          <Animated.View style={{
            transform: [{ scale: scaleAnim }]
          }}>
            <EndGame game={gameOfTheDay} mode="slang" />
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  wavesBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  titleContainer: {
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 3,
  },
  gameContainer: {
    height: "95%",
    justifyContent: "center",
    alignItems: "center",
  },
  playedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  playedText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  playedSubtext: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
  },
  day: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
    paddingTop: "10%",
  },
  navigationBlocker: {
    position: "absolute",
    borderRadius: 24,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 10000,
  },
  barBlockText: {
    color: "#5792EE",
    textAlign: "center",
    marginTop: 30,
  },
  topNavigationBlocker: {
    position: "absolute",
    top: -80,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
});