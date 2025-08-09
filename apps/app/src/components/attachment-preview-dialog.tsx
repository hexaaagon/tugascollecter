import React from "react";
import {
  View,
  Pressable,
  Image as RNImage,
  Dimensions,
  Alert,
  Modal,
} from "react-native";
import { Text } from "@/components/ui/text";
import { AttachmentData } from "@tugascollecter/types";
import { X, ExternalLink, Share } from "lucide-react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "./ui/button";

interface AttachmentPreviewDialogProps {
  attachment: AttachmentData | null;
  visible: boolean;
  onClose: () => void;
}

function AttachmentPreviewDialog({
  attachment,
  visible,
  onClose,
}: AttachmentPreviewDialogProps) {
  const { isDarkColorScheme } = useColorScheme();
  const screenData = Dimensions.get("screen");

  if (!attachment) return null;

  const isImage = attachment.mimeType?.startsWith("image/") || false;

  const openInApp = async () => {
    try {
      if (!attachment.uri) return;

      const contentUri = await FileSystem.getContentUriAsync(attachment.uri);
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: contentUri,
        type: attachment.mimeType || "*/*",
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
      });
    } catch (error) {
      console.error("Error opening file:", error);
      try {
        if (attachment.uri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(attachment.uri, {
            mimeType: attachment.mimeType,
          });
        } else {
          Alert.alert("Cannot open", "Unable to open this file.");
        }
      } catch (shareError) {
        Alert.alert("Error", "Unable to open file.");
      }
    }
  };

  const shareFile = async () => {
    try {
      if (!attachment.uri) return;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(attachment.uri, {
          mimeType: attachment.mimeType,
          dialogTitle: `Share ${attachment.name || "file"}`,
        });
      } else {
        Alert.alert(
          "Sharing not available",
          "Sharing is not supported on this device.",
        );
      }
    } catch (error) {
      console.error("Error sharing file:", error);
      Alert.alert("Error", "Unable to share this file.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/80"
        onPress={onClose}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center p-4">
          <Pressable
            className={`rounded-lg ${
              isDarkColorScheme ? "bg-gray-800" : "bg-white"
            }`}
            style={{
              minHeight: screenData.height * 0.6,
              maxHeight: screenData.height * 0.9,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View
              className={`flex-row items-center justify-between border-b p-4 ${
                isDarkColorScheme ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <Text
                className={`flex-1 text-lg font-semibold ${
                  isDarkColorScheme ? "text-white" : "text-gray-900"
                }`}
                numberOfLines={1}
              >
                {attachment.name || "Attachment"}
              </Text>
              <Pressable onPress={onClose} className="ml-4 p-2">
                <X
                  size={20}
                  color={isDarkColorScheme ? "#ffffff" : "#000000"}
                />
              </Pressable>
            </View>

            {/* Content */}
            <View className="flex-1 p-4">
              {isImage && attachment.uri ? (
                <View className="flex-1 items-center justify-center">
                  <RNImage
                    source={{ uri: attachment.uri }}
                    style={{
                      width: "100%",
                      height: 300,
                      borderRadius: 8,
                    }}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <View className="flex-1 items-center justify-center py-8">
                  <View
                    className="items-center justify-center rounded-lg p-8"
                    style={{ backgroundColor: "#64748b" }}
                  >
                    <ExternalLink size={48} color="#ffffff" />
                  </View>
                  <Text
                    className={`mt-4 text-center text-base ${
                      isDarkColorScheme ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {attachment.mimeType || "Unknown file type"}
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View
              className={`border-t p-4 ${
                isDarkColorScheme ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <View className="flex-row gap-3">
                <Button
                  onPress={openInApp}
                  className="flex-1 flex-row"
                  variant="outline"
                >
                  <ExternalLink size={16} color="#ffffff" />
                  <Text className="ml-2 font-medium text-white">Open</Text>
                </Button>
                <Button
                  onPress={shareFile}
                  className="flex-1 flex-row"
                  variant="outline"
                >
                  <Share
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#000000"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      isDarkColorScheme ? "text-white" : "text-black"
                    }`}
                  >
                    Share
                  </Text>
                </Button>
              </View>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

// Add displayName for debugging
AttachmentPreviewDialog.displayName = "AttachmentPreviewDialog";

export { AttachmentPreviewDialog };
