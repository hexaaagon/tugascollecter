import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Homework } from "@/lib/types";
import {
  sortHomeworkByDeadline,
  formatRelativeDate,
  getDeadlineStatus,
  getStatusBadgeVariant,
} from "@/lib/homework-utils";
import {
  ChevronRight,
  Clock,
  AlertTriangle,
  BookOpen,
  Plus,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";

interface HomeworkTabProps {
  homework: Homework[];
  onHomeworkPress: (homework: Homework) => void;
  onAddHomework?: () => void;
}

export function HomeworkTab({
  homework,
  onHomeworkPress,
  onAddHomework,
}: HomeworkTabProps) {
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  // Calculate header padding based on safe area
  const headerPaddingTop = Math.max(insets.top, 16);

  const sortedHomework = sortHomeworkByDeadline(homework);

  const renderHomeworkItem = (item: Homework) => {
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
            <View className="flex-row items-center mb-2">
              <BookOpen
                size={16}
                color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="ml-2 text-sm text-muted-foreground">
                {item.subject}
              </Text>
            </View>

            <Text className="font-semibold text-base mb-2">{item.title}</Text>

            <Text
              className="text-sm text-muted-foreground mb-3"
              numberOfLines={2}
            >
              {item.description}
            </Text>

            {item.deadline ? (
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
            ) : (
              <View className="flex-row items-center">
                <Clock
                  size={14}
                  color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                />
                <Text className="ml-1 text-sm text-muted-foreground">
                  No deadline
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
                  : status === "no-deadline"
                  ? "secondary"
                  : item.priority === "high"
                  ? "destructive"
                  : item.priority === "medium"
                  ? "warning"
                  : "secondary"
              }
              className="mb-2"
            >
              {status === "overdue"
                ? "OVERDUE"
                : status === "due-soon"
                ? "DUE SOON"
                : status === "no-deadline"
                ? "NO DEADLINE"
                : item.priority.toUpperCase()}
            </Badge>

            <ChevronRight
              size={16}
              color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
            />
          </View>
        </View>
      </Pressable>
    );
  };

  const groupHomeworkByStatus = () => {
    const groups = {
      noDeadline: sortedHomework.filter((h) => !h.deadline),
      overdue: sortedHomework.filter(
        (h) => h.deadline && getDeadlineStatus(h.deadline) === "overdue"
      ),
      dueSoon: sortedHomework.filter(
        (h) => h.deadline && getDeadlineStatus(h.deadline) === "due-soon"
      ),
      normal: sortedHomework.filter(
        (h) => h.deadline && ["normal"].includes(getDeadlineStatus(h.deadline))
      ),
    };

    return groups;
  };

  const groups = groupHomeworkByStatus();

  return (
    <View className="flex-1 bg-background">
      {/* Header - with dynamic padding for all device types */}
      <View
        className="flex-row items-center justify-between px-6 py-4"
        style={{ paddingTop: headerPaddingTop }}
      >
        <View>
          <Text className="text-2xl font-bold">Homework</Text>
          <Text className="text-muted-foreground">
            {homework.length} total assignments
          </Text>
        </View>

        {onAddHomework && (
          <Pressable
            onPress={onAddHomework}
            className="w-12 h-12 bg-primary rounded-full items-center justify-center"
          >
            <Plus size={20} color={isDarkColorScheme ? "#000000" : "#ffffff"} />
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {/* No Deadline Section */}
          {groups.noDeadline.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4">
                No Deadline ({groups.noDeadline.length})
              </Text>
              {groups.noDeadline.map(renderHomeworkItem)}
            </View>
          )}

          {/* Overdue Section */}
          {groups.overdue.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4 text-red-600">
                Overdue ({groups.overdue.length})
              </Text>
              {groups.overdue.map(renderHomeworkItem)}
            </View>
          )}

          {/* Due Soon Section */}
          {groups.dueSoon.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4 text-yellow-600">
                Due Soon ({groups.dueSoon.length})
              </Text>
              {groups.dueSoon.map(renderHomeworkItem)}
            </View>
          )}

          {/* Normal Section */}
          {groups.normal.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-4">
                Upcoming ({groups.normal.length})
              </Text>
              {groups.normal.map(renderHomeworkItem)}
            </View>
          )}

          {/* Empty State */}
          {homework.length === 0 && (
            <View className="items-center justify-center py-12">
              <BookOpen
                size={48}
                color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="text-lg font-medium mt-4">No homework yet</Text>
              <Text className="text-muted-foreground mt-2 text-center">
                Create your first homework assignment to get started!
              </Text>
              {onAddHomework && (
                <Pressable
                  onPress={onAddHomework}
                  className="mt-6 bg-primary px-6 py-3 rounded-xl"
                >
                  <Text className="text-primary-foreground font-medium">
                    Add Homework
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {/* Bottom padding for navigation */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
}
