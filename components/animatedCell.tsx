import React, { useRef, useEffect } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";

const COLORS = {
  default: "#cbd5e1",
  present: "#facc15",
  absent: "#9ca3af",
  correct: "#22c55e",
  error: "#ff4d4f",
};

type CellColor = keyof typeof COLORS;

interface AnimatedCellProps {
  letter: string;
  color: CellColor;
  flipTrigger: boolean;
  shakeTrigger: boolean;
  onFlipEnd?: () => void;
  persistColor?: boolean;
}

export default function AnimatedCell({
  letter,
  color,
  flipTrigger,
  shakeTrigger,
  onFlipEnd,
  persistColor = true,
}: AnimatedCellProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (flipTrigger) {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        if (onFlipEnd) onFlipEnd();
      });
    } else if (!persistColor) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [flipTrigger, persistColor]);

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

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.inner,
          {
            backgroundColor: COLORS[color],
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
      
      {shakeTrigger && !flipTrigger && (
        <View style={[StyleSheet.absoluteFill, styles.inner, { backgroundColor: COLORS[color] }]}>
          <Text style={styles.letter}>{letter}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 44,
    height: 44,
    marginVertical: 8,
    marginHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    transform: [{ perspective: 1000 }],
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  letter: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
});
