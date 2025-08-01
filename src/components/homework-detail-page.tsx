import * as React from "react";
import { View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react-native";
import { useColorScheme } from "@/lib/useColorScheme";
import { Homework } from "@/lib/types";
import {
  formatDate,
  formatRelativeDate,
  getDeadlineStatus,
  getStatusBadgeVariant,
  getPriorityColor,
} from "@/lib/homework-utils";

interface HomeworkDetailPageProps {
  homework: Homework;
  onBack: () => void;
  onEdit?: (homework: Homework) => void;
  onDelete?: (homework: Homework) => void;
  onToggleComplete?: (homework: Homework) => void;
}

export function HomeworkDetailPage({
  homework,
  onBack,
  onEdit,
  onDelete,
  onToggleComplete,
}: HomeworkDetailPageProps) {
  const { isDarkColorScheme } = useColorScheme();
  const status = getDeadlineStatus(homework.deadline);

  const renderDeadlineInfo = () => {
    if (!homework.deadline) {
      return (
        <View className="flex-row items-center">
          <Clock size={16} color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"} />
          <Text className="ml-2 text-muted-foreground">No deadline set</Text>
        </View>
      );
    }

    const isUrgent = status === "overdue" || status === "due-soon";

    return (
      <View>
        <View className="flex-row items-center mb-2">
          {isUrgent && (
            <AlertTriangle
              size={16}
              color={status === "overdue" ? "#EF4444" : "#F59E0B"}
            />
          )}
          <Calendar
            size={16}
            color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
            className={isUrgent ? "ml-2" : ""}
          />
          <Text className="ml-2 font-medium">
            {formatDate(homework.deadline)}
          </Text>
        </View>

        <Text
          className={`text-sm ${
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

  const renderPriority = () => {
    return (
      <Badge
        variant={
          homework.priority === "high"
            ? "destructive"
            : homework.priority === "medium"
            ? "warning"
            : "success"
        }
      >
        {homework.priority.toUpperCase()} PRIORITY
      </Badge>
    );
  };

  const getStatusCardStyle = () => {
    switch (status) {
      case "overdue":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "due-soon":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-border">
        <View className="flex-row items-center">
          <Pressable
            onPress={onBack}
            className="p-2 rounded-lg hover:bg-muted mr-3"
          >
            <ArrowLeft
              size={24}
              color={isDarkColorScheme ? "#ffffff" : "#000000"}
            />
          </Pressable>
          <Text className="text-xl font-semibold">Homework Details</Text>
        </View>

        <View className="flex-row items-center">
          {onEdit && (
            <Pressable
              onPress={() => onEdit(homework)}
              className="p-2 rounded-lg hover:bg-muted mr-2"
            >
              <Edit
                size={20}
                color={isDarkColorScheme ? "#ffffff" : "#000000"}
              />
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              onPress={() => onDelete(homework)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <Trash2 size={20} color="#EF4444" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Status Alert */}
          {(status === "overdue" || status === "due-soon") && (
            <Card className={`mb-4 ${getStatusCardStyle()}`}>
              <CardContent className="p-4">
                <View className="flex-row items-center">
                  <AlertTriangle
                    size={20}
                    color={status === "overdue" ? "#EF4444" : "#F59E0B"}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      status === "overdue"
                        ? "text-red-700 dark:text-red-300"
                        : "text-yellow-700 dark:text-yellow-300"
                    }`}
                  >
                    {status === "overdue"
                      ? "This homework is overdue!"
                      : "This homework is due soon!"}
                  </Text>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Title and Basic Info */}
          <Card className="mb-4">
            <CardHeader>
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    {homework.title}
                  </CardTitle>
                  <View className="flex-row items-center">
                    <BookOpen
                      size={16}
                      color={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text className="ml-2 text-muted-foreground">
                      {homework.subject}
                    </Text>
                  </View>
                </View>

                <View className="ml-4">{renderPriority()}</View>
              </View>
            </CardHeader>

            <CardContent>
              <Text className="text-base leading-6">
                {homework.description}
              </Text>
            </CardContent>
          </Card>

          {/* Deadline Information */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Deadline</CardTitle>
            </CardHeader>
            <CardContent>{renderDeadlineInfo()}</CardContent>
          </Card>

          {/* Status and Progress */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-muted-foreground">Status</Text>
                <Badge variant={homework.completed ? "success" : "secondary"}>
                  {homework.completed ? "COMPLETED" : "IN PROGRESS"}
                </Badge>
              </View>

              {onToggleComplete && (
                <Button
                  variant={homework.completed ? "secondary" : "default"}
                  onPress={() => onToggleComplete(homework)}
                  className="flex-row items-center justify-center"
                >
                  <CheckCircle
                    size={16}
                    color={
                      homework.completed
                        ? isDarkColorScheme
                          ? "#ffffff"
                          : "#000000"
                        : "#ffffff"
                    }
                  />
                  <Text
                    className={`ml-2 ${
                      homework.completed
                        ? "text-foreground"
                        : "text-primary-foreground"
                    }`}
                  >
                    {homework.completed
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </Text>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Created</Text>
                  <Text>{formatDate(homework.createdAt)}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Last Updated</Text>
                  <Text>{formatDate(homework.updatedAt)}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">ID</Text>
                  <Text className="font-mono text-sm">{homework.id}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
