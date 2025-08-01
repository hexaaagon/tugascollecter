import * as React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Home, Calendar, BookOpen, Bell, User } from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

// Animated Tab Item Component
const AnimatedTabItem = React.memo(
  ({
    tab,
    isActive,
    onPress,
    isDarkColorScheme,
  }: {
    tab: (typeof tabs)[0];
    isActive: boolean;
    onPress: () => void;
    isDarkColorScheme: boolean;
  }) => {
    const scale = useSharedValue(1);
    const backgroundOpacity = useSharedValue(0);

    const IconComponent = tab.icon;

    // Handle active state changes
    React.useEffect(() => {
      backgroundOpacity.value = withSpring(isActive ? 1 : 0, {
        damping: 15,
        stiffness: 150,
        mass: 0.8,
      });
    }, [isActive, backgroundOpacity]);

    const handlePressIn = React.useCallback(() => {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 300,
      });
    }, [scale]);

    const handlePressOut = React.useCallback(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
    }, [scale]);

    const animatedContainerStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const animatedBackgroundStyle = useAnimatedStyle(() => ({
      opacity: backgroundOpacity.value,
      transform: [
        {
          scale: backgroundOpacity.value,
        },
      ],
    }));

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="flex-1 items-center py-2 px-1"
      >
        <Animated.View style={animatedContainerStyle}>
          <View className="relative p-2 mx-2">
            {/* Animated background */}
            <Animated.View
              style={animatedBackgroundStyle}
              className="absolute inset-0 bg-primary rounded-full"
            />
            {/* Icon */}
            <IconComponent
              size={22}
              color={
                isActive
                  ? isDarkColorScheme
                    ? "#000000"
                    : "#ffffff"
                  : isDarkColorScheme
                  ? "#9CA3AF"
                  : "#6B7280"
              }
            />
          </View>
          <Text
            className={`text-xs mt-1 text-center font-medium transition-colors duration-200 ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }
);

export function BottomNavigation({ currentTab, onTabChange }: BottomNavProps) {
  const { isDarkColorScheme } = useColorScheme();
  const lastTabChangeTime = React.useRef(0);

  // Debounced tab change to prevent rapid switching
  const handleTabChange = React.useCallback(
    (tabId: string) => {
      const now = Date.now();
      if (now - lastTabChangeTime.current < 150) {
        // 150ms debounce
        return;
      }
      lastTabChangeTime.current = now;
      onTabChange(tabId);
    },
    [onTabChange]
  );

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-background border-t border-border"
    >
      <View className="flex-row items-center justify-around py-2">
        {tabs.map((tab) => (
          <AnimatedTabItem
            key={tab.id}
            tab={tab}
            isActive={currentTab === tab.id}
            onPress={() => handleTabChange(tab.id)}
            isDarkColorScheme={isDarkColorScheme}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
