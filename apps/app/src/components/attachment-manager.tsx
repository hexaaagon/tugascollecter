import React, { useState } from "react";
import { View, Alert, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AttachmentData } from "@/shared/types/storage";
import { StorageManager } from "@/lib/storage";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import {
  Paperclip,
  Image as ImageIcon,
  Camera,
  FileText,
  X,
  Eye,
  ExternalLink,
} from "lucide-react-native";

interface AttachmentManagerProps {
  attachments: AttachmentData[];
  onAttachmentsChange: (attachments: AttachmentData[]) => void;
  homeworkId?: string;
}

export function AttachmentManager({
  attachments,
  onAttachmentsChange,
  homeworkId,
}: AttachmentManagerProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const addAttachment = async (attachment: AttachmentData) => {
    if (!homeworkId) {
      // For new homework, just add to temporary list
      onAttachmentsChange([...attachments, attachment]);
      return;
    }

    try {
      setLoading(attachment.id);
      // Save attachment to permanent storage
      const savedAttachment = await StorageManager.saveAttachment(
        attachment.uri,
        homeworkId,
        attachment.name,
      );
      onAttachmentsChange([...attachments, savedAttachment]);
    } catch (error) {
      console.error("Error saving attachment:", error);
      Alert.alert("Error", "Failed to save attachment");
    } finally {
      setLoading(null);
    }
  };

  const removeAttachment = async (attachmentId: string) => {
    Alert.alert(
      "Remove Attachment",
      "Are you sure you want to remove this attachment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              if (homeworkId && !attachmentId.startsWith("temp_")) {
                await StorageManager.deleteAttachment(attachmentId);
              }
              onAttachmentsChange(
                attachments.filter((a) => a.id !== attachmentId),
              );
            } catch (error) {
              console.error("Error removing attachment:", error);
              Alert.alert("Error", "Failed to remove attachment");
            }
          },
        },
      ],
    );
  };

  const pickImage = async () => {
    try {
      const attachment = await StorageManager.pickImage();
      if (attachment) {
        await addAttachment(attachment);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const attachment = await StorageManager.takePhoto();
      if (attachment) {
        await addAttachment(attachment);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const pickDocument = async () => {
    try {
      const attachment = await StorageManager.pickDocument();
      if (attachment) {
        await addAttachment(attachment);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const getAttachmentIcon = (type: AttachmentData["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon size={16} color="#6b7280" />;
      case "document":
        return <FileText size={16} color="#6b7280" />;
      default:
        return <Paperclip size={16} color="#6b7280" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const openAttachment = async (attachment: AttachmentData) => {
    try {
      // Show different options based on file type
      const options = [
        {
          text: "Open with App",
          onPress: () => openWithExternalApp(attachment),
        },
        {
          text: "Share",
          onPress: () => shareAttachment(attachment),
        },
        {
          text: "Cancel",
          style: "cancel" as const,
        },
      ];

      if (attachment.type === "image") {
        Alert.alert(
          "Image Options",
          `What would you like to do with ${attachment.name}?`,
          options,
        );
      } else {
        Alert.alert(
          "Open Document",
          `How would you like to open ${attachment.name}?`,
          [
            {
              text: "Open",
              onPress: () => openWithExternalApp(attachment),
            },
            {
              text: "Share",
              onPress: () => shareAttachment(attachment),
            },
            { text: "Cancel", style: "cancel" },
          ],
        );
      }
    } catch (error) {
      console.error("Error opening attachment:", error);
      Alert.alert("Error", "Failed to open attachment");
    }
  };

  const openWithExternalApp = async (attachment: AttachmentData) => {
    try {
      const canShare = await Sharing.isAvailableAsync();

      if (!canShare) {
        Alert.alert(
          "Not Available",
          "File sharing is not available on this device",
        );
        return;
      }

      // Show loading state
      setLoading(attachment.id);

      // Try to open with external app using StorageManager
      if (homeworkId && !attachment.id.startsWith("temp_")) {
        try {
          await StorageManager.openWithExternalApp(attachment.id);
        } catch (error) {
          // If StorageManager method fails, try direct sharing
          console.log(
            "StorageManager open failed, trying direct share:",
            error,
          );
          await shareAttachment(attachment);
        }
      } else {
        // For temporary attachments, share directly
        await shareAttachment(attachment);
      }
    } catch (error) {
      console.error("Error opening with external app:", error);
      Alert.alert(
        "Cannot Open File",
        `Unable to open ${attachment.name}. This might happen if:\n\n• No app is installed that can handle this file type\n• The file is corrupted\n• The file format is not supported\n\nTry sharing the file to access it with other apps.`,
        [
          {
            text: "Share Instead",
            onPress: () => shareAttachment(attachment),
          },
          { text: "OK", style: "cancel" },
        ],
      );
    } finally {
      setLoading(null);
    }
  };

  const shareAttachment = async (attachment: AttachmentData) => {
    try {
      setLoading(attachment.id);

      if (attachment.uri) {
        await Sharing.shareAsync(attachment.uri, {
          mimeType: attachment.mimeType,
          dialogTitle: `Share ${attachment.name}`,
        });
      } else if (homeworkId && !attachment.id.startsWith("temp_")) {
        // Use StorageManager for saved attachments
        await StorageManager.shareAttachment(attachment.id);
      } else {
        throw new Error("No valid URI available for sharing");
      }
    } catch (error) {
      console.error("Error sharing attachment:", error);
      Alert.alert(
        "Cannot Share File",
        `Unable to share ${attachment.name}. The file might be corrupted or missing.`,
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <View>
      <View className="mb-3 flex flex-row items-center justify-between">
        <Text className="text-sm font-medium">Attachments</Text>
        <Text className="text-xs">
          {attachments.length} file{attachments.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Attachment buttons */}
      <View className="mb-3 flex flex-row gap-2">
        <Button variant="outline" size="sm" onPress={pickImage}>
          <View className="flex flex-row items-center gap-2">
            <ImageIcon size={14} color="#6b7280" />
            <Text className="text-xs">Image</Text>
          </View>
        </Button>
        <Button variant="outline" size="sm" onPress={takePhoto}>
          <View className="flex flex-row items-center gap-2">
            <Camera size={14} color="#6b7280" />
            <Text className="text-xs">Camera</Text>
          </View>
        </Button>
        <Button variant="outline" size="sm" onPress={pickDocument}>
          <View className="flex flex-row items-center gap-2">
            <FileText size={14} color="#6b7280" />
            <Text className="text-xs">Document</Text>
          </View>
        </Button>
      </View>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-2"
        >
          <View className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <Card key={attachment.id} className="w-48">
                <CardContent className="p-3">
                  <View className="flex flex-row items-start justify-between">
                    <View className="flex-1 pr-2">
                      <View className="mb-1 flex flex-row items-center gap-2">
                        {getAttachmentIcon(attachment.type)}
                        <Text
                          className="flex-1 text-xs font-medium"
                          numberOfLines={1}
                        >
                          {attachment.name}
                        </Text>
                      </View>
                      <Text className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                      </Text>
                      <Text className="text-xs capitalize text-muted-foreground">
                        {attachment.type}
                      </Text>
                    </View>
                    <View className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onPress={() => openAttachment(attachment)}
                        className="h-6 w-6"
                        disabled={loading === attachment.id}
                      >
                        {attachment.type === "image" ? (
                          <Eye size={12} color="#6b7280" />
                        ) : (
                          <ExternalLink size={12} color="#6b7280" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onPress={() => removeAttachment(attachment.id)}
                        className="h-6 w-6"
                        disabled={loading === attachment.id}
                      >
                        <X size={12} color="#ef4444" />
                      </Button>
                    </View>
                  </View>
                  {loading === attachment.id && (
                    <View className="mt-2">
                      <Text className="text-xs text-muted-foreground">
                        Saving...
                      </Text>
                    </View>
                  )}
                </CardContent>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}

      {attachments.length === 0 && (
        <Card>
          <CardContent className="items-center py-6">
            <Paperclip size={32} color="#6b7280" className="mb-2" />
            <Text className="text-center text-sm text-muted-foreground">
              No attachments added yet
            </Text>
            <Text className="text-center text-xs text-muted-foreground">
              Add images, documents, or other files to your homework
            </Text>
          </CardContent>
        </Card>
      )}
    </View>
  );
}
