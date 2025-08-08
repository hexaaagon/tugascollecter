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
  BookOpen,
  Trash2,
} from "lucide-react-native";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { SettingsSeparator } from "@/components/ui/settings-separator";
import { useColorScheme } from "@/lib/useColorScheme";
import {
  storage,
  UserPreferences,
  DEFAULT_PREFERENCES,
  StorageManager,
} from "@/lib/storage";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { router } from "expo-router";
import { useTranslation, useLanguage } from "@/lib/language";
import type { Language } from "@tugascollecter/language-pack";

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

const SettingsItem: React.FC<SettingsItemProps> = React.memo(
  ({ icon, title, description, onPress, rightElement, showChevron = true }) => {
    const { isDarkColorScheme } = useColorScheme();

    const chevronColor = React.useMemo(
      () => (isDarkColorScheme ? "#9ca3af" : "#6b7280"),
      [isDarkColorScheme],
    );

    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center bg-card px-4 py-4"
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
          <ChevronRight size={20} color={chevronColor} />
        )}
      </TouchableOpacity>
    );
  },
);

const SettingsSection: React.FC<SettingsSectionProps> = React.memo(
  ({ title, children }) => {
    return (
      <View className="mb-6">
        <Text className="mb-3 px-4 text-lg font-semibold text-foreground">
          {title}
        </Text>
        <Card className="mx-4">{children}</Card>
      </View>
    );
  },
);

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
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const [preferences, setPreferences] =
    React.useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [showLanguageDialog, setShowLanguageDialog] = React.useState(false);

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

  const handleLanguageChange = () => {
    setShowLanguageDialog(true);
  };

  const selectLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setShowLanguageDialog(false);
  };

  const getLanguageDisplayText = (lang: Language) => {
    switch (lang) {
      case "en":
        return "🇺🇸 English";
      case "id":
        return "🇮🇩 Bahasa Indonesia";
      default:
        return lang;
    }
  };

  const handleCloudSync = () => {
    toast.info("Cloud Sync feature is under development.");
  };

  const handleClearAllData = () => {
    Alert.alert(
      t("alerts.clearAllData.title"),
      t("alerts.clearAllData.message"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("alerts.clearAllData.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              await StorageManager.saveHomework([]);
              await StorageManager.saveSubjects([]);
              toast.success("All data cleared successfully");
            } catch (error) {
              console.error("Error clearing data:", error);
              toast.error("Failed to clear data");
            }
          },
        },
      ],
    );
  };

  const handleExportData = () => {
    toast.success("Export Started", {
      description: "Your data is being prepared for export",
    });
  };

  const handleImportData = () => {
    Alert.alert(t("alerts.importData.title"), t("alerts.importData.message"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("alerts.importData.selectFile"),
        onPress: () => {
          toast.info(t("toasts.featureComingSoon.title"), {
            description: t("toasts.featureComingSoon.description"),
          });
        },
      },
    ]);
  };

  const handleRateApp = () => {
    Alert.alert(t("alerts.rateApp.title"), t("alerts.rateApp.message"), [
      { text: t("alerts.rateApp.notNow"), style: "cancel" },
      {
        text: t("alerts.rateApp.rate"),
        onPress: () => {
          toast(t("toasts.thankYou.title"), {
            description: t("toasts.thankYou.description"),
          });
        },
      },
    ]);
  };

  const iconColor = React.useMemo(
    () => (isDarkColorScheme ? "#ffffff" : "#000000"),
    [isDarkColorScheme],
  );

  return (
    <ScrollableWrapper className="flex-1">
      <SettingsSection title={t("account")}>
        <SettingsItem
          icon={<User size={24} color={iconColor} />}
          title={t("signIn")}
          description={t("signInDescription")}
          onPress={handleCloudSync}
        />
        <SettingsSeparator />
        <SettingsItem
          icon={<Globe size={24} color={iconColor} />}
          title={t("cloudSync")}
          description={t("cloudSyncDescription")}
          onPress={handleCloudSync}
        />
      </SettingsSection>

      <SettingsSection title={t("homeworkManagement")}>
        <SettingsItem
          icon={<BookOpen size={24} color={iconColor} />}
          title={t("manageSubjects")}
          description={t("manageSubjectsDescription")}
          onPress={() => router.push("/tasks")}
          showChevron
        />
        <SettingsSeparator />
        <SettingsItem
          icon={<Trash2 size={24} color="#ef4444" />}
          title={t("clearAllData")}
          description={t("clearAllDataDescription")}
          onPress={handleClearAllData}
          showChevron
        />
      </SettingsSection>

      {/* Preferences Section */}
      <SettingsSection title={t("preferences")}>
        <SettingsSwitch
          icon={<Bell size={24} color={iconColor} />}
          title={t("notifications")}
          description={t("notificationsDescription")}
          value={preferences.notifications}
          onValueChange={handlePreferenceChange("notifications")}
          disabled
        />
        <SettingsSeparator />
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
          title={t("theme")}
          description={
            userPreference === "system"
              ? `${t("themeOptions.followSystem")} (currently ${systemColorScheme || "dark"})`
              : userPreference === "dark"
                ? t("themeOptions.darkTheme")
                : t("themeOptions.lightTheme")
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
        <SettingsItem
          icon={<Globe size={24} color={iconColor} />}
          title={t("language")}
          description={t("languageDescription")}
          onPress={handleLanguageChange}
          rightElement={
            <Text
              style={{
                color: isDarkColorScheme ? "#9ca3af" : "#6b7280",
                fontSize: 14,
              }}
            >
              {getLanguageDisplayText(language)}
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
          title={t("autoSync")}
          description={t("autoSyncDescription")}
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
          title={t("soundEffects")}
          description={t("soundEffectsDescription")}
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
          title={t("hapticFeedback")}
          description={t("hapticFeedbackDescription")}
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
          title={t("privacyPolicy")}
          description={t("privacyPolicyDescription")}
          onPress={() =>
            toast(t("toasts.privacyPolicy.title"), {
              description: t("toasts.privacyPolicy.description"),
            })
          }
        />
        <View
          className="mx-4 h-px"
          style={{
            backgroundColor: isDarkColorScheme ? "#374151" : "#e5e7eb",
          }}
        />
      </SettingsSection>

      {/* App Info Section */}
      <SettingsSection title={t("appInfo")}>
        <SettingsItem
          icon={<Info size={24} color={iconColor} />}
          title={t("about")}
          description={t("aboutDescription")}
          onPress={() =>
            Alert.alert(
              t("alerts.aboutApp.title"),
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
          title={t("rateApp")}
          description={t("rateAppDescription")}
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
          title={t("sendFeedback")}
          description={t("sendFeedbackDescription")}
          onPress={() =>
            toast(t("toasts.feedback.title"), {
              description: t("toasts.feedback.description"),
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
          title={t("termsOfService")}
          description={t("termsOfServiceDescription")}
          onPress={() =>
            toast(t("toasts.termsOfService.title"), {
              description: t("toasts.termsOfService.description"),
            })
          }
        />
      </SettingsSection>

      {/* Language Selection Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              🌍 {t("language")}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              {t("languageDescription")}
            </DialogDescription>
          </DialogHeader>

          <View className="gap-2 py-4">
            <TouchableOpacity
              onPress={() => selectLanguage("en")}
              className={`flex-row items-center justify-between rounded-lg border-2 p-4 ${
                language === "en"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-transparent"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🇺🇸</Text>
                <Text
                  className={`text-base font-medium ${
                    language === "en" ? "text-primary" : "text-foreground"
                  }`}
                >
                  English
                </Text>
              </View>
              {language === "en" && (
                <Text className="text-lg text-primary">✓</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selectLanguage("id")}
              className={`flex-row items-center justify-between rounded-lg border-2 p-4 ${
                language === "id"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-transparent"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-2xl">🇮🇩</Text>
                <Text
                  className={`text-base font-medium ${
                    language === "id" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Bahasa Indonesia
                </Text>
              </View>
              {language === "id" && (
                <Text className="text-lg text-primary">✓</Text>
              )}
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>
    </ScrollableWrapper>
  );
}
