import * as React from "react";
import { View, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  Search,
  ArrowLeft,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react-native";
import { useTranslation } from "@/lib/language";
import { useColorScheme } from "@/lib/useColorScheme";
import { HomeworkData, SubjectData } from "@tugascollecter/types";
import { StorageManager } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useScroll } from "./_layout";
import { toast } from "sonner-native";

export default function SearchPage() {
  const { t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { handleScroll } = useScroll();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [homeworkData, setHomeworkData] = React.useState<HomeworkData[]>([]);
  const [subjectData, setSubjectData] = React.useState<SubjectData[]>([]);
  const [filteredHomework, setFilteredHomework] = React.useState<
    HomeworkData[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  // Load homework and subjects data
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [homework, subjects] = await Promise.all([
          StorageManager.getHomework(),
          StorageManager.getSubjects(),
        ]);
        setHomeworkData(homework);
        setSubjectData(subjects);
        setFilteredHomework(homework);
      } catch (error) {
        console.error("Error loading data for search:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter homework based on search query
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
    toast.info(t("loadingHomeworkData"));
    router.push(`/tasks?homeworkId=${homework.id}`);
  };

  const colors = {
    background: isDarkColorScheme ? "#0a0a0a" : "#ffffff",
    headerBackground: isDarkColorScheme ? "#1a1a1a" : "#f9f9f9",
    cardBackground: isDarkColorScheme ? "#1f1f1f" : "#f8f9fa",
    textPrimary: isDarkColorScheme ? "#ffffff" : "#000000",
    textSecondary: isDarkColorScheme ? "#a0a0a0" : "#666666",
    border: isDarkColorScheme ? "#333333" : "#e5e7eb",
    inputBackground: isDarkColorScheme ? "#2a2a2a" : "#f5f5f5",
    iconColor: isDarkColorScheme ? "#ffffff" : "#000000",
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
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {subject && (
                  <View className="mb-2 flex-row items-center gap-1">
                    <BookOpen size={14} color={colors.textSecondary} />
                    <View
                      className="ml-1 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: subject.color,
                      }}
                    />
                    <Text
                      className="text-sm"
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
      />

      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        {/* Custom Header */}
        <View
          className="border-b px-5 pb-3"
          style={{
            backgroundColor: colors.headerBackground,
            paddingTop: insets.top + 64,
            borderBottomColor: colors.border,
          }}
        >
          {/* Search Input */}
          <View className="flex-row items-center">
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
                className="h-12 pl-10"
                style={{
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                  borderColor: colors.border,
                }}
                placeholderTextColor={colors.textSecondary}
                autoFocus
                returnKeyType="search"
              />
            </View>
          </View>
        </View>

        {/* Results */}
        <ScrollableWrapper
          noPaddingTop
          onScroll={handleScroll}
          className="flex-1"
        >
          <View className="p-5">
            {/* Results Count */}
            <Text
              className="mb-4 text-sm"
              style={{ color: colors.textSecondary }}
            >
              {t("tasksFound", { count: filteredHomework.length })}
            </Text>

            {loading ? (
              <View className="items-center justify-center py-12">
                <Text
                  className="text-base"
                  style={{ color: colors.textSecondary }}
                >
                  {t("loading")}...
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredHomework}
                keyExtractor={(item) => item.id}
                renderItem={renderHomeworkItem}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                ListEmptyComponent={
                  <View className="items-center justify-center py-12">
                    <Search size={64} color={colors.textSecondary} />
                    <Text
                      className="mb-2 mt-6 text-lg font-medium"
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
            )}
          </View>
        </ScrollableWrapper>
      </View>
    </>
  );
}
