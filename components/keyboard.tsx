import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native";

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
  U: ["Ú", "Ü"],
};

type KeyStatus = "correct" | "present" | "absent" | "default";
type KeyboardProps = {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  keyColors?: Record<string, KeyStatus>;
  disabled?: boolean;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const keyWidth = (SCREEN_WIDTH - 16 * 2 - 10 * 6) / 10;
const isAccentedKey = (key: string): key is keyof typeof ACCENTED => {
  return key in ACCENTED;
};
const COLORS = {
  default: "#111",
  present: "#facc15",
  absent: "#9ca3af",
  correct: "#22c55e",
};

export default function Keyboard({ onKeyPress, onBackspace, onEnter, keyColors = {}, disabled = false}: KeyboardProps) {
  const [accentModal, setAccentModal] = useState<{ visible: boolean; key: string | null; x: number; y: number }>({
    visible: false,
    key: null,
    x: 0,
    y: 0,
  });

  const handleLongPress = (key: string, event: any) => {
    if (disabled) return;
    if (Object.prototype.hasOwnProperty.call(ACCENTED, key)) {
      const { pageX, pageY } = event.nativeEvent;
      setAccentModal({ visible: true, key, x: pageX, y: pageY });
    }
  };

  const handleAccentSelect = (accent: string) => {
    if (disabled) return;
    setAccentModal({ visible: false, key: null, x: 0, y: 0 });
    onKeyPress(accent);
  };

  return (
    <View style={styles.keyboardContainer}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {rowIndex === 2 && (
            <TouchableOpacity style={styles.specialKey} onPress={onEnter}>
              <Text style={styles.keyText}>ENTER</Text>
            </TouchableOpacity>
          )}
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                { backgroundColor: COLORS[keyColors[key] || "default"] }
              ]}
              onPress={() => onKeyPress(key)}
              onLongPress={(e) => handleLongPress(key, e)}
              delayLongPress={250}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
          {rowIndex === 2 && (
            <TouchableOpacity style={styles.specialKey} onPress={onBackspace}>
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
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
            {accentModal.key && isAccentedKey(accentModal.key) && ACCENTED[accentModal.key].map((accent) => (
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
    paddingVertical: "1%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  key: {
    margin: 3,
    borderRadius: 8,
    paddingVertical: 12,
    width: keyWidth,
    alignItems: "center",
  },
  specialKey: {
    backgroundColor: "#5792EE",
    margin: 3,
    borderRadius: 8,
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
  },
  accentKey: {
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 6,
  },
  accentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
});