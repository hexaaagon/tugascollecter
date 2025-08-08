import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { StorageManager } from "@/lib/storage";
import { HomeworkData, SubjectData } from "@/shared/types/storage";
import { useLanguage } from "@/lib/language";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
} from "lucide-react-native";

export default function Statistics() {
  const { t } = useLanguage();
  const [homeworkData, setHomeworkData] = useState<HomeworkData[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [homework, subjects] = await Promise.all([
          StorageManager.getHomework(),
          StorageManager.getSubjects(),
        ]);
        setHomeworkData(homework);
        setSubjectData(subjects);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <ScrollableWrapper className="flex-1">
        <View className="mx-6 flex-1 items-center justify-center">
          <Text className="text-lg text-muted-foreground">
            {t("loadingStatistics")}
          </Text>
        </View>
      </ScrollableWrapper>
    );
  }

  // Calculate statistics
  const totalTasks = homeworkData.length;
  const completedTasks = homeworkData.filter(
    (h) => h.status === "completed",
  ).length;
  const pendingTasks = homeworkData.filter(
    (h) => h.status === "pending",
  ).length;
  const inProgressTasks = homeworkData.filter(
    (h) => h.status === "in-progress",
  ).length;
  const overdueTasks = homeworkData.filter(
    (h) => h.status === "overdue",
  ).length;

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueRate = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;

  // Priority distribution
  const highPriorityTasks = homeworkData.filter(
    (h) => h.priority === "high",
  ).length;
  const mediumPriorityTasks = homeworkData.filter(
    (h) => h.priority === "medium",
  ).length;
  const lowPriorityTasks = homeworkData.filter(
    (h) => h.priority === "low",
  ).length;

  // Subject statistics
  const subjectStats = subjectData
    .map((subject) => {
      const subjectHomework = homeworkData.filter(
        (h) => h.subjectId === subject.id,
      );
      const completed = subjectHomework.filter(
        (h) => h.status === "completed",
      ).length;
      const total = subjectHomework.length;
      return {
        subject: subject.name,
        total,
        completed,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
        color: subject.color || "#6366f1",
      };
    })
    .filter((stat) => stat.total > 0);

  const getWeeklyData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));

    return days.map((day, index) => {
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + index);

      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const completed = homeworkData.filter((homework) => {
        if (homework.status !== "completed" || !homework.completedAt)
          return false;

        const completedDate = new Date(homework.completedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      }).length;

      return { day, completed };
    });
  };

  const weeklyData = getWeeklyData();
  const maxWeeklyCompleted = Math.max(...weeklyData.map((d) => d.completed), 1);

  const recentCompletions = homeworkData
    .filter((h) => h.status === "completed")
    .slice(0, 5);

  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 flex flex-col gap-2 space-y-6 pb-6">
        <View className="pt-4">
          <Text className="text-2xl font-bold">{t("statistics")}</Text>
          <Text className="text-sm text-muted-foreground">
            {t("yourHomeworkPerformanceOverview")}
          </Text>
        </View>

        <View className="flex flex-row gap-3">
          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex flex-row items-center gap-2">
                <TrendingUp size={20} color="#10b981" />
                <View>
                  <Text className="text-2xl font-bold">
                    {Math.round(completionRate)}%
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("successRate")}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex flex-row items-center gap-2">
                <Clock size={20} color="#f97316" />
                <View>
                  <Text className="text-2xl font-bold">
                    {pendingTasks + inProgressTasks}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("active")}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>{t("overallProgress")}</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex flex-col gap-4">
              <View>
                <View className="mb-2 flex flex-row justify-between">
                  <Text className="text-sm">{t("completionRate")}</Text>
                  <Text className="text-sm font-medium">
                    {Math.round(completionRate)}%
                  </Text>
                </View>
                <Progress value={completionRate} className="h-2" />
              </View>

              <View className="flex flex-row justify-between">
                <View className="items-center">
                  <Text className="text-lg font-semibold text-green-500">
                    {completedTasks}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("completed")}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-semibold text-blue-500">
                    {inProgressTasks}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("inProgress")}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-semibold text-yellow-500">
                    {pendingTasks}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("pending")}
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-semibold text-red-500">
                    {overdueTasks}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {t("overdue")}
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("priorityDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="flex flex-col gap-4">
              <View>
                <View className="mb-1 flex flex-row justify-between">
                  <Text className="text-sm">{t("highPriority")}</Text>
                  <Text className="text-sm font-medium">
                    {highPriorityTasks}
                  </Text>
                </View>
                <Progress
                  value={
                    totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0
                  }
                  className="h-2"
                  indicatorClassName="bg-red-500"
                />
              </View>

              <View>
                <View className="mb-1 flex flex-row justify-between">
                  <Text className="text-sm">{t("mediumPriority")}</Text>
                  <Text className="text-sm font-medium">
                    {mediumPriorityTasks}
                  </Text>
                </View>
                <Progress
                  value={
                    totalTasks > 0
                      ? (mediumPriorityTasks / totalTasks) * 100
                      : 0
                  }
                  className="h-2"
                  indicatorClassName="bg-yellow-500"
                />
              </View>

              <View>
                <View className="mb-1 flex flex-row justify-between">
                  <Text className="text-sm">{t("lowPriority")}</Text>
                  <Text className="text-sm font-medium">
                    {lowPriorityTasks}
                  </Text>
                </View>
                <Progress
                  value={
                    totalTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0
                  }
                  className="h-2"
                  indicatorClassName="bg-green-500"
                />
              </View>
            </View>
          </CardContent>
        </Card>

        {subjectStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("subjectPerformance")}</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-4">
                {subjectStats.map((stat, index) => (
                  <View key={index}>
                    <View className="mb-2 flex flex-row justify-between">
                      <View className="flex flex-row items-center gap-2">
                        <View
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                        <Text className="text-sm font-medium">
                          {stat.subject}
                        </Text>
                      </View>
                      <Text className="text-sm text-muted-foreground">
                        {stat.completed}/{stat.total} (
                        {Math.round(stat.completionRate)}%)
                      </Text>
                    </View>
                    <Progress value={stat.completionRate} className="h-2" />
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("weeklyActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData.every((day) => day.completed === 0) ? (
              <View className="items-center py-8">
                <Calendar size={32} color="#6b7280" className="mb-2" />
                <Text className="text-center text-sm text-muted-foreground">
                  {t("completeSomeHomework")}
                </Text>
                <Text className="text-center text-sm text-muted-foreground">
                  {t("yourWeeklyActivityPattern")}
                </Text>
              </View>
            ) : (
              <View className="flex h-24 flex-row items-end justify-between">
                {weeklyData.map((day, index) => (
                  <View key={index} className="flex-1 items-center">
                    <View
                      className="mb-2 w-6 rounded-t-sm bg-primary"
                      style={{
                        height:
                          maxWeeklyCompleted > 0
                            ? (day.completed / maxWeeklyCompleted) * 60
                            : 0,
                      }}
                    />
                    <Text className="text-xs text-muted-foreground">
                      {day.day}
                    </Text>
                    <Text className="text-xs font-medium">{day.completed}</Text>
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>

        {recentCompletions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t("recentAchievements")}</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="flex flex-col gap-2">
                {recentCompletions.map((homework, index) => {
                  const subject = subjectData.find(
                    (s) => s.id === homework.subjectId,
                  );
                  return (
                    <View
                      key={homework.id}
                      className="flex flex-row items-center gap-3"
                    >
                      <Award size={16} color="#eab308" />
                      <View className="flex-1">
                        <Text className="text-sm font-medium">
                          {homework.title}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {subject?.name} • {t("completed")}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </CardContent>
          </Card>
        )}
      </View>
    </ScrollableWrapper>
  );
}
