import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Alert, Modal, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorageManager } from "@/lib/storage";
import {
  HomeworkData,
  SubjectData,
  AttachmentData,
} from "@tugascollecter/types";
import { AttachmentManager } from "@/components/attachment-manager";
import { X, Calendar, AlertCircle, BookOpen } from "lucide-react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from "@/lib/language";

interface HomeworkFormProps {
  visible: boolean;
  onClose: () => void;
  onSave: (homework: HomeworkData) => void;
  editingHomework?: HomeworkData | null;
}

export function HomeworkForm({
  visible,
  onClose,
  onSave,
  editingHomework,
}: HomeworkFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<HomeworkData["priority"]>("medium");
  const [subjectId, setSubjectId] = useState("");
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectData = await StorageManager.getSubjects();
        setSubjects(subjectData);
      } catch (error) {
        console.error("Error loading subjects:", error);
      }
    };

    if (visible) {
      loadSubjects();

      if (editingHomework) {
        setTitle(editingHomework.title);
        setDescription(editingHomework.description || "");
        setDueDate(editingHomework.dueDate || "");
        setPriority(editingHomework.priority);
        setSubjectId(editingHomework.subjectId);
        setAttachments(editingHomework.attachments || []);
      } else {
        // Reset form for new homework
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("medium");
        setSubjectId("");
        setAttachments([]);
      }
    }
  }, [visible, editingHomework]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the homework");
      return;
    }

    if (!subjectId && subjects.length === 0) {
      Alert.alert("Error", "Please create a subject first");
      return;
    }

    setLoading(true);

    try {
      const homeworkData: HomeworkData = {
        id: editingHomework?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim() || undefined,
        details: [],
        dueDate: dueDate || undefined,
        priority,
        status: editingHomework?.status || "pending",
        subjectId: subjectId || subjects[0]?.id || "default",
        attachments: attachments,
        tags: [],
        createdAt: editingHomework?.createdAt || new Date().toISOString(),
        completedAt: editingHomework?.completedAt,
      };

      if (editingHomework) {
        await StorageManager.updateHomework(homeworkData.id, homeworkData);
      } else {
        await StorageManager.addHomework(homeworkData);
      }

      onSave(homeworkData);
      onClose();
    } catch (error) {
      console.error("Error saving homework:", error);
      Alert.alert("Error", "Failed to save homework");
    } finally {
      setLoading(false);
    }
  }, [
    title,
    subjectId,
    subjects.length,
    description,
    dueDate,
    priority,
    attachments,
    editingHomework,
    onSave,
    onClose,
  ]);

  const formatDateForInput = useCallback((dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }, []);

  const showDatePicker = useCallback(() => {
    setDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const handleDateConfirm = useCallback(
    (date: Date) => {
      setDueDate(date.toISOString());
      hideDatePicker();
    },
    [hideDatePicker],
  );

  const handleDateChange = useCallback((value: string) => {
    setDueDate(value ? new Date(value).toISOString() : "");
  }, []);

  const getPriorityColor = useCallback((priority: HomeworkData["priority"]) => {
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
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <View className="mx-6 flex-1">
          <View className="flex flex-row items-center justify-between py-4">
            <Text className="text-xl font-bold">
              {editingHomework ? t("editHomework") : t("newHomework")}
            </Text>
            <Button variant="ghost" size="icon" onPress={onClose}>
              <X size={20} />
            </Button>
          </View>

          <View className="flex flex-1 flex-col gap-4">
            <View>
              <Text className="mb-2 text-sm font-medium">
                {t("homeworkTitle")} *
              </Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder={t("enterTitle")}
                className="w-full"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium">
                {t("homeworkDescription")}
              </Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder={t("enterDescription")}
                multiline
                numberOfLines={3}
                className="w-full"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium">{t("subject")}</Text>
              {subjects.length > 0 ? (
                <View className="flex flex-col gap-2">
                  <View className="flex flex-row flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Pressable
                        key={subject.id}
                        onPress={() =>
                          setSubjectId((before) =>
                            before === subject.id ? "" : subject.id,
                          )
                        }
                        className={`flex flex-row items-center gap-2 rounded-lg border px-3 py-2 ${
                          subjectId === subject.id
                            ? "border-primary bg-primary"
                            : "border-border bg-secondary"
                        }`}
                      >
                        <View
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <Text
                          className={`text-sm ${
                            subjectId === subject.id
                              ? "text-primary-foreground"
                              : "text-secondary-foreground"
                          }`}
                        >
                          {subject.name}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : (
                <Card>
                  <CardContent className="items-center py-6">
                    <BookOpen size={32} className="mb-2" />
                    <Text className="text-center text-sm text-muted-foreground">
                      No subjects available. Create a subject first.
                    </Text>
                  </CardContent>
                </Card>
              )}
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium">{t("dueDate")}</Text>
              <Pressable
                onPress={showDatePicker}
                className="flex flex-row items-center gap-2 rounded-lg border border-border bg-background px-3 py-4"
              >
                <Calendar size={20} className="text-muted-foreground" />
                <Text
                  className={`flex-1 ${dueDate ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {dueDate ? formatDateForInput(dueDate) : t("selectDueDate")}
                </Text>
              </Pressable>
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium">{t("priority")}</Text>
              <View className="flex flex-row gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => setPriority(p)}
                    className={`flex flex-1 flex-row items-center gap-2 rounded-lg border px-3 py-2 ${
                      priority === p
                        ? "border-primary bg-primary"
                        : "border-border bg-secondary"
                    }`}
                  >
                    <View
                      className={`${getPriorityColor(p)} h-2 w-2 rounded-full`}
                    />
                    <Text
                      className={`text-center text-sm capitalize ${
                        priority === p
                          ? "text-primary-foreground"
                          : "text-secondary-foreground"
                      }`}
                    >
                      {t(`priorityLevels.${p}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View>
              <AttachmentManager
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                homeworkId={editingHomework?.id}
              />
            </View>
          </View>

          <View className="flex flex-row gap-3 py-6">
            <Button variant="outline" className="flex-1" onPress={onClose}>
              <Text>{t("cancel")}</Text>
            </Button>
            <Button
              className="flex-1"
              onPress={handleSave}
              disabled={loading || !title.trim()}
            >
              <Text>{loading ? "Saving..." : t("save")}</Text>
            </Button>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          date={dueDate ? new Date(dueDate) : new Date()}
        />
      </View>
    </Modal>
  );
}
