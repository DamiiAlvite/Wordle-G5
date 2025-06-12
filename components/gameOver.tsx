import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";

export default function EndGame({game}) {

    const {word, loading} = useWordOfDay();

  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Juego Terminado!</Text>
      <View style={Styles.stat}>
        <View>
          <Text style={Styles.label}>Fecha:</Text>
          <Text>{game?.date ?? "-"}</Text>
        </View>
        <View>
          <Text style={Styles.label}>Intento Ganador:</Text>
          <Text>{game?.win_attemp ?? "-"}</Text>
        </View>
        <View>
          <Text style={Styles.label}>Palabra:</Text>
          <Text>{word ?? "-"}</Text>
        </View>
      </View>
      <Text style={Styles.footer}>Vuelve mañana para un nuevo desafío.</Text>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    width: "80%",
    height: "45%",
    marginHorizontal: "auto",
    marginVertical: "30%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 16,
  },
    stat: {
        marginVertical: 20,
    },
    label: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
    },
});