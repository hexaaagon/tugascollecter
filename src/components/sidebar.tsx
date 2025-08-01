import * as React from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/toggle-theme";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  BookOpen,
  Settings,
  User,
  Bell,
  X,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute?: string;
  onNavigate?: (route: string) => void;
}

const menuItems = [
  { id: "home", label: "Home", icon: Home, route: "/" },
  { id: "homework", label: "Homework", icon: BookOpen, route: "/homework" },
  { id: "calendar", label: "Calendar", icon: Calendar, route: "/calendar" },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    route: "/notifications",
  },
  { id: "profile", label: "Profile", icon: User, route: "/profile" },
  { id: "settings", label: "Settings", icon: Settings, route: "/settings" },
];

export function Sidebar({
  isOpen,
  onClose,
  currentRoute = "/",
  onNavigate,
}: SidebarProps) {
  const { isDarkColorScheme } = useColorScheme();
  const translateX = useSharedValue(-320);
  const overlayOpacity = useSharedValue(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      translateX.value = withTiming(0, { duration: 300 });
      overlayOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-320, { duration: 300 });
      overlayOpacity.value = withTiming(0, { duration: 300 }, () => {
        runOnJS(setIsVisible)(false);
      });
    }
  }, [isOpen]);

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleClose = React.useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View
        style={[overlayStyle]}
        className="absolute inset-0 bg-black/50 z-40"
      >
        <Pressable className="flex-1" onPress={handleClose} />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[sidebarStyle]}
        className="absolute left-0 top-0 bottom-0 w-80 bg-background border-r border-border z-50"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <Text className="text-xl font-bold">TugasCollector</Text>
          <Pressable
            onPress={handleClose}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <X size={20} color={isDarkColorScheme ? "#ffffff" : "#000000"} />
          </Pressable>
        </View>

        {/* Menu Items */}
        <View className="flex-1 pt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentRoute === item.route;

            return (
              <Pressable
                key={item.id}
                className={cn(
                  "flex-row items-center px-6 py-3 mx-3 rounded-lg mb-1",
                  isActive ? "bg-primary" : "hover:bg-muted"
                )}
                onPress={() => {
                  if (onNavigate) {
                    onNavigate(item.route);
                  }
                  handleClose();
                }}
              >
                <IconComponent
                  size={20}
                  color={
                    isActive
                      ? isDarkColorScheme
                        ? "#000000"
                        : "#ffffff"
                      : isDarkColorScheme
                      ? "#ffffff"
                      : "#000000"
                  }
                />
                <Text
                  className={cn(
                    "ml-3 font-medium",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Footer */}
        <View className="p-6 border-t border-border">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">Theme</Text>
            <ThemeToggle />
          </View>

          <View className="mt-4 pt-4 border-t border-border">
            <Text className="text-xs text-muted-foreground text-center">
              TugasCollector v1.0.0
            </Text>
          </View>
        </View>
      </Animated.View>
    </>
  );
}
