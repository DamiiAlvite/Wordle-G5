import React, { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const COLORS = {
  default: "#d3d6da",
  present: "#ffd54f",
  absent: "#787c7e",
  correct: "#6aaa64",
};

export default function AnimatedCell({ letter, color, flipTrigger }) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flipTrigger) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } 
  }, [flipTrigger]);

  const rotateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Para ocultar el frente cuando gira más de 90 grados
  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  // Para mostrar el dorso después de 90 grados
  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.cell}>
      {/* Frente */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.inner,
          {
            backgroundColor: COLORS.default,
            opacity: frontOpacity,
            transform: [{ rotateY }],
          },
        ]}
      >
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
      {/* Dorso */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.inner,
          {
            backgroundColor: COLORS[color] || COLORS.default,
            opacity: backOpacity,
            transform: [{ rotateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: ["180deg", "360deg"],
            }) }],
          },
        ]}
      >
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "transparent",
    perspective: 1000, // importante para el efecto 3D
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
});