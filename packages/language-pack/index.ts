export type { Language, LanguageStrings } from "./shared/types";
import type { Language, LanguageStrings } from "./shared/types";
import { englishStrings } from "./locales/en";
import { indonesianStrings } from "./locales/id";

const translations: Record<Language, LanguageStrings> = {
  en: englishStrings,
  id: indonesianStrings,
};

let currentLanguage: Language = "en";

export function setLanguage(language: Language): void {
  currentLanguage = language;
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function t(
  key: string,
  replacements?: Record<string, string | number>
): any {
  const keys = key.split(".");
  let result: any = translations[currentLanguage];

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      console.warn(
        `Translation key "${key}" not found for language "${currentLanguage}"`
      );
      return key;
    }
  }

  // Handle string replacements
  if (typeof result === "string" && replacements) {
    return result.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
      return replacements[placeholder]?.toString() ?? match;
    });
  }

  return result;
}

export function getTranslations(language?: Language): LanguageStrings {
  return translations[language || currentLanguage];
}

export { englishStrings, indonesianStrings, translations };
