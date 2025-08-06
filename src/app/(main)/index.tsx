import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { getGreeting } from "@/lib/greeting";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { StorageManager } from "@/lib/storage";
import { HomeworkData, SubjectData } from "@/shared/types/storage";
import { router } from "expo-router";
import { BookOpen, Calendar, Clock, TrendingUp } from "lucide-react-native";

export default function Home() {
  const [homeworkData, setHomeworkData] = useState<HomeworkData[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [homework, subjects] = await Promise.all([
          StorageManager.getHomework(),
          StorageManager.getSubjects(),
        ]);
        setHomeworkData(homework);
        setSubjectData(subjects);
        setGreeting(getGreeting());
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const stats = {
    total: homeworkData.length,
    completed: homeworkData.filter((h) => h.status === "completed").length,
    pending: homeworkData.filter((h) => h.status === "pending").length,
    overdue: homeworkData.filter((h) => h.status === "overdue").length,
    inProgress: homeworkData.filter((h) => h.status === "in-progress").length,
  };

  const completionRate =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
  const urgentHomework = homeworkData.filter(
    (h) =>
      h.priority === "high" &&
      (h.status === "pending" || h.status === "in-progress"),
  );

  const upcomingHomework = homeworkData
    .filter((h) => h.dueDate && h.status !== "completed")
    .sort(
      (a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
    )
    .slice(0, 3);

  if (loading) {
    return (
      <ScrollableWrapper className="flex-1">
        <View className="mx-6 flex-1 items-center justify-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </View>
      </ScrollableWrapper>
    );
  }

  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 flex flex-col gap-2 space-y-6 pb-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">{greeting}</Text>
          <Text className="text-sm text-muted-foreground">
            {stats.total > 0
              ? `You have ${stats.pending + stats.inProgress} tasks remaining`
              : "Ready to start organizing your homework!"}
          </Text>
        </View>

        <View className="flex flex-row gap-3">
          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex flex-row items-center gap-2">
                <BookOpen size={20} color="#6366f1" />
                <View>
                  <Text className="text-2xl font-bold">{stats.total}</Text>
                  <Text className="text-xs text-muted-foreground">
                    Total Tasks
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex flex-row items-center gap-2">
                <TrendingUp size={20} color="#22c55e" />
                <View>
                  <Text className="text-2xl font-bold">
                    {Math.round(completionRate)}%
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Completed
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completionRate} className="mb-4" />
            <View className="flex flex-row justify-between">
              <View className="items-center">
                <Text className="text-lg font-semibold text-green-500">
                  {stats.completed}
                </Text>
                <Text className="text-xs text-muted-foreground">Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-blue-500">
                  {stats.inProgress}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  In Progress
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-yellow-500">
                  {stats.pending}
                </Text>
                <Text className="text-xs text-muted-foreground">Pending</Text>
              </View>
              <View className="items-center">
                <Text className="text-lg font-semibold text-red-500">
                  {stats.overdue}
                </Text>
                <Text className="text-xs text-muted-foreground">Overdue</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {urgentHomework.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">Urgent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {urgentHomework.slice(0, 3).map((homework) => {
                  const subject = subjectData.find(
                    (s) => s.id === homework.subjectId,
                  );
                  return (
                    <Pressable
                      key={homework.id}
                      className="flex flex-row items-center justify-between rounded-lg bg-secondary p-3"
                      onPress={() => router.push("/tasks")}
                    >
                      <View className="flex-1">
                        <Text className="font-medium">{homework.title}</Text>
                        <Text className="text-xs text-muted-foreground">
                          {subject?.name} • Due:{" "}
                          {homework.dueDate
                            ? new Date(homework.dueDate).toLocaleDateString()
                            : "No due date"}
                        </Text>
                      </View>
                      <View className="h-3 w-3 rounded-full bg-red-500" />
                    </Pressable>
                  );
                })}
              </View>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <View className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Tasks</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => router.push("/tasks")}
              >
                <Text>View All</Text>
              </Button>
            </View>
          </CardHeader>
          <CardContent>
            {upcomingHomework.length > 0 ? (
              <View className="space-y-3">
                {upcomingHomework.map((homework) => {
                  const subject = subjectData.find(
                    (s) => s.id === homework.subjectId,
                  );
                  const daysUntilDue = homework.dueDate
                    ? Math.ceil(
                        (new Date(homework.dueDate).getTime() -
                          new Date().getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                    : null;

                  return (
                    <Pressable
                      key={homework.id}
                      className="flex flex-row items-center justify-between rounded-lg border border-border p-3"
                      onPress={() => router.push("/tasks")}
                    >
                      <View className="flex-1">
                        <Text className="font-medium">{homework.title}</Text>
                        <Text className="text-xs text-muted-foreground">
                          {subject?.name}
                        </Text>
                      </View>
                      <View className="items-end">
                        {daysUntilDue !== null && (
                          <Text
                            className={`text-xs font-medium ${
                              daysUntilDue <= 1
                                ? "text-red-500"
                                : daysUntilDue <= 3
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          >
                            {daysUntilDue === 0
                              ? "Due today"
                              : daysUntilDue === 1
                                ? "Due tomorrow"
                                : `${daysUntilDue} days left`}
                          </Text>
                        )}
                        <View
                          className={`mt-1 h-2 w-2 rounded-full ${
                            homework.priority === "high"
                              ? "bg-red-500"
                              : homework.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View className="items-center py-8">
                <Calendar size={48} color="#6b7280" className="mb-2" />
                <Text className="text-muted-foreground">
                  Start by adding your first homework task!
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onPress={() => router.push("/tasks")}
                >
                  <Text>Add Your First Task</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </ScrollableWrapper>
  );
}
