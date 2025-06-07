import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native";

// Letras del teclado divididas en filas
const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];
const ACCENTED = {
  A: ["Á"],
  E: ["É"],
  I: ["Í"],
  O: ["Ó"],
  U: ["Ú"],
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const keyWidth = (SCREEN_WIDTH - 16 * 2 - 10 * 6) / 10;

export default function Keyboard({ onKeyPress, onBackspace, onEnter }) {
  const [accentModal, setAccentModal] = useState<{ visible: boolean; key: string | null; x: number; y: number }>({
    visible: false,
    key: null,
    x: 0,
    y: 0,
  });

  const handleLongPress = (key: string, event: any) => {
    if (ACCENTED[key]) {
      const { pageX, pageY } = event.nativeEvent;
      setAccentModal({ visible: true, key, x: pageX, y: pageY });
    }
  };

  const handleAccentSelect = (accent: string) => {
    setAccentModal({ visible: false, key: null, x: 0, y: 0 });
    onKeyPress(accent);
  };

  return (
    <View style={styles.keyboardContainer}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => onKeyPress(key)}
              onLongPress={(e) => handleLongPress(key, e)}
              delayLongPress={250}
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
      <Modal
        visible={accentModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setAccentModal({ visible: false, key: null, x: 0, y: 0 })}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setAccentModal({ visible: false, key: null, x: 0, y: 0 })}
        >
          <View
            style={[
              styles.accentContainer,
              { top: accentModal.y - 60, left: accentModal.x - 30 },
            ]}
          >
            {accentModal.key &&
              ACCENTED[accentModal.key].map((accent) => (
                <TouchableOpacity
                  key={accent}
                  style={styles.accentKey}
                  onPress={() => handleAccentSelect(accent)}
                >
                  <Text style={styles.accentText}>{accent}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
  },
  accentContainer: {
    position: "absolute",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    padding: 4,
    zIndex: 1000,
  },
  accentKey: {
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: "#e3f2fd",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  accentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
});