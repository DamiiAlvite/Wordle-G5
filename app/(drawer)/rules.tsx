import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TopBar from "@/components/topBar";
import WavesBackground from "@/assets/svg/wavesBackground2";
import AnimatedCell from "@/components/animatedCell";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from "@/context/themeContext";

type ColorRule = {
  color: "correct" | "present" | "absent";
  text: string;
};

const classicRules = [
  "Tienes 6 intentos para adivinar la palabra secreta.",
  "Cada intento debe ser una palabra válida de la misma longitud que la palabra secreta.",
  "Después de cada intento, las letras cambiarán de color para mostrar qué tan cerca estás de la palabra:",
];

const colorRules: ColorRule[] = [
  { color: "correct", text: "Verde: la letra está en la palabra y en la posición correcta." },
  { color: "present", text: "Amarillo: la letra está en la palabra pero en una posición diferente." },
  { color: "absent", text: "Gris: la letra no está en la palabra." },
];

const additionalRules = [
  "Esta versión incluye palabras y letras con acento (á, é, í, ó, ú, ü, ñ). ¡Presta atención a los acentos!",
  "No se permiten palabras inventadas o con caracteres especiales fuera del español.",
];

const lunfardoRules = [
  "En este modo, las palabras secretas pertenecen al lunfardo argentino.",
  "El lunfardo es un argot típico de Buenos Aires que incluye palabras del italiano, francés y otros idiomas.",
  "Dos ejemplos de palabras del lunfardo son: \"laburo\" y \"chabón\".",
  "Las reglas de juego son las mismas que el modo clásico: 6 intentos para adivinar la palabra.",
];

const contrarrelojRules = [
  "¡El desafío más emocionante! Tienes solo 10 segundos por intento.",
  "Si no ingresas una palabra válida antes de que termine el tiempo, el intento se marca como fallido.",
  "Cada vez que completes un intento (correcto o incorrecto), el timer se reinicia a 10 segundos.",
  "Mantén las mismas reglas de colores: verde (correcto), amarillo (presente), gris (ausente).",
  `Cuando el tiempo se agota, aparece un ícono de reloj y pierdes ese intento.`,
  "¡Piensa rápido y escribe más rápido! La presión del tiempo hace que cada segundo cuente.",
];

const exampleWord = "XYZQW";

const RuleSection = ({
  title,
  rules,
  footer,
  children,
}: {
  title: string;
  rules: string[];
  footer: string;
  children?: React.ReactNode;
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.subcontainer, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <View style={styles.rulesList}>
        {rules.map((rule, idx) => (
          <Text key={idx} style={[styles.rule, { color: theme.colors.text }]}>{rule}</Text>
        ))}
        {children}
      </View>
      <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>{footer}</Text>
    </View>
  );
};

export default function RulesPage() {
  const { theme } = useTheme();
  const [flipTriggers, setFlipTriggers] = useState([false, false, false]);
  const [errorTriggers, setErrorTriggers] = useState([false, false, false, false, false]);

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
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}>
      <TopBar />
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
        <WavesBackground style={styles.wavesBackground} waveColor={theme.colors.waves} pointerEvents="none" />

        <RuleSection
          title="Reglas de Wordle"
          rules={classicRules.concat(additionalRules)}
          footer="¡Diviértete y demuestra tu vocabulario en español!"
        >
          {colorRules.map((rule, idx) => (
            <View key={`color-${idx}`} style={styles.colorRuleContainer}>
              <AnimatedCell
                letter="A"
                color={rule.color}
                flipTrigger={flipTriggers[idx]}
                shakeTrigger={false}
                persistColor={false}
              />
              <Text style={[styles.colorRuleText, { color: theme.colors.text }]}>{rule.text}</Text>
            </View>
          ))}

          <View style={styles.wordContainer}>
            {exampleWord.split('').map((letter, index) => (
              <AnimatedCell
                key={`error-${index}`}
                letter={letter}
                color="error"
                flipTrigger={false}
                shakeTrigger={errorTriggers[index]}
                persistColor={false}
              />
            ))}
          </View>
        </RuleSection>

        <RuleSection
          title="Modo lunfardo"
          rules={lunfardoRules}
          footer="Demuestra tu conocimiento del argot porteño!"
        />

        <RuleSection
          title="Modo contrarreloj "
          rules={contrarrelojRules}
          footer="Pon a prueba tu velocidad y demuestra tu vocabulario en español!"
        >
          <View style={styles.wordContainer}>
            {Array.from({ length: 5 }, (_, index) => (
              <AnimatedCell
                key={`timer-${index}`}
                letter={<MaterialCommunityIcons name="timer-off-outline" size={28} color="black" />}
                color="error"
                flipTrigger={false}
                shakeTrigger={errorTriggers[index]}
                persistColor={false}
              />
            ))}
          </View>
        </RuleSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    position: "relative",
  },
  container: {
    flexGrow: 1,
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
  },
  rulesList: {
    marginBottom: 24,
    width: "100%",
  },
  rule: {
    marginBottom: 12,
    fontSize: 18,
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
  },
});
