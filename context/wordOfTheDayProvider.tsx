import { createContext, useState, useEffect, useContext, useRef } from "react";
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

// Singleton global para evitar múltiples ejecuciones en toda la app
let globalInitializationPromise: Promise<any> | null = null;
let globalIsInitialized = false;
let globalInitializationData: any = null;

export const WordOfDayProvider = ({ children }: { children: React.ReactNode }) => {
  const [wordClassic, setWordClassic] = useState<string | null>(null);
  const [wordIdClassic, setWordIdClassic] = useState<number | null>(null);
  const [wordSlang, setWordSlang] = useState<string | null>(null);
  const [wordIdSlang, setWordIdSlang] = useState<number | null>(null);
  const [wordTimeTrial, setWordTimeTrial] = useState<string | null>(null);
  const [wordIdTimeTrial, setWordIdTimeTrial] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isInitialized = useRef(false);
  const isMounted = useRef(true);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const getOrCreateWordOfTheDay = async () => {
    // Si ya hay una inicialización global en progreso, esperarla
    if (globalInitializationPromise) {
      try {
        await globalInitializationPromise;
        if (globalInitializationData && isMounted.current) {
          // Aplicar datos ya obtenidos
          setWordClassic(globalInitializationData.wordClassic);
          setWordIdClassic(globalInitializationData.wordIdClassic);
          setWordSlang(globalInitializationData.wordSlang);
          setWordIdSlang(globalInitializationData.wordIdSlang);
          setWordTimeTrial(globalInitializationData.wordTimeTrial);
          setWordIdTimeTrial(globalInitializationData.wordIdTimeTrial);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error waiting for global initialization:", error);
        setLoading(false);
      }
      return;
    }

    // Si ya está inicializado globalmente, usar los datos
    if (globalIsInitialized && globalInitializationData && isMounted.current) {
      setWordClassic(globalInitializationData.wordClassic);
      setWordIdClassic(globalInitializationData.wordIdClassic);
      setWordSlang(globalInitializationData.wordSlang);
      setWordIdSlang(globalInitializationData.wordIdSlang);
      setWordTimeTrial(globalInitializationData.wordTimeTrial);
      setWordIdTimeTrial(globalInitializationData.wordIdTimeTrial);
      setLoading(false);
      return;
    }

    // Si ya está inicializado este componente específico, no hacer nada
    if (isInitialized.current) {
      return;
    }

    // Marcar como inicializado inmediatamente para evitar condiciones de carrera
    isInitialized.current = true;
    
    // Crear la promesa global de inicialización
    globalInitializationPromise = (async () => {
      const today = getTodayDate();

      try {
        // Verificar si ya existen todas las palabras del día
        const { data: existingWords, error: fetchError } = await supabase
          .from("word")
          .select("id, description, mode")
          .eq("date", today)
          .in("mode", ["classic", "slang", "timeTrial"]);

        if (fetchError) {
          throw fetchError;
        }

        const classicWord = existingWords?.find(word => word.mode === "classic");
        const slangWord = existingWords?.find(word => word.mode === "slang");
        const timeTrialWord = existingWords?.find(word => word.mode === "timeTrial");

        let resultData = {
          wordClassic: classicWord?.description || null,
          wordIdClassic: classicWord?.id || null,
          wordSlang: slangWord?.description || null,
          wordIdSlang: slangWord?.id || null,
          wordTimeTrial: timeTrialWord?.description || null,
          wordIdTimeTrial: timeTrialWord?.id || null,
        };

        // Solo insertar las palabras que faltan
        const words = wordsData;
        const slangWords = slangData;

        // Insertar palabra clásica si no existe
        if (!classicWord) {
          const randomWordClassic = words[Math.floor(Math.random() * words.length)];
          try {
            const { data: insertClassicData, error: insertClassicError } = await supabase
              .from("word")
              .insert([{ description: randomWordClassic, date: today, mode: "classic" }])
              .select("id")
              .single();
            
            if (!insertClassicError && insertClassicData) {
              resultData.wordClassic = randomWordClassic;
              resultData.wordIdClassic = insertClassicData.id;
              console.log("Inserted classic word:", randomWordClassic);
            } else {
              // Si hay error de duplicado, obtener la palabra existente
              if (insertClassicError?.code === '23505') {
                const { data: existingClassic } = await supabase
                  .from("word")
                  .select("id, description")
                  .eq("date", today)
                  .eq("mode", "classic")
                  .single();
                
                if (existingClassic) {
                  resultData.wordClassic = existingClassic.description;
                  resultData.wordIdClassic = existingClassic.id;
                }
              } else {
                console.error("Error inserting classic word:", insertClassicError?.message);
              }
            }
          } catch (error) {
            console.error("Unexpected error inserting classic word:", error);
          }
        }

        // Insertar palabra time trial si no existe
        if (!timeTrialWord) {
          const randomWordTimeTrial = words[Math.floor(Math.random() * words.length)];
          try {
            const { data: insertTimeTrialData, error: insertTimeTrialError } = await supabase
              .from("word")
              .insert([{ description: randomWordTimeTrial, date: today, mode: "timeTrial" }])
              .select("id")
              .single();

            if (!insertTimeTrialError && insertTimeTrialData) {
              resultData.wordTimeTrial = randomWordTimeTrial;
              resultData.wordIdTimeTrial = insertTimeTrialData.id;
              console.log("Inserted timeTrial word:", randomWordTimeTrial);
            } else {
              // Si hay error de duplicado, obtener la palabra existente
              if (insertTimeTrialError?.code === '23505') {
                const { data: existingTimeTrial } = await supabase
                  .from("word")
                  .select("id, description")
                  .eq("date", today)
                  .eq("mode", "timeTrial")
                  .single();
                
                if (existingTimeTrial) {
                  resultData.wordTimeTrial = existingTimeTrial.description;
                  resultData.wordIdTimeTrial = existingTimeTrial.id;
                }
              } else {
                console.error("Error inserting timeTrial word:", insertTimeTrialError?.message);
              }
            }
          } catch (error) {
            console.error("Unexpected error inserting timeTrial word:", error);
          }
        }

        // Insertar palabra slang si no existe
        if (!slangWord) {
          const randomWordSlang = slangWords[Math.floor(Math.random() * slangWords.length)].word;
          try {
            const { data: insertSlangData, error: insertSlangError } = await supabase
              .from("word")
              .insert([{ description: randomWordSlang, date: today, mode: "slang" }])
              .select("id")
              .single();

            if (!insertSlangError && insertSlangData) {
              resultData.wordSlang = randomWordSlang;
              resultData.wordIdSlang = insertSlangData.id;
              console.log("Inserted slang word:", randomWordSlang);
            } else {
              // Si hay error de duplicado, obtener la palabra existente
              if (insertSlangError?.code === '23505') {
                const { data: existingSlang } = await supabase
                  .from("word")
                  .select("id, description")
                  .eq("date", today)
                  .eq("mode", "slang")
                  .single();
                
                if (existingSlang) {
                  resultData.wordSlang = existingSlang.description;
                  resultData.wordIdSlang = existingSlang.id;
                }
              } else {
                console.error("Error inserting slang word:", insertSlangError?.message);
              }
            }
          } catch (error) {
            console.error("Unexpected error inserting slang word:", error);
          }
        }

        // Guardar datos globalmente
        globalInitializationData = resultData;
        globalIsInitialized = true;

        return resultData;

      } catch (error) {
        console.error("Error in getOrCreateWordOfTheDay:", error);
        throw error;
      }
    })();

    try {
      const data = await globalInitializationPromise;
      
      if (isMounted.current && data) {
        setWordClassic(data.wordClassic);
        setWordIdClassic(data.wordIdClassic);
        setWordSlang(data.wordSlang);
        setWordIdSlang(data.wordIdSlang);
        setWordTimeTrial(data.wordTimeTrial);
        setWordIdTimeTrial(data.wordIdTimeTrial);
      }
    } catch (error) {
      console.error("Error initializing words:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      globalInitializationPromise = null;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    getOrCreateWordOfTheDay();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <WordOfDayContext.Provider value={{ wordClassic, wordIdClassic, wordSlang, wordIdSlang, wordTimeTrial, wordIdTimeTrial, loading }}>
      {children}
    </WordOfDayContext.Provider>
  );
};

export const useWordOfDay = () => useContext(WordOfDayContext);