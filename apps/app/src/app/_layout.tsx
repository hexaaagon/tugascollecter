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

import {
  Appearance,
  Platform,
  View,
  BackHandler,
  AppState,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme, ColorSchemeProvider } from "@/lib/useColorScheme";

import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { Toaster } from "sonner-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { toast } from "sonner-native";
import { LanguageProvider } from "@/lib/language";
import { StorageManager } from "@/lib/storage";

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
  return (
    <LanguageProvider>
      <ColorSchemeProvider>
        <RootLayoutContent />
      </ColorSchemeProvider>
    </LanguageProvider>
  );
}

function RootLayoutContent() {
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

  const pathname = usePathname();
  const backPressCountRef = React.useRef(0);
  const exitTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Initialize storage and notification service
  React.useEffect(() => {
    const initializeStorage = async () => {
      try {
        await StorageManager.initialize();
      } catch (error) {
        console.error("Error initializing StorageManager:", error);
      }
    };

    initializeStorage();
  }, []);

  // Handle notification responses
  React.useEffect(() => {
    let notificationResponseSubscription: any;

    const setupNotificationHandlers = async () => {
      try {
        const { NotificationService } = await import("@/lib/notifications");

        // Listen for notification responses (when user taps notification)
        notificationResponseSubscription =
          NotificationService.addNotificationResponseListener((response) => {
            const { homeworkId } =
              response.notification.request.content.data || {};

            if (homeworkId) {
              // Navigate to the specific homework or tasks screen
              router.push("/(main)/tasks");
              toast.success("Opening homework details...");
            }
          });
      } catch (error) {
        console.error("Error setting up notification handlers:", error);
      }
    };

    setupNotificationHandlers();

    return () => {
      notificationResponseSubscription?.remove();
    };
  }, []);

  // Reset back press state when app comes to foreground
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        // App came to foreground, reset back press state
        backPressCountRef.current = 0;
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
          exitTimeoutRef.current = null;
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  // Android back button handler
  React.useEffect(() => {
    if (Platform.OS !== "android") return;

    const handleBackPress = () => {
      const isOnHome =
        pathname === "/" || pathname === "/(main)" || pathname === "/(main)/";

      if (!isOnHome) {
        // If not on home, navigate to home
        router.push("/");
        return true; // Prevent default back action
      } else {
        // On home screen - handle double tap to exit
        if (backPressCountRef.current === 0) {
          backPressCountRef.current = 1;
          toast("Press back again to exit", {
            description: "Tap back once more to close the app",
          });

          // Reset counter after 2 seconds
          exitTimeoutRef.current = setTimeout(() => {
            backPressCountRef.current = 0;
          }, 2000);

          return true; // Prevent default back action
        } else {
          // Second press - allow app to exit
          if (exitTimeoutRef.current) {
            clearTimeout(exitTimeoutRef.current);
          }
          return false; // Allow default back action (exit app)
        }
      }
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      subscription.remove();
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, [pathname]);

  usePlatformSpecificSetup();
  const { isDarkColorScheme } = useColorScheme();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack>
          <Stack.Screen
            name="(main)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <PortalHost />
      </ThemeProvider>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10000,
          pointerEvents: "none",
        }}
      >
        <Toaster position="bottom-center" richColors />
      </View>
    </GestureHandlerRootView>
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
  const { isDarkColorScheme } = useColorScheme();
  React.useLayoutEffect(() => {
    setAndroidNavigationBar(isDarkColorScheme ? "dark" : "light");
  }, [isDarkColorScheme]);
}

function noop() {}
