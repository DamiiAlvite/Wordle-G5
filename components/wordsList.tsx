import React from "react";
import { View, StyleSheet, Text } from "react-native";

const COLORS = {
  default: "#d3d6da",
  present: "#ffd54f",
  absent: "#787c7e",
  correct: "#6aaa64",
};

const ROWS = 6;
const COLS = 5;

export default function WordsList({ letters, colors }: { letters: string[][], colors: string[][] }) {
  return (
    <View style={styles.grid}>
      {letters.map((row, rowIdx) =>
        row.map((letter, colIdx) => (
          <View
            key={`cell-${rowIdx}-${colIdx}`}
            style={[
              styles.cell,
              { backgroundColor: COLORS[colors?.[rowIdx]?.[colIdx] || "default"] },
            ]}
            testID={`cell-${rowIdx}-${colIdx}`}
          >
            <Text style={styles.letter}>{letter}</Text>
          </View>
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
  cell: {
    width: 44,
    height: 44,
    marginVertical: 8,
    marginHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
});