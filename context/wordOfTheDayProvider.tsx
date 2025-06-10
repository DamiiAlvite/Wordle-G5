import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import wordsData from "@/utils/5letters.json";

type WordOfDayContextType = {
  word: string | null;
  loading: boolean;
};

const WordOfDayContext = createContext<WordOfDayContextType>({
  word: null,
  loading: true,
});

export const WordOfDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [word, setWord] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getOrCreateWordOfTheDay = async () => {
    const today = getTodayDate();

    // Verificar si ya existe
    const { data, error } = await supabase
      .from("word")
      .select("description")
      .eq("date", today)
      .single();

    if (data) {
      setWord(data.description);
    } else {
      const words = wordsData;
      const randomWord = words[Math.floor(Math.random() * words.length)];

      const { error: insertError } = await supabase
        .from("word")
        .insert([{ description: randomWord, date: today }]);
        console.log("Inserted word:", randomWord);

      if (!insertError) {
        setWord(randomWord);
      } else {
        console.error("Error inserting word:", insertError.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getOrCreateWordOfTheDay();
  }, []);

  return (
    <WordOfDayContext.Provider value={{ word, loading }}>
      {children}
    </WordOfDayContext.Provider>
  );
};

export const useWordOfDay = () => useContext(WordOfDayContext);
