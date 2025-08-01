import * as React from "react";
import { View, Pressable, ScrollView, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeworkCalendar } from "@/components/homework-calendar";
import {
  Plus,
  BookOpen,
  Calendar,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { Homework } from "@/lib/types";
import { getDeadlineStatus, formatRelativeDate } from "@/lib/homework-utils";

interface HomeTabProps {
  homework: Homework[];
  onHomeworkPress: (homework: Homework) => void;
  onAddHomework: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function HomeTab({
  homework,
  onHomeworkPress,
  onAddHomework,
  onRefresh,
  refreshing = false,
}: HomeTabProps) {
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Calculate header padding based on safe area
  const headerPaddingTop = Math.max(insets.top, 16); // Minimum 16px, more if needed

  // Calculate statistics
  const stats = React.useMemo(() => {
    const overdueHomework = homework.filter(
      (h) => h.deadline && getDeadlineStatus(h.deadline) === "overdue"
    );
    const dueSoonHomework = homework.filter(
      (h) => h.deadline && getDeadlineStatus(h.deadline) === "due-soon"
    );
    const totalHomework = homework.length;
    const completedHomework = homework.filter((h) => h.completed).length;

    return {
      overdueHomework,
      dueSoonHomework,
      totalHomework,
      completedHomework,
    };
  }, [homework]);

  const urgentHomework = [...stats.overdueHomework, ...stats.dueSoonHomework]
    .sort((a, b) => {
      if (!a.deadline || !b.deadline) return 0;
      return a.deadline.getTime() - b.deadline.getTime();
    })
    .slice(0, 3);

  const renderHomeworkCard = (item: Homework) => {
    const status = getDeadlineStatus(item.deadline);
    const isUrgent = status === "overdue" || status === "due-soon";

    return (
      <Pressable
        key={item.id}
        onPress={() => onHomeworkPress(item)}
        className={`mb-3 p-4 rounded-xl border ${
          status === "overdue"
            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            : status === "due-soon"
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
            : "bg-card border-border"
        }`}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="font-semibold text-base mb-1">{item.title}</Text>
            <Text className="text-sm text-muted-foreground mb-2">
              {item.subject}
            </Text>

            {item.deadline && (
              <View className="flex-row items-center">
                {isUrgent && (
                  <AlertTriangle
                    size={14}
                    color={status === "overdue" ? "#EF4444" : "#F59E0B"}
                  />
                )}
                <Clock
                  size={14}
                  color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                  className={isUrgent ? "ml-1" : ""}
                />
                <Text
                  className={`ml-1 text-sm ${
                    status === "overdue"
                      ? "text-red-600 dark:text-red-400 font-medium"
                      : status === "due-soon"
                      ? "text-yellow-600 dark:text-yellow-400 font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {formatRelativeDate(item.deadline)}
                </Text>
              </View>
            )}
          </View>

          <View className="items-end">
            <Badge
              variant={
                status === "overdue"
                  ? "destructive"
                  : status === "due-soon"
                  ? "warning"
                  : item.priority === "high"
                  ? "destructive"
                  : item.priority === "medium"
                  ? "warning"
                  : "secondary"
              }
            >
              {status === "overdue"
                ? "OVERDUE"
                : status === "due-soon"
                ? "DUE SOON"
                : item.priority.toUpperCase()}
            </Badge>

            <ChevronRight
              size={16}
              color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
              className="mt-2"
            />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header - with dynamic padding for all device types */}
      <View
        className="flex-row items-center justify-between px-6 py-4"
        style={{ paddingTop: headerPaddingTop }}
      >
        <View>
          <Text className="text-2xl font-bold">TugasCollector</Text>
          <Text className="text-muted-foreground">
            Manage your homework efficiently
          </Text>
        </View>

        <Button
          variant="default"
          size="sm"
          onPress={onAddHomework}
          className="flex-row items-center rounded-full px-4"
        >
          <Plus size={16} color={isDarkColorScheme ? "#000000" : "#ffffff"} />
          <Text className="ml-1 text-primary-foreground font-medium">Add</Text>
        </Button>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={isDarkColorScheme ? "#ffffff" : "#000000"}
            />
          ) : undefined
        }
      >
        {/* Statistics Cards */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <Card className="flex-1">
              <CardContent className="p-4">
                <View className="items-center">
                  <BookOpen
                    size={24}
                    color={isDarkColorScheme ? "#3B82F6" : "#1E40AF"}
                  />
                  <Text className="text-2xl font-bold mt-2">
                    {stats.totalHomework}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Total Tasks
                  </Text>
                </View>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="p-4">
                <View className="items-center">
                  <AlertTriangle size={24} color="#EF4444" />
                  <Text className="text-2xl font-bold mt-2 text-red-600">
                    {stats.overdueHomework.length}
                  </Text>
                  <Text className="text-sm text-muted-foreground">Overdue</Text>
                </View>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardContent className="p-4">
                <View className="items-center">
                  <Calendar size={24} color="#F59E0B" />
                  <Text className="text-2xl font-bold mt-2 text-yellow-600">
                    {stats.dueSoonHomework.length}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Due Soon
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Urgent Tasks */}
        {urgentHomework.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold">Urgent Tasks</Text>
              <Text className="text-sm text-muted-foreground">
                {urgentHomework.length} items
              </Text>
            </View>

            <View>{urgentHomework.map(renderHomeworkCard)}</View>
          </View>
        )}

        {/* Recent Homework */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Recent Homework</Text>
            <Pressable>
              <Text className="text-sm text-primary font-medium">View All</Text>
            </Pressable>
          </View>

          <View>{homework.slice(0, 5).map(renderHomeworkCard)}</View>
        </View>

        {/* Calendar Section */}
        <View className="px-6 mb-6">
          <HomeworkCalendar homework={homework} />
        </View>

        {/* Bottom padding for navigation */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
