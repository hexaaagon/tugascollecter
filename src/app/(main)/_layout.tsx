import * as React from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  DrawerProvider,
  DrawerTrigger,
  CustomDrawerContent,
} from "@/components/drawer";
import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PanelLeft, List, ArrowUpDown, CloudOff } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { NavigationBarOverlay } from "@/components/navigation-bar-overlay";

const ScrollContext = React.createContext<{
  handleScroll: (event: any) => void;
  headerTranslateY: Animated.Value;
} | null>(null);

export const useScroll = () => {
  const context = React.useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
  return context;
};

const CustomHeader = React.memo(function CustomHeader({
  colors,
  pathname,
  insets,
  translateY,
}: {
  colors: {
    headerBackground: string;
    iconColor: string;
    searchBackground: string;
    searchTextColor: string;
    mutedIconColor: string;
  };
  pathname: string;
  insets: any;
  translateY: Animated.Value;
}) {
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
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        transform: [{ translateY }],
      }}
    >
      <View
        className="mx-5 flex-row items-center justify-between rounded-full px-5 py-1.5"
        style={{
          backgroundColor: colors.headerBackground,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <DrawerTrigger className="mr-1 py-2 pr-2">
          <PanelLeft size={16} color={colors.iconColor} />
        </DrawerTrigger>

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
    </Animated.View>
  );
});

export default function Layout() {
  const { isDarkColorScheme } = useColorScheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const headerTranslateY = React.useRef(new Animated.Value(0)).current;
  const [isHeaderHidden, setIsHeaderHidden] = React.useState(false);

  const handleScroll = useScrollPosition(
    ({ prevPos, currPos }) => {
      const isScrollingDown = currPos.y > prevPos.y;
      const isScrollingUp = currPos.y < prevPos.y;
      const shouldHide = isScrollingDown && currPos.y > 50 && !isHeaderHidden;
      const shouldShow = isScrollingUp && isHeaderHidden;

      if (shouldHide) {
        setIsHeaderHidden(true);
        Animated.timing(headerTranslateY, {
          toValue: -(insets.top + 60),
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (shouldShow) {
        setIsHeaderHidden(false);
        Animated.timing(headerTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    [isHeaderHidden, insets.top],
  );

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
      <ScrollContext.Provider value={{ handleScroll, headerTranslateY }}>
        <CustomHeader
          colors={colors}
          pathname={pathname}
          insets={insets}
          translateY={headerTranslateY}
        />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />

        <NavigationBarOverlay />

        <CustomDrawerContent />
      </ScrollContext.Provider>
    </DrawerProvider>
  );
}
