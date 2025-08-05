import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useColorScheme as useSystemColorScheme } from "react-native";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { storage } from "./storage";
import { setAndroidNavigationBar } from "./android-navigation-bar";

type ColorSchemeType = "light" | "dark" | "system";

interface ColorSchemeContextType {
  colorScheme: "light" | "dark";
  userPreference: ColorSchemeType;
  isDarkColorScheme: boolean;
  setColorScheme: (scheme: ColorSchemeType) => void;
  toggleColorScheme: () => void;
  systemColorScheme: "light" | "dark" | null | undefined;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined,
);

interface ColorSchemeProviderProps {
  children: ReactNode;
}

export function ColorSchemeProvider({ children }: ColorSchemeProviderProps) {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } =
    useNativewindColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] =
    useState<ColorSchemeType>("system");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedTheme = await storage.getThemePreference();
        setUserPreference(storedTheme);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to load theme preference:", error);
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  const getEffectiveColorScheme = (
    preference: ColorSchemeType,
  ): "light" | "dark" => {
    if (preference === "system") {
      return systemColorScheme || "dark";
    }
    return preference;
  };

  useEffect(() => {
    if (!isInitialized) return;

    const effectiveScheme = getEffectiveColorScheme(userPreference);
    if (effectiveScheme !== colorScheme) {
      requestAnimationFrame(() => {
        setNativeWindColorScheme(effectiveScheme);
      });
    }

    // Update Android navigation bar with opacity effect
    setAndroidNavigationBar(effectiveScheme);
  }, [userPreference, systemColorScheme, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    const effectiveScheme = getEffectiveColorScheme(userPreference);
    if (effectiveScheme !== colorScheme) {
      requestAnimationFrame(() => {
        setNativeWindColorScheme(effectiveScheme);
      });
    }

    // Update Android navigation bar with opacity effect
    setAndroidNavigationBar(effectiveScheme);
  }, [colorScheme]);

  const setColorScheme = async (newScheme: ColorSchemeType) => {
    setUserPreference(newScheme);

    const effectiveScheme = getEffectiveColorScheme(newScheme);

    requestAnimationFrame(() => {
      setNativeWindColorScheme(effectiveScheme);
    });

    // Update Android navigation bar with opacity effect
    setAndroidNavigationBar(effectiveScheme);

    try {
      await storage.setThemePreference(newScheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const toggleColorScheme = () => {
    const modes: ColorSchemeType[] = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(userPreference);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorScheme(modes[nextIndex]);
  };

  const currentEffectiveScheme = getEffectiveColorScheme(userPreference);

  const contextValue: ColorSchemeContextType = {
    colorScheme: currentEffectiveScheme,
    userPreference,
    isDarkColorScheme: currentEffectiveScheme === "dark",
    setColorScheme,
    toggleColorScheme,
    systemColorScheme,
  };

  return (
    <ColorSchemeContext.Provider value={contextValue}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
}
