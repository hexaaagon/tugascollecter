import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AttachmentViewer } from "@/components/attachment-viewer";
import {
  HomeworkData,
  SubjectData,
  AttachmentData,
} from "@/shared/types/storage";
import { StorageManager } from "@/lib/storage";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import {
  X,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Edit,
  ExternalLink,
  Eye,
  Share,
  Trash2,
  Rewind,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { useLanguage } from "@/lib/language";
import { getCurrentLanguage } from "@tugascollecter/language-pack";

interface HomeworkDetailDialogProps {
  visible: boolean;
  homework: HomeworkData | null;
  subjects: SubjectData[];
  onClose: () => void;
  onEdit?: (homework: HomeworkData) => void;
  onStatusUpdate?: (id: string, status: HomeworkData["status"]) => void;
  onDelete?: (id: string) => void;
}

export function HomeworkDetailDialog({
  visible,
  homework,
  subjects,
  onClose,
  onEdit,
  onStatusUpdate,
  onDelete,
}: HomeworkDetailDialogProps) {
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentData | null>(null);
  const [attachmentPreviewVisible, setAttachmentPreviewVisible] =
    useState(false);
  const [currentHomework, setCurrentHomework] = useState<HomeworkData | null>(
    homework,
  );

  const { isDarkColorScheme } = useColorScheme();
  const { t } = useLanguage();

  // Update local homework state when prop changes
  useEffect(() => {
    setCurrentHomework(homework);
  }, [homework]);

  // Handle status updates with local state update
  const handleStatusUpdate = useCallback(
    async (id: string, status: HomeworkData["status"]) => {
      if (onStatusUpdate && currentHomework) {
        try {
          await onStatusUpdate(id, status);
          // Update local state immediately for better UX
          const updatedHomework = {
            ...currentHomework,
            status,
            completedAt:
              status === "completed" ? new Date().toISOString() : undefined,
          };
          setCurrentHomework(updatedHomework);
        } catch (error) {
          console.error("Error updating homework status:", error);
        }
      }
    },
    [onStatusUpdate, currentHomework],
  );

  if (!currentHomework) return null;

  const subject = subjects.find((s) => s.id === currentHomework.subjectId);
  const daysUntilDue = currentHomework.dueDate
    ? (() => {
        // Normalize dates to compare only the date part (ignoring time)
        const dueDate = new Date(currentHomework.dueDate);
        const today = new Date();

        // Set both dates to start of day for accurate comparison
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
      })()
    : null;

  const getPriorityColor = (priority: HomeworkData["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: HomeworkData["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={20} color="#22c55e" />;
      case "in-progress":
        return <PlayCircle size={20} color="#3b82f6" />;
      case "overdue":
        return <AlertCircle size={20} color="#ef4444" />;
      default:
        return <Clock size={20} color="#6b7280" />;
    }
  };

  const deleteHomework = async (id: string) => {
    Alert.alert(t("alerts.deleteTask.title"), t("alerts.deleteTask.message"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("alerts.deleteTask.confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await StorageManager.deleteHomework(id);
            onDelete?.(id); // Notify parent component about deletion
            onClose();
          } catch (error) {
            console.error("Error deleting homework:", error);
            Alert.alert(t("error"), "Failed to delete task");
          }
        },
      },
    ]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-background">
          <View className="mx-6 flex-1">
            {/* Header */}
            <View className="flex flex-row items-center justify-between border-b border-border py-4">
              <Text className="text-xl font-bold">{t("taskDetails")}</Text>
              <View className="flex flex-row gap-2">
                {currentHomework && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onPress={() => deleteHomework(currentHomework.id)}
                  >
                    <Trash2 size={18} color="white" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={() => {
                      onEdit(currentHomework);
                      onClose();
                    }}
                  >
                    <Edit size={18} color="#6b7280" />
                  </Button>
                )}
                <Button variant="outline" size="icon" onPress={onClose}>
                  <X size={20} color="#6b7280" />
                </Button>
              </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="py-6">
                {/* Title and Status */}
                <View>
                  <View className="mb-3 flex flex-row items-center gap-3">
                    <View
                      className={`h-4 w-4 rounded-full ${getPriorityColor(currentHomework.priority)}`}
                    />
                    <Text className="flex-1 text-2xl font-bold">
                      {currentHomework.title}
                    </Text>
                    <View className="flex flex-row items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`self-start capitalize ${
                          currentHomework.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : currentHomework.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : currentHomework.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {currentHomework.status.replace("-", " ")}
                      </Badge>
                      {getStatusIcon(currentHomework.status)}
                    </View>
                  </View>
                </View>

                {/* Description */}
                {currentHomework.description && (
                  <Card>
                    <CardContent className="p-4">
                      <Text className="mb-2 font-semibold">
                        {t("description")}
                      </Text>
                      <Text className="leading-6 text-muted-foreground">
                        {currentHomework.description}
                      </Text>
                    </CardContent>
                  </Card>
                )}

                {/* Details */}
                <Card className="mt-4">
                  <CardContent className="flex flex-col gap-3 p-4">
                    {/* Subject */}
                    {subject && (
                      <View className="flex flex-row items-center gap-3">
                        <BookOpen size={16} color="#6b7280" />
                        <View className="flex flex-row items-center gap-2">
                          <View
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <Text className="font-medium">{subject.name}</Text>
                        </View>
                      </View>
                    )}

                    {/* Due Date */}
                    {currentHomework.dueDate && (
                      <View className="flex flex-row items-center gap-3">
                        <Calendar size={16} color="#6b7280" />
                        <View className="flex flex-col leading-3">
                          <Text
                            className={`font-medium ${
                              daysUntilDue !== null && daysUntilDue <= 1
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {daysUntilDue === 0
                              ? t("dueToday")
                              : daysUntilDue === 1
                                ? t("dueTomorrow")
                                : daysUntilDue && daysUntilDue > 0
                                  ? t("daysLeft", { days: daysUntilDue })
                                  : t("statusLevels.overdue")}
                          </Text>
                          <Text className="text-xs text-muted-foreground">
                            {getCurrentLanguage() === "en" &&
                              new Date(
                                currentHomework.dueDate,
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            {getCurrentLanguage() === "id" &&
                              new Date(
                                currentHomework.dueDate,
                              ).toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Priority */}
                    <View className="flex flex-row items-center gap-3">
                      <AlertCircle size={16} color="#6b7280" />
                      <Text className="font-medium capitalize">
                        {t("priorityWithLevel", {
                          level: t(
                            `priorityLevels.${currentHomework.priority}`,
                          ),
                        })}
                      </Text>
                    </View>
                  </CardContent>
                </Card>

                {/* Tags */}
                {currentHomework.tags && currentHomework.tags.length > 0 && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <Text className="mb-3 font-semibold">{t("tags")}</Text>
                      <View className="flex flex-row flex-wrap gap-2">
                        {currentHomework.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </View>
                    </CardContent>
                  </Card>
                )}

                {/* Attachments */}
                {currentHomework.attachments &&
                  currentHomework.attachments.length > 0 && (
                    <Card className="mt-4">
                      <CardContent className="p-4 pt-0">
                        <AttachmentViewer
                          attachments={currentHomework.attachments}
                        />
                      </CardContent>
                    </Card>
                  )}

                {/* Actions */}
                {onStatusUpdate && (
                  <Card className="mt-4">
                    <CardContent className="p-4">
                      <Text className="mb-3 font-semibold">
                        {t("quickActions")}
                      </Text>
                      <View className="flex flex-row flex-wrap gap-2">
                        {currentHomework.status !== "completed" && (
                          <>
                            {currentHomework.status === "pending" && (
                              <Button
                                className="flex flex-row items-center gap-2"
                                variant="outline"
                                onPress={() =>
                                  handleStatusUpdate(
                                    currentHomework.id,
                                    "in-progress",
                                  )
                                }
                              >
                                <PlayCircle size={16} color="#2563eb" />
                                <Text>{t("startTask")}</Text>
                              </Button>
                            )}
                            <Button
                              className="flex flex-row items-center gap-2"
                              onPress={() =>
                                handleStatusUpdate(
                                  currentHomework.id,
                                  "completed",
                                )
                              }
                            >
                              <CheckCircle2 size={16} color="#22c55e" />
                              <Text>{t("markCompleted")}</Text>
                            </Button>
                          </>
                        )}
                        {currentHomework.status === "completed" && (
                          <Button
                            className="flex flex-row items-center gap-2"
                            variant="outline"
                            onPress={() =>
                              handleStatusUpdate(currentHomework.id, "pending")
                            }
                          >
                            <Rewind size={16} color="#6b7280" />
                            <Text>{t("markPending")}</Text>
                          </Button>
                        )}
                      </View>
                    </CardContent>
                  </Card>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={attachmentPreviewVisible}
        animationType="fade"
        onRequestClose={() => setAttachmentPreviewVisible(false)}
      >
        <View className="flex-1 bg-black">
          <View className="relative flex-1">
            <View className="absolute right-4 top-12 z-10">
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setAttachmentPreviewVisible(false)}
                className="bg-black/50"
              >
                <X size={20} color="white" />
              </Button>
            </View>

            {selectedAttachment && (
              <View className="flex-1 items-center justify-center">
                <Image
                  source={{ uri: selectedAttachment.uri }}
                  style={{ width: "90%", height: "80%" }}
                  contentFit="contain"
                  transition={200}
                />

                <View className="absolute bottom-12 left-4 right-4">
                  <Card className="bg-black/70">
                    <CardContent className="p-4">
                      <Text
                        className="font-medium text-white"
                        numberOfLines={1}
                      >
                        {selectedAttachment.name}
                      </Text>
                      <Text className="text-sm text-white/70">
                        {formatFileSize(selectedAttachment.size)}
                      </Text>
                    </CardContent>
                  </Card>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
