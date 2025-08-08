import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import { useColorScheme } from "@/lib/useColorScheme";

interface ThemeDebugProps {
  visible?: boolean;
}

export function ThemeDebug({ visible = false }: ThemeDebugProps) {
  const { colorScheme, userPreference, isDarkColorScheme, systemColorScheme } =
    useColorScheme();

  if (!visible) return null;

  return (
    <View
      style={{
        margin: 16,
        padding: 12,
        backgroundColor: isDarkColorScheme ? "#1f2937" : "#f3f4f6",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: isDarkColorScheme ? "#374151" : "#d1d5db",
      }}
    >
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        🐛 Theme Debug Info
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 4 }}>
        User Preference: {userPreference}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 4 }}>
        Effective Color Scheme: {colorScheme}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 4 }}>
        System Color Scheme: {systemColorScheme || "undefined"}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 4 }}>
        Is Dark: {isDarkColorScheme ? "Yes" : "No"}
      </Text>
      <Text style={{ fontSize: 10, color: "#6b7280" }}>
        Updated: {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );
}
