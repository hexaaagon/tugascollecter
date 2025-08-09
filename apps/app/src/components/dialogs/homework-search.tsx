import * as React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { Search, X, Calendar, BookOpen, Clock } from "lucide-react-native";
import { useTranslation } from "@/lib/language";
import { useColorScheme } from "@/lib/useColorScheme";
import { HomeworkData, SubjectData } from "@tugascollecter/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HomeworkSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeworkData: HomeworkData[];
  subjectData: SubjectData[];
  onHomeworkSelect: (homework: HomeworkData) => void;
}

export function HomeworkSearchDialog({
  open,
  onOpenChange,
  homeworkData,
  subjectData,
  onHomeworkSelect,
}: HomeworkSearchDialogProps) {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredHomework, setFilteredHomework] = React.useState<
    HomeworkData[]
  >([]);

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHomework(homeworkData);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = homeworkData.filter((homework) => {
      const subject = subjectData.find((s) => s.id === homework.subjectId);
      const subjectName = subject?.name.toLowerCase() || "";

      return (
        homework.title.toLowerCase().includes(query) ||
        homework.description?.toLowerCase().includes(query) ||
        subjectName.includes(query) ||
        homework.details.some((detail) =>
          detail.toLowerCase().includes(query),
        ) ||
        homework.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    setFilteredHomework(filtered);
  }, [searchQuery, homeworkData, subjectData]);

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

  const getStatusBadgeColor = (status: HomeworkData["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return t("noDueDate");

    const date = new Date(dueDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("dueToday");
    if (diffDays === 1) return t("dueTomorrow");
    if (diffDays > 0) return t("daysLeft", { days: diffDays });
    if (diffDays < 0) return t("daysAfterDue", { days: Math.abs(diffDays) });

    return date.toLocaleDateString();
  };

  const handleHomeworkPress = (homework: HomeworkData) => {
    onHomeworkSelect(homework);
    onOpenChange(false);
    setSearchQuery("");
  };

  const colors = {
    background: isDarkColorScheme ? "#1a1a1a" : "#ffffff",
    cardBackground: isDarkColorScheme ? "#2a2a2a" : "#f9f9f9",
    textPrimary: isDarkColorScheme ? "#ffffff" : "#000000",
    textSecondary: isDarkColorScheme ? "#a0a0a0" : "#666666",
    border: isDarkColorScheme ? "#404040" : "#e0e0e0",
    inputBackground: isDarkColorScheme ? "#2a2a2a" : "#f5f5f5",
  };

  const renderHomeworkItem = ({ item }: { item: HomeworkData }) => {
    const subject = subjectData.find((s) => s.id === item.subjectId);

    return (
      <TouchableOpacity
        onPress={() => handleHomeworkPress(item)}
        className="mb-3"
      >
        <Card style={{ backgroundColor: colors.cardBackground }}>
          <CardContent className="p-4">
            <View className="flex-row items-start justify-between">
              <View className="mr-3 flex-1">
                <Text
                  className="mb-1 text-base font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {item.title}
                </Text>

                {subject && (
                  <View className="mb-2 flex-row items-center">
                    <BookOpen size={12} color={colors.textSecondary} />
                    <Text
                      className="ml-1 text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {subject.name}
                    </Text>
                  </View>
                )}

                {item.description && (
                  <Text
                    className="mb-2 text-sm"
                    style={{ color: colors.textSecondary }}
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>
                )}

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Clock size={12} color={colors.textSecondary} />
                    <Text
                      className="ml-1 text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      {formatDueDate(item.dueDate)}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`${getStatusBadgeColor(item.status)} px-2 py-1`}
                    >
                      <Text className="text-xs capitalize text-white">
                        {item.status.replace("-", " ")}
                      </Text>
                    </Badge>

                    <View
                      className={`h-3 w-3 rounded-full ${getPriorityColor(item.priority)}`}
                    />
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80%] w-[95%] max-w-md"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="mb-4 flex-row items-center justify-between">
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.textPrimary }}
            >
              {t("searchTasks")}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => onOpenChange(false)}
              className="p-2"
            >
              <X size={20} color={colors.textPrimary} />
            </Button>
          </View>

          {/* Search Input */}
          <View className="mb-4 flex-row items-center">
            <View className="relative flex-1">
              <Search
                size={18}
                color={colors.textSecondary}
                style={{ position: "absolute", left: 12, top: 12, zIndex: 1 }}
              />
              <Input
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t("searchPlaceholder")}
                className="pl-10"
                style={{
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                }}
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
            </View>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setSearchQuery("")}
                className="ml-2 p-2"
              >
                <X size={16} color={colors.textSecondary} />
              </Button>
            )}
          </View>

          {/* Results Count */}
          <Text
            className="mb-3 text-sm"
            style={{ color: colors.textSecondary }}
          >
            {t("tasksFound", { count: filteredHomework.length })}
          </Text>

          {/* Results List */}
          <FlatList
            data={filteredHomework}
            keyExtractor={(item) => item.id}
            renderItem={renderHomeworkItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-8">
                <Search size={48} color={colors.textSecondary} />
                <Text
                  className="mb-2 mt-4 text-base font-medium"
                  style={{ color: colors.textPrimary }}
                >
                  {t("noTasksFound")}
                </Text>
                <Text
                  className="text-center text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {t("tryAdjustingSearchTerms")}
                </Text>
              </View>
            }
          />
        </View>
      </DialogContent>
    </Dialog>
  );
}
