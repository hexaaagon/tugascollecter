import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Settings,
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Info,
  ChevronRight,
  Palette,
  Download,
  Upload,
  Smartphone,
  HelpCircle,
  Star,
  MessageSquare,
  ExternalLink,
} from "lucide-react-native";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useColorScheme } from "@/lib/useColorScheme";
import { storage, UserPreferences, DEFAULT_PREFERENCES } from "@/lib/storage";

interface SettingsItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingsSwitchProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  disabled?: boolean;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  description,
  onPress,
  rightElement,
  showChevron = true,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4"
      style={{
        backgroundColor: isDarkColorScheme ? "#1f2937" : "#ffffff",
      }}
    >
      <View className="mr-3">{icon}</View>
      <View className="flex-1">
        <Text className="text-base font-medium text-foreground">{title}</Text>
        {description && (
          <Text className="mt-1 text-sm text-muted-foreground">
            {description}
          </Text>
        )}
      </View>
      {rightElement && <View className="mr-2">{rightElement}</View>}
      {showChevron && !rightElement && (
        <ChevronRight
          size={20}
          color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
        />
      )}
    </TouchableOpacity>
  );
};

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="mb-6">
      <Text className="mb-3 px-4 text-lg font-semibold text-foreground">
        {title}
      </Text>
      <Card
        className="mx-4"
        style={{
          backgroundColor: isDarkColorScheme ? "#1f2937" : "#ffffff",
        }}
      >
        {children}
      </Card>
    </View>
  );
};

const SettingsSwitch: React.FC<SettingsSwitchProps> = ({
  icon,
  title,
  description,
  disabled = false,
  value,

  onValueChange,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <SettingsItem
      icon={icon}
      title={title}
      description={description}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: disabled
              ? "#ffffff"
              : isDarkColorScheme
                ? "#374151"
                : "#d1d5db",
            true: disabled ? "#ffffff" : "#3b82f6",
          }}
          thumbColor={disabled ? "#ffffff" : value ? "#ffffff" : "#f3f4f6"}
          disabled={disabled}
        />
      }
      showChevron={false}
    />
  );
};

export default function SettingsScreen() {
  const {
    isDarkColorScheme,
    userPreference,
    setColorScheme,
    systemColorScheme,
  } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [preferences, setPreferences] =
    React.useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from AsyncStorage on component mount
  React.useEffect(() => {
    const loadPreferences = async () => {
      const storedPreferences = await storage.getPreferences();
      setPreferences(storedPreferences);
    };

    loadPreferences();
  }, []);

  const handlePreferenceChange = (key: keyof UserPreferences) => {
    return (value: boolean) => {
      setPreferences((prev) => {
        const newPreferences = { ...prev, [key]: value };
        storage.setPreferences(newPreferences);
        return newPreferences;
      });
    };
  };

  const handleThemeChange = () => {
    const modes = ["light", "dark", "system"] as const;
    const currentIndex = modes.indexOf(userPreference);
    const nextIndex = (currentIndex + 1) % modes.length;
    setColorScheme(modes[nextIndex]);
  };

  const handleCloudSync = () => {
    toast.info("Cloud Sync feature is under development.");
  };

  const handleExportData = () => {
    toast.success("Export Started", {
      description: "Your data is being prepared for export",
    });
  };

  const handleImportData = () => {
    Alert.alert("Import Data", "Select a backup file to import your data", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Select File",
        onPress: () => {
          toast.info("Feature Coming Soon", {
            description: "Data import will be available in a future update",
          });
        },
      },
    ]);
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "This will reset all your preferences to default values. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await storage.clearAllUserData();
            setPreferences(DEFAULT_PREFERENCES);
            setColorScheme("system");
            toast.success("Settings Reset", {
              description: "All preferences have been reset to default values",
            });
          },
        },
      ],
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate App",
      "Would you like to rate Tugas Collecter on the app store?",
      [
        { text: "Not Now", style: "cancel" },
        {
          text: "Rate App",
          onPress: () => {
            toast("Thank You!", {
              description: "Your feedback helps us improve the app",
            });
          },
        },
      ],
    );
  };

  const iconColor = isDarkColorScheme ? "#ffffff" : "#000000";
  const mutedIconColor = isDarkColorScheme ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: insets.bottom + 20,
      }}
    >
      {/* Account Section */}
      <SettingsSection title="Account">
        <SettingsItem
          icon={<User size={24} color={iconColor} />}
          title="Sign In"
          description="Sign in to sync your data across devices"
          onPress={handleCloudSync}
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<Globe size={24} color={mutedIconColor} />}
          title="Cloud Sync"
          description="Sync your tasks and preferences"
          onPress={handleCloudSync}
        />
      </SettingsSection>

      {/* Preferences Section */}
      <SettingsSection title="Preferences">
        <SettingsSwitch
          icon={<Bell size={24} color={iconColor} />}
          title="Notifications"
          description="Receive task reminders and updates"
          value={preferences.notifications}
          onValueChange={handlePreferenceChange("notifications")}
          disabled
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={
            userPreference === "system" ? (
              <Smartphone size={24} color={iconColor} />
            ) : isDarkColorScheme ? (
              <Moon size={24} color={iconColor} />
            ) : (
              <Sun size={24} color={iconColor} />
            )
          }
          title="Theme"
          description={
            userPreference === "system"
              ? `Follow system (currently ${systemColorScheme || "dark"})`
              : userPreference === "dark"
                ? "Dark theme"
                : "Light theme"
          }
          onPress={handleThemeChange}
          rightElement={
            <Text
              style={{
                color: isDarkColorScheme ? "#9ca3af" : "#6b7280",
                fontSize: 14,
                textTransform: "capitalize",
              }}
            >
              {userPreference}
            </Text>
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsSwitch
          icon={<Download size={24} color={iconColor} />}
          title="Auto Sync"
          description="Automatically sync when connected to WiFi"
          value={preferences.autoSync}
          onValueChange={handlePreferenceChange("autoSync")}
          disabled
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsSwitch
          icon={<Smartphone size={24} color={iconColor} />}
          title="Sound Effects"
          description="Play sounds for interactions"
          value={preferences.soundEffects}
          onValueChange={handlePreferenceChange("soundEffects")}
          disabled
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsSwitch
          icon={<Palette size={24} color={iconColor} />}
          title="Haptic Feedback"
          description="Feel vibrations for touch interactions"
          value={preferences.hapticFeedback}
          onValueChange={handlePreferenceChange("hapticFeedback")}
          disabled
        />
      </SettingsSection>

      {/* Data & Privacy Section */}
      <SettingsSection title="Data & Privacy">
        <SettingsItem
          icon={<Upload size={24} color={iconColor} />}
          title="Export Data"
          description="Download a copy of your data"
          onPress={handleExportData}
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<Download size={24} color={iconColor} />}
          title="Import Data"
          description="Restore from a backup file"
          onPress={handleImportData}
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<Shield size={24} color={iconColor} />}
          title="Privacy Policy"
          description="Learn how we protect your data"
          onPress={() =>
            toast("Privacy Policy", {
              description: "Opening privacy policy...",
            })
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<Settings size={24} color="#ef4444" />}
          title="Reset Settings"
          description="Reset all preferences to default values"
          onPress={handleResetSettings}
        />
      </SettingsSection>

      {/* App Info Section */}
      <SettingsSection title="App Info">
        <SettingsItem
          icon={<Info size={24} color={iconColor} />}
          title="About"
          description="Version 1.0.0"
          onPress={() =>
            Alert.alert(
              "About Tugas Collecter",
              "A simple and efficient task management app to help you stay organized and productive.\n\nVersion: 1.0.0\nBuild: 2025.1",
            )
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<HelpCircle size={24} color={iconColor} />}
          title="Help & Support"
          description="Get help using the app"
          onPress={() =>
            toast("Help Center", {
              description: "Opening help documentation...",
            })
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<Star size={24} color={iconColor} />}
          title="Rate App"
          description="Help us improve by rating the app"
          onPress={handleRateApp}
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<MessageSquare size={24} color={iconColor} />}
          title="Send Feedback"
          description="Share your thoughts and suggestions"
          onPress={() =>
            toast("Feedback", {
              description: "Opening feedback form...",
            })
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
        <SettingsItem
          icon={<ExternalLink size={24} color={iconColor} />}
          title="Terms of Service"
          description="Review our terms and conditions"
          onPress={() =>
            toast("Terms of Service", {
              description: "Opening terms of service...",
            })
          }
        />
      </SettingsSection>
    </ScrollView>
  );
}
