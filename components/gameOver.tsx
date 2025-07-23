import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useWordOfDay } from "@/context/wordOfTheDayProvider";
import AnimatedCell from "./animatedCell";
import slangWords from "@/utils/slang.json";

type GameProps = {
  game: {
    date?: string;
    win_attemp?: number;
    win?: boolean;
  } | null;
  mode?: string;
};

export default function EndGame({ game, mode }: GameProps) {
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
    <View style={styles.container}>
      {mode === "classic" && (
        <Text style={styles.title}>Modo clásico</Text>
      )}
      {mode === "slang" && (
        <Text style={styles.title}>Modo lunfardo</Text>
      )}
      <Text style={styles.subtitle}>Haz finalizado la partida:</Text>
      <View style={styles.stat}>
        <View style={styles.statItem}>
          <Text style={styles.label}>Fecha:</Text>
          <Text style={styles.value}>{game?.date ?? "-"}</Text>
        </View>
        {game?.win ? (
          <View style={styles.statItem}>
            <Text style={styles.label}>Intento Ganador:</Text>
            <Text style={styles.value}>{game?.win_attemp ?? "-"}</Text>
          </View>
        ) : (
          <View style={styles.statItem}>
            <Text style={styles.label}>No adivinaste la palabra del día.</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <Text style={styles.label}>Palabra:</Text>
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
              <Text style={styles.label}>Significado:</Text>
              <Text style={styles.value}>{getSlangDefinition(word)}</Text>
            </View>
            )}
          </>
          ) : (
            <Text style={styles.value}>-</Text>
          )}
        </View>
      </View>
      <Text style={styles.footer}>Vuelve mañana para un nuevo desafío.</Text>
      <Text style={styles.footer}>o</Text>
      <Text style={styles.footer}>Puedes probar otros modos.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: "auto",
    maxWidth: 400,
    padding: 28,
    backgroundColor: "#f9f9fb",
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
    color: "#222",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#555",
  },
  stat: {
    marginBottom: 24,
    paddingLeft: 16,
  },
  statItem: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    fontSize: 20,
    color: "#444",
    marginBottom: 4,
  },
  value: {
    marginLeft: 8,
    marginTop: 4,
    fontSize: 18,
    color: "#222",
  },
  wordContainer: {
    flexDirection: "row",
    marginVertical: 12,
    gap: 6,
    marginLeft: 24,
  },
  footer: {
    textAlign: "center",
    fontSize: 15,
    color: "#666",
  },
});
