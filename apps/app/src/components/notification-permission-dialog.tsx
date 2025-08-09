import React, { useEffect, useState } from "react";
import {
  View,
  Linking,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "./ui/text";
import { useTranslation } from "@/lib/language";
import { NotificationService } from "@/lib/notifications";
import { STORAGE_KEYS } from "@/shared/types/storage";
import { StorageManager } from "@/lib/storage";
import { toast } from "sonner-native";
import { useColorScheme } from "@/lib/useColorScheme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const NOTIFICATION_PERMISSION_ASKED_KEY = `${STORAGE_KEYS.FIRST_LAUNCH}_notification_permission_asked`;

interface NotificationPermissionDialogProps {
  isVisible: boolean;
  onRequestClose?: () => void;
}

export function NotificationPermissionDialog({
  isVisible,
  onRequestClose,
}: NotificationPermissionDialogProps) {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnim]);

  const handleAllowNotifications = async () => {
    console.log("🔔 handleAllowNotifications called");
    try {
      const notificationService = NotificationService.getInstance();
      const granted = await notificationService.requestPermissions();

      // Mark permission as asked
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, "true");

      if (granted) {
        // Update user preferences to enable notifications
        const currentPreferences = await StorageManager.getPreferences();
        const newPreferences = { ...currentPreferences, notifications: true };
        await StorageManager.setPreferences(newPreferences);

        // Schedule notifications for existing homework
        await notificationService.rescheduleAllHomeworkNotifications();

        toast.success("Notifications enabled", {
          description: "You'll receive reminders for homework due dates",
        });
      } else {
        // Permission denied - show settings dialog
        Alert.alert(
          "Permission Required",
          "To receive homework reminders, please enable notifications in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: async () => {
                try {
                  await Linking.openSettings();
                } catch (error) {
                  toast.info("Please enable notifications in device settings");
                }
              },
            },
          ],
        );
      }

      console.log("🔔 Dialog closing");
      onRequestClose?.();
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      onRequestClose?.();
    }
  };

  const handleMaybeLater = async () => {
    console.log("🔔 handleMaybeLater called");
    try {
      // Mark permission as asked but not granted
      await AsyncStorage.setItem(NOTIFICATION_PERMISSION_ASKED_KEY, "true");
      onRequestClose?.();
    } catch (error) {
      console.error("Error saving permission state:", error);
      onRequestClose?.();
    }
  };

  if (!isVisible) return null;

  return (
    <View
      style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}
      pointerEvents="auto"
    >
      {/* Dialog Content */}
      <Animated.View
        style={[
          styles.dialogContainer,
          {
            opacity: fadeAnim,
            backgroundColor: isDarkColorScheme ? "#1f2937" : "#ffffff",
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isDarkColorScheme ? "#ffffff" : "#111827" },
          ]}
        >
          {t("notificationPermission.title")}
        </Text>

        <Text
          style={[
            styles.description,
            { color: isDarkColorScheme ? "#d1d5db" : "#6b7280" },
          ]}
        >
          {t("notificationPermission.description")}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAllowNotifications}
            style={styles.allowButton}
            activeOpacity={0.8}
          >
            <Text style={styles.allowButtonText}>
              {t("notificationPermission.allowButton")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMaybeLater}
            style={styles.laterButton}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.laterButtonText,
                { color: isDarkColorScheme ? "#9ca3af" : "#6b7280" },
              ]}
            >
              {t("notificationPermission.laterButton")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onRequestClose}
        />
      </Animated.View>
    </View>
  );
}

// Hook to manage the notification permission dialog
export function useNotificationPermissionDialog() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Re-enable the auto-show functionality
    const checkShouldShowDialog = async () => {
      try {
        // Check if this is first launch
        const isFirstLaunch = await AsyncStorage.getItem(
          STORAGE_KEYS.FIRST_LAUNCH,
        );
        const hasAskedPermission = await AsyncStorage.getItem(
          NOTIFICATION_PERMISSION_ASKED_KEY,
        );

        // Show dialog if it's first launch and we haven't asked for permission yet
        if (isFirstLaunch === null && hasAskedPermission === null) {
          // Mark as no longer first launch
          await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, "false");
          setShowDialog(true);
        }
      } catch (error) {
        console.error(
          "Error checking notification permission dialog state:",
          error,
        );
      }
    };

    checkShouldShowDialog();
  }, []);

  const hideDialog = () => setShowDialog(false);
  const showDialogManually = () => setShowDialog(true);

  return { showDialog, hideDialog, showDialogManually };
}

// Styles similar to the drawer component
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  dialogContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -SCREEN_WIDTH * 0.4 }, { translateY: -120 }],
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
  },
  allowButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  laterButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  laterButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
