import { set } from "react-hook-form";
import Keyboard from "./keyboard";
import WordsList from "./wordsList";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ROWS = 6;
const COLS = 5;

export default function Game() {
    const [letters, setLetters] = useState(
        Array.from({ length: ROWS }, () => Array(COLS).fill(""))
    );
    const [currentRow, setCurrentRow] = useState(0);
    const [currentCol, setCurrentCol] = useState(0);

    const handleKeyPress = (key: string) => {  
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
    if (currentCol === COLS) {
      // TO DO: Validar la palabra ingresada
      setCurrentRow((row) => (row < ROWS - 1 ? row + 1 : row));
      setCurrentCol(0);
    }
    console.log(`${letters[currentRow]}`);
  };

    return (
        <View>
            <WordsList letters={letters} />
            <View style={styles.keyboard}>
               <Keyboard
                    onKeyPress={handleKeyPress}
                    onBackspace={handleBackspace}
                    onEnter={handleEnter}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    keyboard:{
        marginTop: 60,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});