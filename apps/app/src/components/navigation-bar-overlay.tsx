import React from "react";
import { View, Platform, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/lib/useColorScheme";

export const NavigationBarOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkColorScheme } = useColorScheme();

  // Only render on Android
  if (Platform.OS !== "android") {
    return null;
  }

  const navBarHeight = insets.top > 0 ? insets.top : 20;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: navBarHeight,
        backgroundColor: isDarkColorScheme
          ? "rgba(15, 23, 42, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        zIndex: 100,
        pointerEvents: "none",
        borderTopWidth: 0.5,
        borderTopColor: isDarkColorScheme
          ? "rgba(71, 85, 105, 0.4)"
          : "rgba(148, 163, 184, 0.4)",
      }}
    />
  );
};
