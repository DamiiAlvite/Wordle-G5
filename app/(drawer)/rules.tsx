import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TopBar from "@/components/topBar";

const rules = [
  "Tienes 6 intentos para adivinar la palabra secreta.",
  "Cada intento debe ser una palabra válida de la misma longitud que la palabra secreta.",
  "Después de cada intento, las letras cambiarán de color para mostrar qué tan cerca estás de la palabra:",
  "• Verde: la letra está en la palabra y en la posición correcta.",
  "• Amarillo: la letra está en la palabra pero en una posición diferente.",
  "• Gris: la letra no está en la palabra.",
  "Esta versión incluye palabras y letras con acento (á, é, í, ó, ú, ü, ñ). ¡Presta atención a los acentos!",
  "No se permiten palabras inventadas o con caracteres especiales fuera del español.",
];

export default function RulesPage() {
  return (
    <View style={styles.container}>
      <TopBar />
        <View style={styles.subcontainer}>
          <Text style={styles.title}>Reglas de Wordle</Text>
          <View style={styles.rulesList}>
            {rules.map((rule, idx) => (
              <Text key={idx} style={styles.rule}>
                {rule}
              </Text>
            ))}
          </View>
          <Text style={styles.footer}>
            ¡Diviértete y demuestra tu vocabulario en español!
          </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#d5e6ff",
    alignItems: "center",
  },
  subcontainer: {
    width: "90%",
    marginTop: 30,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#34434d",
  },
  rulesList: {
    marginBottom: 24,
    width: "100%",
  },
  rule: {
    marginBottom: 12,
    fontSize: 18,
    color: "#222",
  },
  footer: {
    marginTop: 24,
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    color: "#444",
  },
});