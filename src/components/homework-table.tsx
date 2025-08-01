import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Homework } from "@/lib/types";
import {
  sortHomeworkByDeadline,
  formatRelativeDate,
  getDeadlineStatus,
  getStatusBadgeVariant,
  getPriorityColor,
} from "@/lib/homework-utils";
import {
  ChevronRight,
  Clock,
  AlertTriangle,
  BookOpen,
  Calendar as CalendarIcon,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";

interface HomeworkTableProps {
  homework: Homework[];
  onHomeworkPress: (homework: Homework) => void;
}

export function HomeworkTable({
  homework,
  onHomeworkPress,
}: HomeworkTableProps) {
  const { isDarkColorScheme } = useColorScheme();
  const sortedHomework = sortHomeworkByDeadline(homework);

  const renderDeadline = (homework: Homework) => {
    if (!homework.deadline) {
      return (
        <View className="flex-row items-center">
          <Clock size={12} color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"} />
          <Text className="ml-1 text-xs text-muted-foreground">
            No deadline
          </Text>
        </View>
      );
    }

    const status = getDeadlineStatus(homework.deadline);
    const isUrgent = status === "overdue" || status === "due-soon";

    return (
      <View className="flex-row items-center">
        {isUrgent && (
          <AlertTriangle
            size={12}
            color={status === "overdue" ? "#EF4444" : "#F59E0B"}
          />
        )}
        <CalendarIcon
          size={12}
          color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
          style={{ marginLeft: isUrgent ? 4 : 0 }}
        />
        <Text
          className={`ml-1 text-xs ${
            status === "overdue"
              ? "text-red-600 dark:text-red-400 font-medium"
              : status === "due-soon"
              ? "text-yellow-600 dark:text-yellow-400 font-medium"
              : "text-muted-foreground"
          }`}
        >
          {formatRelativeDate(homework.deadline)}
        </Text>
      </View>
    );
  };

  const renderPriority = (priority: Homework["priority"]) => {
    return (
      <Badge
        variant={
          priority === "high"
            ? "destructive"
            : priority === "medium"
            ? "warning"
            : "success"
        }
        className="text-xs py-1 px-2"
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getCardStyle = (homework: Homework) => {
    const status = getDeadlineStatus(homework.deadline);
    switch (status) {
      case "overdue":
        return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "due-soon":
        return "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case "no-deadline":
        return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10";
      default:
        return "border-l-4 border-l-gray-200 dark:border-l-gray-700";
    }
  };

  if (homework.length === 0) {
    return (
      <View className="p-8 text-center">
        <BookOpen
          size={48}
          color={isDarkColorScheme ? "#6B7280" : "#9CA3AF"}
          style={{ alignSelf: "center", marginBottom: 16 }}
        />
        <Text className="text-muted-foreground text-lg font-medium">
          No homework found
        </Text>
        <Text className="text-muted-foreground mt-2 text-sm">
          Create your first homework assignment to get started!
        </Text>
      </View>
    );
  }

  return (
    <View className="px-4">
      <View>
        {sortedHomework.map((item) => {
          const status = getDeadlineStatus(item.deadline);
          const cardStyle = getCardStyle(item);

          return (
            <Pressable
              key={item.id}
              onPress={() => onHomeworkPress(item)}
              className="active:opacity-70 active:scale-98 mb-3"
            >
              <Card className={cardStyle}>
                <CardContent className="p-4">
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                      <Text
                        className="font-dm-sans-semibold text-base mb-1"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <View className="flex-row items-center mb-2">
                        <BookOpen
                          size={12}
                          color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                        />
                        <Text className="ml-1 text-sm text-muted-foreground font-dm-sans">
                          {item.subject}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-center">
                      {renderPriority(item.priority)}
                      <ChevronRight
                        size={16}
                        color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                        style={{ marginLeft: 8 }}
                      />
                    </View>
                  </View>

                  <Text
                    className="text-sm text-muted-foreground mb-3 font-dm-sans"
                    numberOfLines={2}
                  >
                    {item.description}
                  </Text>

                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">{renderDeadline(item)}</View>

                    <Badge
                      variant={getStatusBadgeVariant(status)}
                      className="text-xs"
                    >
                      {status === "no-deadline"
                        ? "No Deadline"
                        : status === "overdue"
                        ? "Overdue"
                        : status === "due-soon"
                        ? "Due Soon"
                        : item.completed
                        ? "Completed"
                        : "Normal"}
                    </Badge>
                  </View>
                </CardContent>
              </Card>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
