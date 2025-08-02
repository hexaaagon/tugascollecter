import * as React from "react";
import { Stack } from "expo-router";
import {
  DrawerProvider,
  DrawerTrigger,
  CustomDrawerContent,
} from "@/components/drawer";
import { useColorScheme } from "@/lib/useColorScheme";
import { PanelLeft } from "lucide-react-native";

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <DrawerProvider>
      <Stack
        screenOptions={{
          headerLeft: () => (
            <DrawerTrigger className="mr-2 p-3">
              <PanelLeft
                size={18}
                color={isDarkColorScheme ? "#ffffff" : "#000000"}
              />
            </DrawerTrigger>
          ),
          headerTitle: "Tugas Collecter",
          headerTitleStyle: {
            fontSize: 16,
            fontFamily: "DM Sans",
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
