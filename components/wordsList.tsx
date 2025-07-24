import React from "react";
import { View, StyleSheet } from "react-native";
import AnimatedCell from "./animatedCell";

const ROWS = 6;
const COLS = 5;
type Props = {
  letters: string[][];
  colors: string[][];
  flipRow: number | null;
  errorRow: number | null;
  onFlipEnd?: () => void; 
};

export default function WordsList({
  letters,
  colors,
  flipRow,
  errorRow,
  onFlipEnd,
}: Props) {
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
            onFlipEnd={flipRow === rowIdx && colIdx === COLS - 1 ? onFlipEnd : undefined}
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
    marginVertical: "4%",
    alignSelf: "center",
  },
});