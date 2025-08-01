import "@/styles/global.css";

import * as React from "react";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  DMMono_400Regular,
  DMMono_500Medium,
} from "@expo-google-fonts/dm-mono";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
  GeistMono_700Bold,
} from "@expo-google-fonts/geist-mono";

import { Appearance, Platform, View } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
  web: useSetWebBackgroundClassName,
  android: useSetAndroidNavigationBar,
  default: noop,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // DM Sans family
    "DM Sans": DMSans_400Regular,
    "DM Sans Medium": DMSans_500Medium,
    "DM Sans SemiBold": DMSans_600SemiBold,
    "DM Sans Bold": DMSans_700Bold,

    // DM Mono family
    "DM Mono": DMMono_400Regular,
    "DM Mono Medium": DMMono_500Medium,

    // Inter family
    Inter: Inter_400Regular,
    "Inter Medium": Inter_500Medium,
    "Inter SemiBold": Inter_600SemiBold,
    "Inter Bold": Inter_700Bold,

    // Bricolage Grotesque family
    "Bricolage Grotesque": BricolageGrotesque_400Regular,
    "Bricolage Grotesque Medium": BricolageGrotesque_500Medium,
    "Bricolage Grotesque SemiBold": BricolageGrotesque_600SemiBold,
    "Bricolage Grotesque Bold": BricolageGrotesque_700Bold,

    // Geist family
    Geist: Geist_400Regular,
    "Geist Medium": Geist_500Medium,
    "Geist SemiBold": Geist_600SemiBold,
    "Geist Bold": Geist_700Bold,

    // Geist Mono family
    "Geist Mono": GeistMono_400Regular,
    "Geist Mono Medium": GeistMono_500Medium,
    "Geist Mono SemiBold": GeistMono_600SemiBold,
    "Geist Mono Bold": GeistMono_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
  useIsomorphicLayoutEffect(() => {
    document.documentElement.classList.add("bg-background");
  }, []);
}

function useSetAndroidNavigationBar() {
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
  }, []);
}

function noop() {}
