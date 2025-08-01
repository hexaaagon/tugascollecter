import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/toggle-theme";
import {
  User,
  Mail,
  Calendar,
  Download,
  Settings,
  Bell,
  HelpCircle,
  Shield,
  ChevronRight,
  Edit,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";

interface ProfileTabProps {
  onNavigate?: (screen: string) => void;
}

export function ProfileTab({ onNavigate }: ProfileTabProps) {
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Calculate header padding based on safe area
  const headerPaddingTop = Math.max(insets.top, 16);

  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          id: "edit-profile",
          label: "Edit Profile",
          description: "Update your personal information",
          icon: Edit,
          action: () => console.log("Edit profile"),
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          id: "notifications",
          label: "Notifications",
          description: "Configure notification preferences",
          icon: Bell,
          action: () => console.log("Notifications"),
        },
        {
          id: "theme",
          label: "Appearance",
          description: "Switch between light and dark mode",
          icon: Settings,
          isToggle: true,
        },
      ],
    },
    {
      title: "Data & Sync",
      items: [
        {
          id: "calendar-sync",
          label: "Google Calendar Sync",
          description: "Connect with Google Calendar",
          icon: Calendar,
          action: () => console.log("Calendar sync"),
        },
        {
          id: "backup",
          label: "Backup & Export",
          description: "Backup your homework data",
          icon: Download,
          action: () => console.log("Backup"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          id: "help",
          label: "Help & Support",
          description: "Get help and support",
          icon: HelpCircle,
          action: () => console.log("Help"),
        },
        {
          id: "privacy",
          label: "Privacy Policy",
          description: "View our privacy policy",
          icon: Shield,
          action: () => console.log("Privacy"),
        },
      ],
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header - with dynamic padding for all device types */}
      <View className="px-6 py-4" style={{ paddingTop: headerPaddingTop }}>
        <Text className="text-2xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="px-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <View className="items-center">
                <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                  <User
                    size={32}
                    color={isDarkColorScheme ? "#3B82F6" : "#1E40AF"}
                  />
                </View>
                <Text className="text-xl font-bold">Bagas Dwi Ferdian</Text>
                <Text className="text-muted-foreground mt-1">
                  scooooll27657@gmail.com
                </Text>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Personal Information */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold mb-4">
            Personal Information
          </Text>
          <Card>
            <CardContent className="p-0">
              <View className="flex-row items-center p-4 border-b border-border">
                <User
                  size={20}
                  color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">
                    First Name
                  </Text>
                  <Text className="font-medium">Bagas</Text>
                </View>
              </View>

              <View className="flex-row items-center p-4 border-b border-border">
                <User
                  size={20}
                  color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Last Name
                  </Text>
                  <Text className="font-medium">Dwi Ferdian</Text>
                </View>
              </View>

              <View className="flex-row items-center p-4">
                <Mail
                  size={20}
                  color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-sm text-muted-foreground">Email</Text>
                  <Text className="font-medium">scooooll27657@gmail.com</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group) => (
          <View key={group.title} className="px-6 mb-6">
            <Text className="text-lg font-semibold mb-4">{group.title}</Text>
            <Card>
              <CardContent className="p-0">
                {group.items.map((item, index) => {
                  const IconComponent = item.icon;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={item.action}
                      className={`flex-row items-center p-4 ${
                        index < group.items.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <IconComponent
                        size={20}
                        color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                      />

                      <View className="ml-3 flex-1">
                        <Text className="font-medium">{item.label}</Text>
                        <Text className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </Text>
                      </View>

                      {item.isToggle ? (
                        <ThemeToggle />
                      ) : (
                        <ChevronRight
                          size={16}
                          color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </CardContent>
            </Card>
          </View>
        ))}

        {/* Sign Out */}
        <View className="px-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <Pressable className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg items-center justify-center">
                  <Text className="text-red-600 font-bold">→</Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-red-600">Sign Out</Text>
                  <Text className="text-sm text-muted-foreground">
                    Sign out of your account
                  </Text>
                </View>
                <ChevronRight size={16} color="#EF4444" />
              </Pressable>
            </CardContent>
          </Card>
        </View>

        {/* App Version */}
        <View className="px-6 mb-8">
          <View className="items-center">
            <Text className="text-muted-foreground text-sm">
              TugasCollector v1.0.0
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              Built with ❤️ using React Native & Expo
            </Text>
          </View>
        </View>

        {/* Bottom padding for navigation */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
