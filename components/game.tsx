import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { supabase } from "@/lib/supabase";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";
import Keyboard from "./keyboard";
import WordsList from "./wordsList";
import EndGame from "./gameOver";
import { useAuth } from "@/providers/authProvider";

const ROWS = 6;
const COLS = 5;

export default function Game() {
    const {word, wordId, loading} = useWordOfDay();
    const [flipRow, setFlipRow] = useState<number | null>(null);
    
    const [letters, setLetters] = useState(
        Array.from({ length: ROWS }, () => Array(COLS).fill(""))
    );

    const [colors, setColors] = useState(
        Array.from({ length: ROWS }, () => Array(COLS).fill("default"))
    );

    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameOfTheDay, setGameOfTheDay] = useState(null);
    const [showEndModal, setShowEndModal] = useState(false);
    const { userId } = useAuth();

    const getGameOfTheDay = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .eq("date", today)
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setGameOfTheDay(data);
        setGameOver(true);
        setShowEndModal(true);
        console.log("Juego del día:", data);
        return data;
      }
      if (error) {
        console.error("Error al obtener el juego del día:", error.message);
      }
    }

    const saveGame = async (guess:string, target:string) => {
      const today = new Date().toISOString().split("T")[0];
      const attemp = currentRow + 1;
      const win = guess === target;
      const { error } = await supabase
        .from("game")
        .insert({
          date: today,
          user_id: userId,
          win_attemp: attemp,
          win: win,
          word_id: wordId,
        });

      if (error) {
        console.error("Error al guardar el juego:", error.message);
      } else {
        console.log("Juego guardado exitosamente");
      }
    }

    const handleKeyPress = (key: string) => {  
      if (gameOver) return;
        if (currentCol < COLS && currentRow < ROWS) {
            setLetters((prev) => {
                const update = prev.map((row) => [...row]);
                update[currentRow][currentCol] = key;
                return update;
        });
        setCurrentCol((col) => col + 1);
        console.log(`${letters[currentRow]}`);
    }
  };

  const handleBackspace = () => {
    if (gameOver) return;
    if (currentCol > 0) {
      setLetters((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[currentRow][currentCol - 1] = "";
        return updated;
      });
      setCurrentCol((col) => col - 1);
    }
  };

const handleEnter = async () => {
  
  console.log(`${currentRow + 1} intentos`);
  if (gameOver) return;
  if (currentCol === COLS) {
    setFlipRow(currentRow);
    setTimeout(() => setFlipRow(null), 700);
    const guess = letters[currentRow].join("").toLowerCase();
    const target = word?.toLowerCase() || "";
    const newColors = Array(COLS).fill("absent");

    // Manejar letras repetidas
    const targetLetters = target.split("");
    const guessLetters = guess.split("");
    const used = Array(COLS).fill(false);

    // Correctas
    for (let i = 0; i < COLS; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            newColors[i] = "correct";
            used[i] = true;
            targetLetters[i] = null as any; // Marca como usada
        }
    }
    // Presentes
    for (let i = 0; i < COLS; i++) {
        if (newColors[i] !== "correct" && guessLetters[i]) {
            const idx = targetLetters.indexOf(guessLetters[i]);
            if (idx !== -1 && !used[idx]) {
                newColors[i] = "present";
                targetLetters[idx] = null as any; // Marca como usada
            }
        }
    }

    setColors((prev) => {
        const updated = prev.map((row) => [...row]);
        updated[currentRow] = newColors;
        return updated;
    });

    if (guess === target || currentRow === ROWS - 1) {
      setGameOver(true);
      await saveGame(guess, target);
      await getGameOfTheDay();
      setShowEndModal(true);
    } else {
      setCurrentRow((row) => (row < ROWS - 1 ? row + 1 : row));
      setCurrentCol(0);
    }
  }
};

  useEffect(() => {
      getGameOfTheDay();
    }, [word]);

  if (loading) {
    return <Text>Cargando...</Text>;
  }
  
    return (
      <View style={styles.container}>
          <Text style={styles.day} >
            {new Date().toLocaleDateString("es-ES", { weekday: "long" }).toUpperCase()}
          </Text>
          <WordsList letters={letters} colors={colors} flipRow={flipRow} />
          <View style={styles.keyboard}>
            <Keyboard
                  onKeyPress={handleKeyPress}
                  onBackspace={handleBackspace}
                  onEnter={handleEnter}
              />
          </View>
          {showEndModal && (
        <View style={styles.overlay}>
          <EndGame game={gameOfTheDay} />
        </View>
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
  day: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
    keyboard: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});