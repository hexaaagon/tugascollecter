import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  DrawerProvider,
  DrawerTrigger,
  CustomDrawerContent,
} from "@/components/drawer";
import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelLeft, List, ArrowUpDown, CloudOff } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();

  const pathname = usePathname();

  const insets = useSafeAreaInsets();
  const CustomHeader = () => (
    <View
      className="mx-5 flex-row items-center justify-between rounded-full px-5 py-1.5"
      style={{
        backgroundColor: isDarkColorScheme ? "#1f1f1f" : "#ffffff",
      }}
    >
      {/* Left - Hamburger Menu */}
      <DrawerTrigger className="mr-1 py-2 pr-2">
        <PanelLeft
          size={16}
          color={isDarkColorScheme ? "#ffffff" : "#000000"}
        />
      </DrawerTrigger>

      {/* Center - Search Button */}
      {pathname !== "/settings" && (
        <View className="mx-2 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 flex-1 items-center justify-start"
            style={{
              backgroundColor: isDarkColorScheme ? "#2d2d2d" : "#f5f5f5",
              borderRadius: 20,
            }}
            onPress={() => {
              toast.info("Search feature coming soon!");
            }}
          >
            <View className="flex-1 justify-center">
              <Text
                style={{
                  color: isDarkColorScheme ? "#9ca3af" : "#6b7280",
                  textAlign: "left",
                }}
              >
                Search your notes
              </Text>
            </View>
          </Button>
        </View>
      )}

      {/* Right - Action Icons */}
      <View className="flex-row items-center">
        <TouchableOpacity
          className="mr-1 p-2"
          onPress={() => {
            toast.warning("Feature Coming Soon!");
          }}
        >
          <List size={18} color={isDarkColorScheme ? "#ffffff" : "#000000"} />
        </TouchableOpacity>

        <TouchableOpacity
          className="mr-2 p-2"
          onPress={() => {
            toast.warning("Feature Coming Soon!");
          }}
        >
          <ArrowUpDown
            size={18}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-full bg-gray-400/30 p-2"
          onPress={() => {
            toast.warning("Cloud Sync Coming Soon", {
              description: "Sync features will be available in a future update",
            });
          }}
        >
          <CloudOff
            size={18}
            color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
          />
        </TouchableOpacity>

        {/*
        <Avatar alt="User Avatar" className="h-8 w-8">
          <AvatarImage source={{ uri: "https://github.com/shadcn.png" }} />
          <AvatarFallback>
            <View className="h-full w-full items-center justify-center rounded-full bg-blue-500">
              <View className="h-4 w-4 rounded-full bg-white" />
            </View>
          </AvatarFallback>
        </Avatar>
        */}
      </View>
    </View>
  );

  return (
    <DrawerProvider>
      <Stack
        screenOptions={{
          header: () => (
            <View
              style={{
                paddingTop: insets.top + 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <CustomHeader />
            </View>
          ),
        }}
      ></Stack>

      <CustomDrawerContent />
    </DrawerProvider>
  );
}
