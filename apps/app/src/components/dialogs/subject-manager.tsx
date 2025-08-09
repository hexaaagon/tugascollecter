import React, { useState, useEffect } from "react";
import { View, Alert, Modal, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StorageManager } from "@/lib/storage";
import { SubjectData } from "@tugascollecter/types";
import {
  X,
  BookOpen,
  Palette,
  Plus,
  Trash2,
  Edit3,
  Download,
  Globe,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
  Panel5,
} from "reanimated-color-picker";
import {
  getCountries,
  getEducationLevels,
  getSubjectsForImport,
  type CountryEducationSystem,
} from "@tugascollecter/subject-pack";
import { useLanguage } from "@/lib/language";
import { useColorScheme } from "@/lib/useColorScheme";

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
  const { t } = useLanguage();

  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultColor, setResultColor] = useState(predefinedColors[0]);
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editSelectedColor, setEditSelectedColor] = useState("");

  // Subject Pack integration states
  const [countries, setCountries] = useState<CountryEducationSystem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [educationLevels, setEducationLevels] = useState<
    CountryEducationSystem["educationLevels"]
  >([]);
  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    manual: true,
    import: false,
  });

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
      loadCountries();
    }
  }, [visible]);

  const loadCountries = async () => {
    try {
      const countryData = await getCountries();
      setCountries(countryData);
    } catch (error) {
      console.error("Error loading countries:", error);
    }
  };

  const handleCountryChange = async (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedEducationLevel("");
    setAvailableSubjects([]);

    try {
      const levels = await getEducationLevels(countryCode);
      setEducationLevels(levels || []);
    } catch (error) {
      console.error("Error loading education levels:", error);
    }
  };

  const handleEducationLevelChange = async (levelId: string) => {
    setSelectedEducationLevel(levelId);

    if (!selectedCountry || !levelId) {
      setAvailableSubjects([]);
      return;
    }

    setImportLoading(true);
    try {
      const subjects = await getSubjectsForImport(
        selectedCountry,
        2025,
        levelId,
      );
      setAvailableSubjects(subjects);
    } catch (error) {
      console.error("Error loading subjects:", error);
      Alert.alert(t("error"), t("failedToLoadSubjectTemplates"));
    } finally {
      setImportLoading(false);
    }
  };

  const importSubjects = async (subjectsToImport: any[]) => {
    if (subjectsToImport.length === 0) return;

    // Show confirmation dialog first
    Alert.alert(
      t("importSubjectTemplates"),
      t("importSubjectTemplatesDescription"),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("importAll"),
          onPress: async () => {
            await performImportInternal(subjectsToImport);
          },
        },
      ],
    );
  };

  const performImportInternal = async (subjectsToImport: any[]) => {
    setImportLoading(true);
    try {
      // Check for duplicate names
      const existingNames = subjects.map((s) => s.name.toLowerCase());
      const duplicates = subjectsToImport.filter((s) =>
        existingNames.includes(s.name.toLowerCase()),
      );

      if (duplicates.length > 0) {
        Alert.alert(
          t("duplicateSubjects"),
          t("duplicateSubjectsMessage").replace(
            "{{names}}",
            duplicates.map((d) => d.name).join(", "),
          ),
          [
            { text: t("cancel"), style: "cancel" },
            {
              text: t("importOthers"),
              onPress: async () => {
                const uniqueSubjects = subjectsToImport.filter(
                  (s) => !existingNames.includes(s.name.toLowerCase()),
                );
                await performImport(uniqueSubjects);
              },
            },
          ],
        );
        return;
      }

      await performImport(subjectsToImport);
    } catch (error) {
      console.error("Error importing subjects:", error);
      Alert.alert(t("error"), t("failedToImportSubjects"));
    } finally {
      setImportLoading(false);
    }
  };

  const performImport = async (subjectsToImport: any[]) => {
    const newSubjects = subjectsToImport.map((subject) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: subject.name,
      color: subject.color,
      day: subject.day || [],
      description: subject.description,
    }));

    const updatedSubjects = [...subjects, ...newSubjects];
    await StorageManager.saveSubjects(updatedSubjects);
    setSubjects(updatedSubjects);
    onUpdate();

    Alert.alert(
      t("importSuccessful"),
      t("importSuccessfulMessage").replace(
        "{{count}}",
        newSubjects.length.toString(),
      ),
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
      Alert.alert(t("error"), t("pleaseEnterSubjectName"));
      return;
    }

    if (
      subjects.some(
        (s) => s.name.toLowerCase() === newSubjectName.trim().toLowerCase(),
      )
    ) {
      Alert.alert(t("error"), t("subjectNameAlreadyExists"));
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
      Alert.alert(t("error"), t("failedToAddSubject"));
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (subjectId: string) => {
    Alert.alert(t("deleteSubject"), t("deleteSubjectConfirmation"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            const updatedSubjects = subjects.filter((s) => s.id !== subjectId);
            await StorageManager.saveSubjects(updatedSubjects);
            setSubjects(updatedSubjects);
            onUpdate();
          } catch (error) {
            console.error("Error deleting subject:", error);
            Alert.alert(t("error"), t("failedToDeleteSubject"));
          }
        },
      },
    ]);
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
      Alert.alert(t("error"), t("pleaseEnterSubjectName"));
      return;
    }

    if (
      subjects.some(
        (s) =>
          s.id !== subjectId &&
          s.name.toLowerCase() === editSubjectName.trim().toLowerCase(),
      )
    ) {
      Alert.alert(t("error"), t("subjectNameAlreadyExists"));
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
      Alert.alert(t("error"), t("failedToUpdateSubject"));
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
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="mx-6">
            <View className="flex flex-row items-center justify-between py-4">
              <Text className="text-xl font-bold">{t("manageSubjects")}</Text>
              <View className="flex flex-row gap-2">
                <Button variant="outline" size="icon" onPress={onClose}>
                  <X color="#6b7280" size={20} />
                </Button>
              </View>
            </View>

            {/* Import Subjects Section */}
            <Card className="mb-4">
              <Pressable onPress={() => toggleSection("import")}>
                <CardHeader>
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <Globe size={20} color="#6366f1" />
                      <CardTitle>{t("importSubjectTemplates")}</CardTitle>
                    </View>
                    {expandedSections.import ? (
                      <ChevronUp size={20} color="#6b7280" />
                    ) : (
                      <ChevronDown size={20} color="#6b7280" />
                    )}
                  </View>
                </CardHeader>
              </Pressable>

              {expandedSections.import && (
                <CardContent className="flex flex-col gap-4">
                  <Text className="text-sm text-muted-foreground">
                    {t("importSubjectTemplatesDescription")}
                  </Text>

                  <View>
                    <Text className="mb-2 text-sm font-medium">
                      {t("country")}
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      {countries.map((country) => (
                        <Pressable
                          key={country.countryCode}
                          onPress={() =>
                            handleCountryChange(country.countryCode)
                          }
                          className={`rounded-lg border px-3 py-2 ${
                            selectedCountry === country.countryCode
                              ? "border-primary bg-primary"
                              : "border-border bg-secondary"
                          }`}
                        >
                          <Text
                            className={`text-sm ${
                              selectedCountry === country.countryCode
                                ? "text-primary-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {country.countryName}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  {selectedCountry && educationLevels.length > 0 && (
                    <View>
                      <Text className="mb-2 text-sm font-medium">
                        {t("educationLevel")}
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                          flexDirection: "row",
                          gap: 8,
                        }}
                      >
                        {educationLevels.map((level) => (
                          <Pressable
                            key={level.id}
                            onPress={() => handleEducationLevelChange(level.id)}
                            className={`rounded-lg border px-3 py-2 ${
                              selectedEducationLevel === level.id
                                ? "border-primary bg-primary"
                                : "border-border bg-secondary"
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                selectedEducationLevel === level.id
                                  ? "text-primary-foreground"
                                  : "text-foreground"
                              }`}
                            >
                              {level.localizedName?.id || level.name}
                            </Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}

                  {importLoading && (
                    <View className="flex justify-center py-4">
                      <Text className="text-center text-sm text-muted-foreground">
                        {t("loadingSubjects")}
                      </Text>
                    </View>
                  )}

                  {availableSubjects.length > 0 && (
                    <View>
                      <Text className="mb-2 text-sm font-medium">
                        {t("availableSubjects")} ({availableSubjects.length})
                      </Text>
                      <View className="max-h-40">
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View className="flex flex-col gap-2">
                            {availableSubjects.map((subject, index) => (
                              <View
                                key={index}
                                className="flex flex-row items-center gap-3 rounded-lg bg-muted/50 p-3"
                              >
                                <View
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: subject.color }}
                                />
                                <Text className="flex-1 text-sm">
                                  {subject.name}
                                </Text>
                                {subject.description && (
                                  <Text className="text-xs text-muted-foreground">
                                    {subject.description.length > 30
                                      ? subject.description.substring(0, 30) +
                                        "..."
                                      : subject.description}
                                  </Text>
                                )}
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                      </View>

                      <Button
                        onPress={() => importSubjects(availableSubjects)}
                        disabled={importLoading}
                        className="mt-3 w-full"
                      >
                        <View className="flex flex-row items-center gap-2">
                          <Download size={16} />
                          <Text>
                            {importLoading
                              ? t("importingEllipsis")
                              : t("importAllCountSubjects").replace(
                                  "{count}",
                                  availableSubjects.length.toString(),
                                )}
                          </Text>
                        </View>
                      </Button>
                    </View>
                  )}

                  {selectedCountry &&
                    selectedEducationLevel &&
                    availableSubjects.length === 0 &&
                    !importLoading && (
                      <View className="flex justify-center py-4">
                        <Text className="text-center text-sm text-muted-foreground">
                          {t("noSubjectsAvailableForCombination")}
                        </Text>
                      </View>
                    )}
                </CardContent>
              )}
            </Card>

            {/* Manual Add Section */}
            <Card className="mb-6">
              <Pressable onPress={() => toggleSection("manual")}>
                <CardHeader>
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <Plus size={20} color="#22c55e" />
                      <CardTitle>{t("addCustomSubject")}</CardTitle>
                    </View>
                    {expandedSections.manual ? (
                      <ChevronUp size={20} color="#6b7280" />
                    ) : (
                      <ChevronDown size={20} color="#6b7280" />
                    )}
                  </View>
                </CardHeader>
              </Pressable>

              {expandedSections.manual && (
                <CardContent className="space-y-4">
                  <View>
                    <Text className="mb-2 text-sm font-medium">
                      {t("subjectName")}
                    </Text>
                    <Input
                      value={newSubjectName}
                      onChangeText={setNewSubjectName}
                      placeholder={t("enterSubjectName")}
                      className="w-full"
                    />
                  </View>

                  <View>
                    <Text className="mb-2 text-sm font-medium">
                      {t("color")}
                    </Text>
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
                        {t("selected")}: {selectedColor}
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
                      <Text>{loading ? t("adding") : t("addSubject")}</Text>
                    </View>
                  </Button>
                </CardContent>
              )}
            </Card>

            <View className="flex-1">
              <Text className="mb-4 text-lg font-semibold">
                {t("existingSubjects")} ({subjects.length})
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
                                {t("subjectName")}
                              </Text>
                              <Input
                                value={editSubjectName}
                                onChangeText={setEditSubjectName}
                                placeholder={t("enterSubjectName")}
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
                                <Text>{t("cancel")}</Text>
                              </Button>
                              <Button
                                onPress={() => saveEditSubject(subject.id)}
                                disabled={loading}
                                className="flex-1"
                              >
                                <Text>{loading ? t("saving") : t("save")}</Text>
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
                  <CardContent className="py-12">
                    <View className="items-center">
                      <BookOpen size={48} className="mb-4" color="gray" />
                      <Text className="mb-2 text-lg font-medium">
                        {t("noSubjects")}
                      </Text>
                      <Text className="text-center text-sm text-muted-foreground">
                        {t("addFirstSubject")}
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              )}
            </View>

            <View className="py-6">
              <Button variant="outline" onPress={onClose} className="w-full">
                <Text>{t("done")}</Text>
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
              <Text className="text-xl font-bold">{t("chooseColor")}</Text>
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
                {t("selectedColor")}: {resultColor}
              </Text>
            </View>

            <View className="flex flex-row gap-3 py-6">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setShowColorPicker(false)}
              >
                <Text>{t("cancel")}</Text>
              </Button>
              <Button
                className="flex-1"
                onPress={() => setShowColorPicker(false)}
              >
                <Text>{t("select")}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
