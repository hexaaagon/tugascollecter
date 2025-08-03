import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { useState, useEffect } from "react";
import { storage } from "./storage";

type ColorSchemeType = "light" | "dark" | "system";

export function useColorScheme() {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] =
    useState<ColorSchemeType>("system");

  useEffect(() => {
    const loadThemePreference = async () => {
      const storedTheme = await storage.getThemePreference();
      setUserPreference(storedTheme);
    };

    loadThemePreference();
  }, []);

  const getEffectiveColorScheme = (preference: ColorSchemeType) => {
    if (preference === "system") {
      return systemColorScheme || "dark";
    }
    return preference;
  };

  useEffect(() => {
    const effectiveScheme = getEffectiveColorScheme(userPreference);
    if (effectiveScheme !== colorScheme) {
      setNativeWindColorScheme(effectiveScheme);
    }
  }, [
    userPreference,
    systemColorScheme,
    colorScheme,
    setNativeWindColorScheme,
  ]);

  const setColorScheme = (newScheme: ColorSchemeType) => {
    setUserPreference(newScheme);
    storage.setThemePreference(newScheme);
    const effectiveScheme = getEffectiveColorScheme(newScheme);
    setNativeWindColorScheme(effectiveScheme);
  };

  const toggleColorScheme = () => {
    const modes: ColorSchemeType[] = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(userPreference);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorScheme(modes[nextIndex]);
  };

  const currentEffectiveScheme = getEffectiveColorScheme(userPreference);

  return {
    colorScheme: currentEffectiveScheme,
    userPreference,
    isDarkColorScheme: currentEffectiveScheme === "dark",
    setColorScheme,
    toggleColorScheme,
    systemColorScheme,
  };
}
