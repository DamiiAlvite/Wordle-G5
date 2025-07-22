import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import WavesBackground from "@/assets/svg/wavesBackground";
import Game from "@/components/game";

export default function classicMode() {

  return (
    <View style={styles.container}>
      <WavesBackground style={styles.wavesBackground} />
      <Text style={styles.title}> Clásico </Text>
      <Game mode="classic"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    backgroundColor: "#E8F0FE",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginTop: 40,
    marginBottom: 20,
    color: "#2E3A59",
    letterSpacing: 3,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  day: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  wavesBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 0,
  },
});