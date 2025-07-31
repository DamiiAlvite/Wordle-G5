import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/authProvider';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: {
    background: string;
    background2: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    card: string;
    overlay: string;
    waves: string;
  };
}

const lightTheme: Theme = {
  colors: {
    background: '#E8F0FE',
    background2: '#d5e6ff',
    surface: '#FFFFFF',
    primary: '#5792EE',
    secondary: '#34434d',
    text: '#222222',
    textSecondary: '#666666',
    border: '#e0e0e0',
    error: '#d00000',
    success: '#22c55e',
    warning: '#facc15',
    card: 'rgba(255,255,255,0.85)',
    overlay: 'rgba(0,0,0,0.4)',
    waves: '#ffffff',
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#233655ff',
    background2: '#283f65ff',
    surface: '#1e1e1e',
    primary: '#5792EE',
    secondary: '#e0e0e0',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    error: '#ff4444',
    success: '#22c55e',
    warning: '#facc15',
    card: 'rgba(30,30,30,0.85)',
    overlay: 'rgba(0,0,0,0.6)',
    waves: '#000000',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const systemColorScheme = useColorScheme();
  const { userId } = useAuth();

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;

  const loadTheme = async () => {
    if (!userId) return;
    
    const { data, error } = await supabase
      .from('user')
      .select('theme')
      .eq('user_id', userId)
      .single();
    
    if (!error && data?.theme) {
      setThemeModeState(data.theme as ThemeMode);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    
    if (userId) {
      await supabase
        .from('user')
        .update({ theme: mode })
        .eq('user_id', userId);
    }
  };

  useEffect(() => {
    loadTheme();
  }, [userId]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
