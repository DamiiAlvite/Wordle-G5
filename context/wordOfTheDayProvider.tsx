import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/lib/supabase";
import wordsData from "@/utils/5letters.json";
import slangData from "@/utils/slang.json";

type WordOfDayContextType = {
  wordClassic: string | null;
  wordIdClassic: number | null;
  wordTimeTrial: string | null;
  wordIdTimeTrial: number | null;
  wordSlang: string | null;
  wordIdSlang: number | null;
  loading: boolean;
};

const WordOfDayContext = createContext<WordOfDayContextType>({
  wordClassic: null,
  wordIdClassic: null,
  wordTimeTrial: null,
  wordIdTimeTrial: null,
  wordSlang: null,
  wordIdSlang: null,
  loading: true,
});

export const WordOfDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [wordClassic, setWordClassic] = useState<string | null>(null);
  const [wordIdClassic, setWordIdClassic] = useState<number | null>(null);
  const [wordSlang, setWordSlang] = useState<string | null>(null);
  const [wordIdSlang, setWordIdSlang] = useState<number | null>(null);
  const [wordTimeTrial, setWordTimeTrial] = useState<string | null>(null);
  const [wordIdTimeTrial, setWordIdTimeTrial] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getOrCreateWordOfTheDay = async () => {
    const today = getTodayDate();

    // Verificar si ya existe
    const { data: classicData } = await supabase
      .from("word")
      .select("id, description")
      .eq("date", today)
      .eq("mode", "classic")
      .single();

    if (classicData) {
      setWordClassic(classicData.description);
      setWordIdClassic(classicData.id);
      const { data: slangData } = await supabase
        .from("word")
        .select("id, description")
        .eq("date", today)
        .eq("mode", "slang")
        .single();
      if (slangData) {
        setWordSlang(slangData.description);
        setWordIdSlang(slangData.id);
      } else {
        setWordSlang(null);
        setWordIdSlang(null);
      }
      const { data: timeTrialData} = await supabase
        .from("word")
        .select("id, description")
        .eq("date", today)
        .eq("mode", "timeTrial")
        .single();
      if (timeTrialData) {
        setWordTimeTrial(timeTrialData.description);
        setWordIdTimeTrial(timeTrialData.id);
      } else {
        setWordTimeTrial(null);
        setWordIdTimeTrial(null);
      }
    } else {
      const words = wordsData;
      const slangWords = slangData;

      const randomWordClassic = words[Math.floor(Math.random() * words.length)];
      const { data: insertClassicData, error: insertClassicError } = await supabase
        .from("word")
        .insert([{ description: randomWordClassic, date: today, mode: "classic" }])
        .select("id")
        .single();
      if (!insertClassicError && insertClassicData) {
        setWordClassic(randomWordClassic);
        setWordIdClassic(insertClassicData.id);
        console.log("Inserted word:", randomWordClassic);
      } else {
        console.error("Error inserting word:", insertClassicError?.message);
      }

      
      const randomWordTimeTrial = words[Math.floor(Math.random() * words.length)];
      const { data: insertTimeTrialData, error: insertTimeTrialError } = await supabase
        .from("word")
        .insert([{ description: randomWordTimeTrial, date: today, mode: "timeTrial" }])
        .select("id")
        .single();

      if (!insertTimeTrialError && insertTimeTrialData) {
        setWordTimeTrial(randomWordTimeTrial);
        setWordIdTimeTrial(insertTimeTrialData.id);
        console.log("Inserted word:", randomWordTimeTrial);
      } else {
        console.error("Error inserting word:", insertTimeTrialError?.message);
      }

      const randomWordSlang = slangWords[Math.floor(Math.random() * slangWords.length)].word;
      const { data: insertSlangData, error: insertSlangError } = await supabase
        .from("word")
        .insert([{ description: randomWordSlang, date: today, mode: "slang" }])
        .select("id")
        .single();

      if (!insertSlangError && insertSlangData) {
        setWordSlang(randomWordSlang);
        setWordIdSlang(insertSlangData.id);
        console.log("Inserted word:", randomWordSlang);
      } else {
        console.error("Error inserting word:", insertSlangError?.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    getOrCreateWordOfTheDay();
  }, []);

  return (
    <WordOfDayContext.Provider value={{ wordClassic, wordIdClassic, wordSlang, wordIdSlang, wordTimeTrial, wordIdTimeTrial, loading }}>
      {children}
    </WordOfDayContext.Provider>
  );
};

export const useWordOfDay = () => useContext(WordOfDayContext);