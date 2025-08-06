import React, { useState, useEffect } from "react";
import { View, Alert, Modal, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorageManager } from "@/lib/storage";
import { SubjectData } from "@/shared/types/storage";
import { X, BookOpen, Palette, Plus, Trash2, Edit3 } from "lucide-react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  Panel5,
} from "reanimated-color-picker";

interface SubjectManagerProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const predefinedColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#0d9488",
];

export function SubjectManager({
  visible,
  onClose,
  onUpdate,
}: SubjectManagerProps) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultColor, setResultColor] = useState(predefinedColors[0]);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSelectedColor, setEditSelectedColor] = useState("");

  const onColorChange = (color: string) => {
    setResultColor(color);
  };

  const onColorPick = (color: any) => {
    if (editingSubject) {
      setEditSelectedColor(color.hex);
    } else {
      setSelectedColor(color.hex);
    }
    setResultColor(color.hex);
  };

  useEffect(() => {
    if (visible) {
      loadSubjects();
    }
  }, [visible]);

  const loadSubjects = async () => {
    try {
      const subjectData = await StorageManager.getSubjects();
      setSubjects(subjectData);
    } catch (error) {
      console.error("Error loading subjects:", error);
    }
  };

  const addSubject = async () => {
    if (!newSubjectName.trim()) {
      Alert.alert("Error", "Please enter a subject name");
      return;
    }

    if (
      subjects.some(
        (s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase(),
      )
    ) {
      Alert.alert("Error", "A subject with this name already exists");
      return;
    }

    setLoading(true);

    try {
      const newSubject: SubjectData = {
        id: Date.now().toString(),
        name: newSubjectName.trim(),
        color: selectedColor,
        day: [], // Will be implemented later
      };

      const updatedSubjects = [...subjects, newSubject];
      await StorageManager.saveSubjects(updatedSubjects);
      setSubjects(updatedSubjects);
      setNewSubjectName("");
      setSelectedColor(predefinedColors[0]);
      onUpdate();
    } catch (error) {
      console.error("Error adding subject:", error);
      Alert.alert("Error", "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedSubjects = subjects.filter(
                (s) => s.id !== subjectId,
              );
              await StorageManager.saveSubjects(updatedSubjects);
              setSubjects(updatedSubjects);
              onUpdate();
            } catch (error) {
              console.error("Error deleting subject:", error);
              Alert.alert("Error", "Failed to delete subject");
            }
          },
        },
      ],
    );
  };

  const startEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject.id);
    setEditSubjectName(subject.name);
    setEditSelectedColor(subject.color);
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setEditSubjectName("");
    setEditSelectedColor("");
  };

  const saveEditSubject = async (subjectId: string) => {
    if (!editSubjectName.trim()) {
      Alert.alert("Error", "Please enter a subject name");
      return;
    }

    if (
      subjects.some(
        (s) =>
          s.id !== subjectId &&
          s.name.toLowerCase() === editSubjectName.trim().toLowerCase(),
      )
    ) {
      Alert.alert("Error", "A subject with this name already exists");
      return;
    }

    setLoading(true);

    try {
      const updatedSubjects = subjects.map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              name: editSubjectName.trim(),
              color: editSelectedColor,
            }
          : subject,
      );
      await StorageManager.saveSubjects(updatedSubjects);
      setSubjects(updatedSubjects);
      setEditingSubject(null);
      setEditSubjectName("");
      setEditSelectedColor("");
      onUpdate();
    } catch (error) {
      console.error("Error updating subject:", error);
      Alert.alert("Error", "Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="mx-6 flex-1">
            <View className="flex flex-row items-center justify-between py-4">
              <Text className="text-xl font-bold">Manage Subjects</Text>
              <Button variant="ghost" size="icon" onPress={onClose}>
                <X size={20} />
              </Button>
            </View>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Subject</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <View>
                  <Text className="mb-2 text-sm font-medium">Subject Name</Text>
                  <Input
                    value={newSubjectName}
                    onChangeText={setNewSubjectName}
                    placeholder="Enter subject name"
                    className="w-full"
                  />
                </View>

                <View>
                  <Text className="mb-2 text-sm font-medium">Color</Text>
                  <View className="mb-3 flex flex-row flex-wrap gap-2">
                    {predefinedColors.map((color) => (
                      <Pressable
                        key={color}
                        onPress={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full border-2 ${
                          selectedColor === color
                            ? "border-foreground"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}

                    <Pressable
                      onPress={() => setShowColorPicker(true)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-muted"
                    >
                      <Palette size={16} color="#6b7280" />
                    </Pressable>
                  </View>

                  <View className="mb-2 flex flex-row items-center gap-2">
                    <View
                      className="h-6 w-6 rounded-full border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <Text className="text-sm text-muted-foreground">
                      Selected: {selectedColor}
                    </Text>
                  </View>
                </View>

                <Button
                  onPress={addSubject}
                  disabled={loading || !newSubjectName.trim()}
                  className="w-full"
                >
                  <View className="flex flex-row items-center gap-2">
                    <Plus size={16} />
                    <Text>{loading ? "Adding..." : "Add Subject"}</Text>
                  </View>
                </Button>
              </CardContent>
            </Card>

            <View className="flex-1">
              <Text className="mb-4 text-lg font-semibold">
                Existing Subjects ({subjects.length})
              </Text>

              {subjects.length > 0 ? (
                <View className="flex flex-col gap-3 space-y-2">
                  {subjects.map((subject) => (
                    <Card key={subject.id}>
                      <CardContent className="p-4">
                        {editingSubject === subject.id ? (
                          <View className="space-y-3">
                            <View>
                              <Text className="mb-2 text-sm font-medium">
                                Subject Name
                              </Text>
                              <Input
                                value={editSubjectName}
                                onChangeText={setEditSubjectName}
                                placeholder="Enter subject name"
                                className="w-full"
                              />
                            </View>

                            <View>
                              <Text className="mb-2 text-sm font-medium">
                                Color
                              </Text>
                              <View className="mb-3 flex flex-row flex-wrap gap-2">
                                {predefinedColors.map((color) => (
                                  <Pressable
                                    key={color}
                                    onPress={() => setEditSelectedColor(color)}
                                    className={`h-6 w-6 rounded-full border-2 ${
                                      editSelectedColor === color
                                        ? "border-foreground"
                                        : "border-border"
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}

                                <Pressable
                                  onPress={() => setShowColorPicker(true)}
                                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground bg-muted"
                                >
                                  <Palette size={12} color="#6b7280" />
                                </Pressable>
                              </View>

                              <View className="mb-2 flex flex-row items-center gap-2">
                                <View
                                  className="h-4 w-4 rounded-full border border-border"
                                  style={{ backgroundColor: editSelectedColor }}
                                />
                                <Text className="text-sm text-muted-foreground">
                                  Selected: {editSelectedColor}
                                </Text>
                              </View>
                            </View>

                            <View className="flex flex-row gap-2">
                              <Button
                                variant="outline"
                                onPress={cancelEdit}
                                className="flex-1"
                              >
                                <Text>Cancel</Text>
                              </Button>
                              <Button
                                onPress={() => saveEditSubject(subject.id)}
                                disabled={loading}
                                className="flex-1"
                              >
                                <Text>{loading ? "Saving..." : "Save"}</Text>
                              </Button>
                            </View>
                          </View>
                        ) : (
                          <View className="flex flex-row items-center justify-between">
                            <View className="flex flex-1 flex-row items-center gap-3">
                              <View
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: subject.color }}
                              />
                              <Text className="flex-1 font-medium">
                                {subject.name}
                              </Text>
                            </View>
                            <View className="flex flex-row gap-2">
                              <Button
                                size="icon"
                                onPress={() => startEditSubject(subject)}
                              >
                                <Edit3 size={16} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onPress={() => deleteSubject(subject.id)}
                              >
                                <Trash2 size={16} color={"white"} />
                              </Button>
                            </View>
                          </View>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </View>
              ) : (
                <Card>
                  <CardContent className="items-center py-12">
                    <BookOpen size={48} className="mb-4" color="gray" />
                    <Text className="mb-2 text-lg font-medium">
                      No Subjects
                    </Text>
                    <Text className="text-center text-sm text-muted-foreground">
                      Add your first subject to start organizing your homework.
                    </Text>
                  </CardContent>
                </Card>
              )}
            </View>

            <View className="py-6">
              <Button variant="outline" onPress={onClose} className="w-full">
                <Text>Done</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>

      <Modal
        visible={showColorPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View className="flex-1 bg-background">
          <View className="mx-6 flex-1">
            {/* Header */}
            <View className="flex flex-row items-center justify-between py-4">
              <Text className="text-xl font-bold">Choose Color</Text>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => setShowColorPicker(false)}
              >
                <X size={20} />
              </Button>
            </View>

            <View className="flex-1 justify-center">
              <ColorPicker
                value={resultColor}
                sliderThickness={25}
                thumbSize={24}
                thumbShape="circle"
                onChangeJS={({ hex }) => onColorChange(hex)}
                onCompleteJS={onColorPick}
                style={{ gap: 20 }}
              >
                <Panel5
                  style={{
                    borderRadius: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                />
              </ColorPicker>

              <Text className="mt-4 text-sm text-muted-foreground">
                Selected Color: {resultColor}
              </Text>
            </View>

            <View className="flex flex-row gap-3 py-6">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowColorPicker(false)}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                className="flex-1"
                onPress={() => setShowColorPicker(false)}
              >
                <Text>Select</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
