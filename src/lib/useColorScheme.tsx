import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { useState, useEffect } from "react";

type ColorSchemeType = "light" | "dark" | "system";

export function useColorScheme() {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] =
    useState<ColorSchemeType>("system");

  // Determine the actual color scheme based on user preference
  const getEffectiveColorScheme = (preference: ColorSchemeType) => {
    if (preference === "system") {
      return systemColorScheme || "dark";
    }
    return preference;
  };

  // Update NativeWind when system changes or user preference changes
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
