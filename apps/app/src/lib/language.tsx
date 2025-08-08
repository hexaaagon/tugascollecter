import React, { createContext, useContext, useState, useEffect } from "react";
import { View } from "react-native";
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
  t: (key: string, replacements?: Record<string, string | number>) => any;
  strings: LanguageStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "user_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load stored language asynchronously
  React.useEffect(() => {
    const loadStoredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (storedLanguage === "en" || storedLanguage === "id") {
          setCurrentLanguage(storedLanguage);
          setGlobalLanguage(storedLanguage);
        } else {
          // If no stored language, set default and update global state
          setGlobalLanguage("en");
        }
      } catch (error) {
        console.warn("Failed to load stored language:", error);
        setGlobalLanguage("en");
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredLanguage();
  }, []);

  // Update global language when local language changes
  React.useEffect(() => {
    if (isInitialized) {
      setGlobalLanguage(language);
    }
  }, [language, isInitialized]);

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

  // Don't render children until language is initialized
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Simple loading without any text to avoid language issues */}
      </View>
    );
  }

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
