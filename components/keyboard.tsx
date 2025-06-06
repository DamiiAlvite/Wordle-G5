import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

// Letras del teclado divididas en filas
const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const SCREEN_WIDTH = Dimensions.get("window").width;
const keyWidth = (SCREEN_WIDTH - 16 * 2 - 10 * 6) / 10;

export default function Keyboard({ onKeyPress, onBackspace, onEnter }) {
  return (
    <View style={styles.keyboardContainer}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
          {rowIndex === 2 && (
            <>
              <TouchableOpacity style={styles.specialKey} onPress={onEnter}>
                <Text style={styles.keyText}>ENTER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.specialKey} onPress={onBackspace}>
                <Text style={styles.keyText}>⌫</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  key: {
    backgroundColor: "#5792EE",
    margin: 3,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: keyWidth,
    alignItems: "center",
    
  },
  specialKey: {
    backgroundColor: "black",
    margin: 3,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  keyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
