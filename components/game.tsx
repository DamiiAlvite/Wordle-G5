import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";
import Keyboard from "./keyboard";
import WordsList from "./wordsList";
import wordsData from "@/utils/validGuesses.json";

const ROWS = 6;
const COLS = 5;

interface GameProps {
  mode: string;
  onGameEnd?: (gameData: {
    won: boolean;
    attempts: number;
    word: string;
    wordId: number | null;
  }) => void;
}

export default function Game({ mode, onGameEnd }: GameProps) {

  const { wordClassic, wordIdClassic, wordSlang, wordIdSlang, wordTimeTrial, wordIdTimeTrial, loading } = useWordOfDay();
  let word: string | null = null;
  let wordId: number | null = null;
  if (mode === "classic") {
    word = wordClassic;
    wordId = wordIdClassic;
  } else if (mode === "slang") {
    word = wordSlang;
    wordId = wordIdSlang;
  } else if (mode === "timeTrial") {
    word = wordTimeTrial;
    wordId = wordIdTimeTrial;
  }

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [letters, setLetters] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(""))
  );
  const [colors, setColors] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill("default"))
  );
  const [flipRow, setFlipRow] = useState<number | null>(null);
  const [errorRow, setErrorRow] = useState<number | null>(null);
  const [keyColors, setKeyColors] = useState<{
    [key: string]: "default" | "absent" | "present" | "correct";
  }>({});
  const [gameOver, setGameOver] = useState(false);
  const [pendingGameOver, setPendingGameOver] = useState(false);

  const handleFlipEnd = async () => {
    if (pendingGameOver && !gameOver) {
      setGameOver(true);
      setPendingGameOver(false);
      const guess = letters[currentRow].join("").toLowerCase();
      const target = word?.toLowerCase() || "";
      onGameEnd?.({
        won: guess === target,
        attempts: currentRow + 1,
        word: target,
        wordId: wordId
      });
    }
  };

  const handleKeyPress = (key: string) => {
    if (gameOver) return;
    if (currentCol < COLS && currentRow < ROWS) {
      if (currentCol === 0 || letters[currentRow][currentCol - 1] !== "") {
        setLetters((prev) => {
          const update = prev.map((row) => [...row]);
          update[currentRow][currentCol] = key;
          return update;
        });
        setCurrentCol((col) => col + 1);
      }
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
    if (gameOver) return;
    if (currentCol === COLS) {
      const guess = letters[currentRow].join("").toLowerCase();
      if (!wordsData.includes(guess)) {
        setErrorRow(currentRow);
        setFlipRow(currentRow);
        setTimeout(() => {
          setErrorRow(null);
          setFlipRow(null);
          setLetters((prev) => {
            const updated = prev.map((row, idx) =>
              idx === currentRow ? Array(COLS).fill("") : row
            );
            return updated;
          });
          setCurrentCol(0);
        }, 1000);
        return;
      }
      setFlipRow(currentRow);
      setTimeout(() => setFlipRow(null), 700);
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

      setKeyColors((prev) => {
        const updated = { ...prev };
        for (let i = 0; i < COLS; i++) {
          const l = guessLetters[i].toUpperCase();
          const color = newColors[i];
          if (color === "correct") {
            updated[l] = "correct";
          } else if (color === "present") {
            if (updated[l] !== "correct") updated[l] = "present";
          } else if (color === "absent") {
            if (!updated[l]) updated[l] = "absent";
          }
        }
        return updated;
      });

      if (guess === target || currentRow === ROWS - 1) {
        setPendingGameOver(true);
      } else {
        setCurrentRow((row) => (row < ROWS - 1 ? row + 1 : row));
        setCurrentCol(0);
      }
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <WordsList
        letters={letters}
        colors={colors}
        flipRow={flipRow}
        errorRow={errorRow}
        onFlipEnd={handleFlipEnd}
      />
      <View style={styles.keyboard}>
        <Keyboard
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onEnter={handleEnter}
          keyColors={keyColors}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
  },
  keyboard: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});