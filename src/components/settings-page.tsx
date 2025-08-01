import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/toggle-theme";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  HelpCircle,
  Info,
  Palette,
  Calendar,
  Download,
  ChevronRight,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { isDarkColorScheme } = useColorScheme();

  const settingsSections = [
    {
      title: "Appearance",
      items: [
        {
          id: "theme",
          label: "Dark Mode",
          description: "Switch between light and dark theme",
          icon: Palette,
          action: "toggle",
        },
      ],
    },
    {
      title: "Account & Data",
      items: [
        {
          id: "profile",
          label: "Profile",
          description: "Manage your profile information",
          icon: User,
          action: "navigate",
        },
        {
          id: "calendar",
          label: "Google Calendar Sync",
          description: "Connect with Google Calendar",
          icon: Calendar,
          action: "navigate",
        },
        {
          id: "backup",
          label: "Backup & Export",
          description: "Backup your homework data",
          icon: Download,
          action: "navigate",
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          id: "notifications",
          label: "Push Notifications",
          description: "Deadline reminders and alerts",
          icon: Bell,
          action: "navigate",
        },
      ],
    },
    {
      title: "Support & Legal",
      items: [
        {
          id: "help",
          label: "Help & FAQ",
          description: "Get help and view frequently asked questions",
          icon: HelpCircle,
          action: "navigate",
        },
        {
          id: "privacy",
          label: "Privacy Policy",
          description: "View our privacy policy",
          icon: Shield,
          action: "navigate",
        },
        {
          id: "about",
          label: "About",
          description: "App version and information",
          icon: Info,
          action: "navigate",
        },
      ],
    },
  ];

  const handleSettingPress = React.useCallback((item: any) => {
    if (item.action === "navigate") {
      console.log(`Navigate to ${item.id}`);
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-border bg-background">
        <Pressable
          onPress={onBack}
          className="p-2 rounded-lg hover:bg-muted mr-3 active:opacity-70"
        >
          <ArrowLeft
            size={24}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </Pressable>
        <Text className="text-xl font-semibold">Settings</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {settingsSections.map((section, sectionIndex) => (
            <View
              key={section.title}
              className={sectionIndex > 0 ? "mt-6" : ""}
            >
              <Text className="text-sm font-semibold mb-3 px-1 text-muted-foreground uppercase tracking-wider">
                {section.title}
              </Text>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {section.items.map((item, index) => {
                    const IconComponent = item.icon;

                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => handleSettingPress(item)}
                        className={`active:bg-muted/50 ${
                          index < section.items.length - 1
                            ? "border-b border-border"
                            : ""
                        }`}
                      >
                        <View className="flex-row items-center p-4">
                          <View className="w-10 h-10 rounded-full bg-muted/50 items-center justify-center mr-3">
                            <IconComponent
                              size={20}
                              color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                            />
                          </View>

                          <View className="flex-1 mr-3">
                            <Text className="font-medium text-base">
                              {item.label}
                            </Text>
                            <Text className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </Text>
                          </View>

                          {item.action === "toggle" && item.id === "theme" ? (
                            <ThemeToggle />
                          ) : (
                            <ChevronRight
                              size={20}
                              color={isDarkColorScheme ? "#6B7280" : "#9CA3AF"}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </CardContent>
              </Card>
            </View>
          ))}

          {/* App Version Card */}
          <Card className="mt-8 bg-muted/30">
            <CardContent className="p-6 text-center">
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                  <Info
                    size={32}
                    color={isDarkColorScheme ? "#3B82F6" : "#1E40AF"}
                  />
                </View>

                <Text className="text-lg font-semibold mb-1">
                  TugasCollector
                </Text>
                <Text className="text-sm text-muted-foreground mb-2">
                  Version 1.0.0
                </Text>

                <View className="w-full h-px bg-border my-4" />

                <Text className="text-xs text-muted-foreground text-center leading-5">
                  Built with ❤️ using React Native & Expo{"\n"}A modern homework
                  management app
                </Text>

                <View className="mt-4 flex-row flex-wrap justify-center gap-2">
                  <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    <Text className="text-xs text-blue-700 dark:text-blue-300">
                      React Native
                    </Text>
                  </View>
                  <View className="bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                    <Text className="text-xs text-purple-700 dark:text-purple-300">
                      Expo
                    </Text>
                  </View>
                  <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <Text className="text-xs text-green-700 dark:text-green-300">
                      NativeWind
                    </Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
