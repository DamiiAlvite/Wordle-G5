import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";
import AnimatedCell from "../animatedCell";
import slangWords from "@/utils/slang.json";
import { useTheme } from "@/context/themeContext";

type GameProps = {
  game: {
    date?: string;
    win_attempt?: number;
    win?: boolean;
  } | null;
  mode?: string;
};

export default function EndGame({ game, mode }: GameProps) {
  const { theme } = useTheme();
  const today = new Date().toISOString().split("T")[0];
  const { wordClassic, wordSlang, wordTimeTrial, loading } = useWordOfDay();
  let word: string | null = null;
  if (mode === "classic") {
    word = wordClassic;
  } else if (mode === "slang") {
    word = wordSlang;
  } else if (mode === "timeTrial") {
    word = wordTimeTrial;
  }
  const getSlangDefinition = (word: string): string => {
      const slangWord = slangWords.find(item => item.word.toLowerCase() === word.toLowerCase());
      return slangWord ? slangWord.definition : "Definición no disponible";
  };

  const [flipTriggers, setFlipTriggers] = useState<boolean[]>([]);

  useEffect(() => {
    if (word) {
      setFlipTriggers(new Array(word.length).fill(false));
      const timer = setTimeout(() => {
        word.split('').forEach((_, index) => {
          setTimeout(() => {
            setFlipTriggers(prev => {
              const newTriggers = [...prev];
              newTriggers[index] = true;
              return newTriggers;
            });
          }, index * 150);
        });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [word]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {mode === "classic" && (
        <Text style={[styles.title, { color: theme.colors.text }]}>Modo clásico</Text>
      )}
      {mode === "slang" && (
        <Text style={[styles.title, { color: theme.colors.text }]}>Modo lunfardo</Text>
      )}
      {mode === "timeTrial" && (
        <Text style={[styles.title, { color: theme.colors.text }]}>Modo contrarreloj</Text>
      )}
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Haz finalizado la partida:</Text>
      <View style={styles.stat}>
        <View style={styles.statItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Fecha:</Text>
          <Text style={[styles.value, { color: theme.colors.textSecondary }]}>{game?.date ?? today}</Text>
        </View>
        {game?.win ? (
          <View style={styles.statItem}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Intento Ganador:</Text>
            <Text style={[styles.value, { color: theme.colors.textSecondary }]}>{game?.win_attempt ?? "-"}</Text>
          </View>
        ) : (
          <View style={styles.statItem}>
            <Text style={[styles.label, { color: theme.colors.text }]}>No adivinaste la palabra del día.</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Palabra:</Text>
          {word ? (<>
            <View style={styles.wordContainer}>
              {word.split('').map((letter, index) => (
                <AnimatedCell
                  key={`word-${index}`}
                  letter={letter.toUpperCase()}
                  color="correct"
                  flipTrigger={flipTriggers[index] || false}
                  shakeTrigger={false}
                />
              ))}
            </View>
            {mode === "slang" && (
            <View style={styles.statItem}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Significado:</Text>
              <Text style={[styles.value, { color: theme.colors.textSecondary }]}>{getSlangDefinition(word)}</Text>
            </View>
            )}
          </>
          ) : (
            <Text style={[styles.value, { color: theme.colors.textSecondary }]}>-</Text>
          )}
        </View>
      </View>
      <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>Vuelve mañana para un nuevo desafío.</Text>
      <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>o</Text>
      <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>Puedes probar otros modos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "auto",
    maxWidth: 400,
    padding: 28,
    borderRadius: 32,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  stat: {
    marginBottom: 24,
    paddingLeft: "1%",
  },
  statItem: {
    marginBottom: "1%",
    
  },
  label: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom:"1%",
  },
  value: {
    marginLeft: 8,
    marginTop: "1%",
    fontSize: 18,
  },
  wordContainer: {
    flexDirection: "row",
    marginVertical: 12,
    gap: 6,
    justifyContent: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: 15,
  },
});
