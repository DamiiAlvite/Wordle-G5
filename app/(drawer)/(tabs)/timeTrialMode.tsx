import React, { useState, useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/authProvider";
import WavesBackground from "@/assets/svg/wavesBackground";
import Game from "@/components/game";
import EndGame from "@/components/modals/gameOver";
import StartTimeTrial from "@/components/modals/startTimeTrial";

export default function timeTrialMode() {

  const [gameOfTheDay, setGameOfTheDay] = useState<{
    win: boolean;
    win_attempt: number;
    word: string;
  } | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userId } = useAuth();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnimEnd = useRef(new Animated.Value(0)).current;
  const scaleAnimEnd = useRef(new Animated.Value(0.3)).current;

  const showModalWithAnimation = () => {
    setShowEndModal(true);
    Animated.parallel([
      Animated.timing(fadeAnimEnd, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimEnd, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  };

  const showStartModalWithAnimation = () => {
    setShowStartModal(true);
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
      .eq("mode", "timeTrial")
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
    } else {
      setTimeout(() => {
        showStartModalWithAnimation();
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
        mode: "timeTrial",
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

  const handleStartClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setShowStartModal(false);
      setGameStarted(true);
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <WavesBackground style={styles.wavesBackground} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WavesBackground style={styles.wavesBackground} />
      {gameStarted && !hasPlayedToday ? (
        <>
          <Text style={styles.title}> Contrarreloj </Text>
          <Game 
            mode="timeTrial" 
            onGameEnd={handleGameEnd}
            onGameStart={handleGameStart}
          />
        </>
      ) : hasPlayedToday ? (
        <View style={styles.playedContainer}>
          <Text style={styles.playedText}>Ya jugaste hoy</Text>
          <Text style={styles.playedSubtext}>Vuelve mañana para un nuevo desafío</Text>
        </View>
      ) : null}
      
      {gameStarted && !gameOver && (
        <View style={styles.navigationBlocker}>
          <Text style={styles.barBlockText}>Finaliza para cambiar de modo</Text>
        </View>
      )}
      
      {showEndModal && gameOfTheDay && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: fadeAnimEnd,
          }
        ]}>
          <Animated.View style={{
            transform: [{ scale: scaleAnimEnd }]
          }}>
            <EndGame game={gameOfTheDay} mode="timeTrial" />
          </Animated.View>
        </Animated.View>
      )}
      
      {showStartModal && (
        <Animated.View style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          }
        ]}>
          <Animated.View style={{
            transform: [{ scale: scaleAnim }]
          }}>
            <StartTimeTrial onClose={handleStartClose} />
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
    backgroundColor: "#E8F0FE",
  },
  wavesBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginTop: 40,
    marginBottom: 20,
    color: "#2E3A59",
    letterSpacing: 3,
    textAlign: "center",
    paddingHorizontal: 20,
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
    color: "#2E3A59",
    textAlign: "center",
    marginBottom: 10,
  },
  playedSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#2E3A59",
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
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 10,
    paddingTop: 75
  },
  navigationBlocker: {
    position: "absolute",
    borderRadius: 24,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 10000,
  },
  barBlockText: {
    color: "#5792EE",
    textAlign: "center",
    marginTop: 30,
  },
});