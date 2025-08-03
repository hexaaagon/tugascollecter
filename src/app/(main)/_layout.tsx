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

// Move CustomHeader outside as a separate component to avoid recreation
const CustomHeader = React.memo(function CustomHeader({
  colors,
  pathname,
}: {
  colors: {
    headerBackground: string;
    iconColor: string;
    searchBackground: string;
    searchTextColor: string;
    mutedIconColor: string;
  };
  pathname: string;
}) {
  // Memoize event handlers within the component
  const handleSearchPress = React.useCallback(() => {
    toast.info("Search feature coming soon!");
  }, []);

  const handleListPress = React.useCallback(() => {
    toast.warning("Feature Coming Soon!");
  }, []);

  const handleSortPress = React.useCallback(() => {
    toast.warning("Feature Coming Soon!");
  }, []);

  const handleCloudPress = React.useCallback(() => {
    toast.warning("Cloud Sync Coming Soon", {
      description: "Sync features will be available in a future update",
    });
  }, []);

  return (
    <View
      className="mx-5 flex-row items-center justify-between rounded-full px-5 py-1.5"
      style={{
        backgroundColor: colors.headerBackground,
      }}
    >
      {/* Left - Hamburger Menu */}
      <DrawerTrigger className="mr-1 py-2 pr-2">
        <PanelLeft size={16} color={colors.iconColor} />
      </DrawerTrigger>

      {/* Center - Search Button */}
      {(pathname === "/" || pathname.startsWith("/tasks")) && (
        <View className="mx-2 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 flex-1 items-start justify-start"
            style={{
              backgroundColor: colors.searchBackground,
              borderRadius: 20,
            }}
            onPress={handleSearchPress}
          >
            <View className="ml-1.5 flex-1 justify-center">
              <Text
                style={{
                  color: colors.searchTextColor,
                  textAlign: "left",
                  fontSize: 12,
                }}
              >
                Search your homework
              </Text>
            </View>
          </Button>
        </View>
      )}

      {/* Right - Action Icons */}
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-1 p-2" onPress={handleListPress}>
          <List size={18} color={colors.iconColor} />
        </TouchableOpacity>

        <TouchableOpacity className="mr-2 p-2" onPress={handleSortPress}>
          <ArrowUpDown size={18} color={colors.iconColor} />
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-full bg-gray-400/30 p-2"
          onPress={handleCloudPress}
        >
          <CloudOff size={18} color={colors.mutedIconColor} />
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
});

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Memoize colors to prevent recalculation on every render
  const colors = React.useMemo(
    () => ({
      headerBackground: isDarkColorScheme ? "#1f1f1f" : "#f7f7f7",
      iconColor: isDarkColorScheme ? "#ffffff" : "#000000",
      searchBackground: isDarkColorScheme ? "#2d2d2d" : "#e3e3e3",
      searchTextColor: isDarkColorScheme ? "#9ca3af" : "#6b7280",
      mutedIconColor: isDarkColorScheme ? "#9ca3af" : "#6b7280",
    }),
    [isDarkColorScheme],
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
              <CustomHeader colors={colors} pathname={pathname} />
            </View>
          ),
        }}
      ></Stack>

      <CustomDrawerContent />
    </DrawerProvider>
  );
}
