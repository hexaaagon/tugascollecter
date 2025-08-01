import * as React from "react";
import { Stack } from "expo-router";
import {
  DrawerProvider,
  DrawerTrigger,
  CustomDrawerContent,
} from "@/components/drawer";
import { useColorScheme } from "@/lib/useColorScheme";
import { PanelLeft } from "lucide-react-native";
import { View } from "@rn-primitives/slot";

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <DrawerProvider>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <DrawerTrigger className="p-3 mr-2">
              <PanelLeft
                size={18}
                color={isDarkColorScheme ? "#ffffff" : "#000000"}
              />
            </DrawerTrigger>
          ),
          headerTitle: "Tugas Collecter",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 500,
            fontFamily: "Inter",
          },
          headerStyle: {
            backgroundColor: isDarkColorScheme ? "#121212" : "#ffffff",
          },
        }}
      ></Stack>

      <CustomDrawerContent />
    </DrawerProvider>
  );
}
