import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { supabase } from "@/lib/supabase";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";
import Keyboard from "./keyboard";
import WordsList from "./wordsList";
import EndGame from "./endGame";

const ROWS = 6;
const COLS = 5;

export default function Game() {
    const {word, loading} = useWordOfDay();
    if (loading) {
        return <Text>Cargando...</Text>;
    }

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

    const getGameOfTheDay = async () => {
      const today = new Date().toISOString().split("T")[0];
      const user = supabase.auth.getUser();
      const { data, error } = await supabase
        .from("game")
        .select("*")
        .eq("date", today)
        .eq("user_id", (await user).data.user?.id)
        .single();

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

const handleEnter = () => {
  if (gameOver) return;
  if (currentCol === COLS) {
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

    return (
      <>
          <View>
              <WordsList letters={letters} colors={colors} />
              <View style={styles.keyboard}>
                <Keyboard
                      onKeyPress={handleKeyPress}
                      onBackspace={handleBackspace}
                      onEnter={handleEnter}
                  />
              </View>
          </View>
          <Modal
          visible={showEndModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowEndModal(false)}
        >
          <EndGame game={gameOfTheDay}/>
        </Modal>
      </>
    );
}

const styles = StyleSheet.create({
    keyboard:{
        marginTop: 60,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});