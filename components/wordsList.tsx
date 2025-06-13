import React from "react";
import { View, StyleSheet } from "react-native";
import AnimatedCell from "./animatedCell";

const ROWS = 6;
const COLS = 5;

export default function WordsList({ letters, colors, flipRow, errorRow }) {
  return (
    <View style={styles.grid}>
      {letters.map((row, rowIdx) =>
        row.map((letter, colIdx) => (
          <AnimatedCell
            key={`cell-${rowIdx}-${colIdx}`}
            letter={letter}
            color={errorRow === rowIdx ? "error" : colors?.[rowIdx]?.[colIdx] || "default"}
            flipTrigger={flipRow === rowIdx}
            shakeTrigger={errorRow === rowIdx}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 240,
    marginVertical: 16,
    alignSelf: "center",
  },
});