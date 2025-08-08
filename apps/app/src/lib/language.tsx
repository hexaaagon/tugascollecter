import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Language,
  setLanguage as setGlobalLanguage,
  getCurrentLanguage,
  t as translate,
  LanguageStrings,
} from "@tugascollecter/language-pack";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: string) => any;
  strings: LanguageStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "user_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("en");

  React.useEffect(() => {
    setGlobalLanguage(language);
  }, [language]);

  // Load stored language asynchronously
  React.useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLanguage === "en" || storedLanguage === "id") {
          setCurrentLanguage(storedLanguage);
        }
      } catch (error) {
        console.warn("Failed to load stored language:", error);
      }
    };

    loadStoredLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
      setCurrentLanguage(newLanguage);
      setGlobalLanguage(newLanguage);
    } catch (error) {
      console.error("Failed to store language:", error);
    }
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t: translate,
    strings: translate as any, // This allows accessing the full strings object
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Convenience hook for just the translate function
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
