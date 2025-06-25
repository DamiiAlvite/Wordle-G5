import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TopBar from "@/components/topBar";
import WavesBackground from "@/assets/svg/wavesBackground2";
import AnimatedCell from "@/components/animatedCell";

const rules = [
  "Tienes 6 intentos para adivinar la palabra secreta.",
  "Cada intento debe ser una palabra válida de la misma longitud que la palabra secreta.",
  "Después de cada intento, las letras cambiarán de color para mostrar qué tan cerca estás de la palabra:",
];

const colorRules = [
  { color: "correct" as const, text: "Verde: la letra está en la palabra y en la posición correcta." },
  { color: "present" as const, text: "Amarillo: la letra está en la palabra pero en una posición diferente." },
  { color: "absent" as const, text: "Gris: la letra no está en la palabra." },
];

const additionalRules = [
  "Esta versión incluye palabras y letras con acento (á, é, í, ó, ú, ü, ñ). ¡Presta atención a los acentos!",
  "No se permiten palabras inventadas o con caracteres especiales fuera del español.",
];

const exampleWord = "XYZQW";

export default function RulesPage() {
  const [flipTriggers, setFlipTriggers] = useState<boolean[]>([false, false, false]);
  const [errorTriggers, setErrorTriggers] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    const startFlipCycle = () => {
      setFlipTriggers([false, false, false]);

      setTimeout(() => setFlipTriggers([false, true, false]), 100);
      setTimeout(() => setFlipTriggers([false, true, true]), 600);
      setTimeout(() => setFlipTriggers([true, true, true]), 1100);
      setTimeout(() => setFlipTriggers([true, true, false]), 6000);
      setTimeout(() => setFlipTriggers([false, true, false]), 6500);
      setTimeout(() => setFlipTriggers([false, false, false]), 7000);
    };

    const initialTimer = setTimeout(startFlipCycle, 2000);
    const flipInterval = setInterval(startFlipCycle, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(flipInterval);
    };
  }, []);

  useEffect(() => {
    const triggerErrorAnimation = () => {
      setErrorTriggers([true, true, true, true, true]);
      setTimeout(() => setErrorTriggers([false, false, false, false, false]), 600);
    };

    const initialErrorTimer = setTimeout(triggerErrorAnimation, 4500);
    const errorInterval = setInterval(triggerErrorAnimation, 5000);

    return () => {
      clearTimeout(initialErrorTimer);
      clearInterval(errorInterval);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar />
      <WavesBackground style={styles.wavesBackground} pointerEvents="none" />
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Reglas de Wordle</Text>
        <View style={styles.rulesList}>
          {rules.map((rule, idx) => (
            <Text key={idx} style={styles.rule}>{rule}</Text>
          ))}
          {colorRules.map((colorRule, idx) => (
            <View key={`color-${idx}`} style={styles.colorRuleContainer}>
              <AnimatedCell
                letter="A"
                color={colorRule.color}
                flipTrigger={flipTriggers[idx]}
                shakeTrigger={false}
              />
              <Text style={styles.colorRuleText}>{colorRule.text}</Text>
            </View>
          ))}

          {additionalRules.map((rule, idx) => (
            <Text key={`additional-${idx}`} style={styles.rule}>{rule}</Text>
          ))}

          <View style={styles.wordContainer}>
            {exampleWord.split('').map((letter, index) => (
              <AnimatedCell
                key={`error-${index}`}
                letter={letter}
                color="error"
                flipTrigger={false}
                shakeTrigger={errorTriggers[index]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.footer}>¡Diviértete y demuestra tu vocabulario en español!</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#d5e6ff",
    alignItems: "center",
    zIndex: -1000,
  },
  wavesBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
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
  colorRuleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  colorRuleText: {
    marginLeft: 12,
    fontSize: 18,
    color: "#222",
    flex: 1,
  },
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  footer: {
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
    color: "#444",
  },
});
