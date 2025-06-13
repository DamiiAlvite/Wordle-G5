import React, { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const COLORS = {
  default: "#d3d6da",
  present: "#ffd54f",
  absent: "#787c7e",
  correct: "#6aaa64",
  error: "#ff4d4f",
};

export default function AnimatedCell({ letter, color, flipTrigger, shakeTrigger }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;

  // Flip animation
  useEffect(() => {
    if (flipTrigger) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [flipTrigger]);

  // Shake animation
  useEffect(() => {
    if (shakeTrigger) {
      Animated.sequence([
        Animated.timing(shakeValue, { toValue: 8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 3, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: -3, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeValue, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [shakeTrigger]);

  const rotateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View style={[styles.cell, { transform: [{ translateX: shakeValue }] }]}>
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
            transform: [
              {
                rotateY: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["180deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    </Animated.View>
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
    transform:[{perspective: 1000}],
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