import { View, Pressable, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeworkForm } from "@/components/homework-form";
import { SubjectManager } from "@/components/subject-manager";
import { useState, useEffect } from "react";
import { StorageManager } from "@/lib/storage";
import { HomeworkData, SubjectData } from "@/shared/types/storage";
import {
  Plus,
  Filter,
  Calendar,
  Clock,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  X,
  Edit,
  Settings,
} from "lucide-react-native";

type FilterType = "all" | "pending" | "in-progress" | "completed" | "overdue";
type SortType = "dueDate" | "priority" | "subject" | "status";

export default function Tasks() {
  const [homeworkData, setHomeworkData] = useState<HomeworkData[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("dueDate");
  const [showFilters, setShowFilters] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [editingHomework, setEditingHomework] = useState<HomeworkData | null>(
    null,
  );

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

  const filteredHomework = homeworkData
    .filter((homework) => {
      if (filter === "all") return true;
      return homework.status === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          const aHasDeadline = Boolean(a.dueDate);
          const bHasDeadline = Boolean(b.dueDate);

          if (!aHasDeadline && !bHasDeadline) {
            return parseInt(b.id) - parseInt(a.id);
          }
          if (!aHasDeadline && bHasDeadline) return 1;
          if (aHasDeadline && !bHasDeadline) return -1;

          return (
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
          );
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "subject":
          const subjectA =
            subjectData.find((s) => s.id === a.subjectId)?.name || "";
          const subjectB =
            subjectData.find((s) => s.id === b.subjectId)?.name || "";
          return subjectA.localeCompare(subjectB);
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const updateHomeworkStatus = async (
    id: string,
    status: HomeworkData["status"],
  ) => {
    try {
      const updateData: Partial<HomeworkData> = { status };

      // Set completedAt timestamp when marking as completed
      if (status === "completed") {
        updateData.completedAt = new Date().toISOString();
      } else {
        // Clear completedAt if changing from completed to another status
        updateData.completedAt = undefined;
      }

      await StorageManager.updateHomework(id, updateData);
      setHomeworkData((prev) =>
        prev.map((h) => (h.id === id ? { ...h, ...updateData } : h)),
      );
    } catch (error) {
      console.error("Error updating homework status:", error);
      Alert.alert("Error", "Failed to update task status");
    }
  };

  const deleteHomework = async (id: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await StorageManager.deleteHomework(id);
            setHomeworkData((prev) => prev.filter((h) => h.id !== id));
          } catch (error) {
            console.error("Error deleting homework:", error);
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

  const handleHomeworkSave = (homework: HomeworkData) => {
    if (editingHomework) {
      setHomeworkData((prev) =>
        prev.map((h) => (h.id === homework.id ? homework : h)),
      );
    } else {
      setHomeworkData((prev) => [...prev, homework]);
    }
    setEditingHomework(null);
  };

  const handleSubjectUpdate = async () => {
    try {
      const subjects = await StorageManager.getSubjects();
      setSubjectData(subjects);
    } catch (error) {
      console.error("Error updating subjects:", error);
    }
  };

  const editHomework = (homework: HomeworkData) => {
    setEditingHomework(homework);
    setShowHomeworkForm(true);
  };

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

  const getStatusIcon = (status: HomeworkData["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} color="#22c55e" />;
      case "in-progress":
        return <PlayCircle size={16} color="#3b82f6" />;
      case "overdue":
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const filterCounts = {
    all: homeworkData.length,
    pending: homeworkData.filter((h) => h.status === "pending").length,
    "in-progress": homeworkData.filter((h) => h.status === "in-progress")
      .length,
    completed: homeworkData.filter((h) => h.status === "completed").length,
    overdue: homeworkData.filter((h) => h.status === "overdue").length,
  };

  if (loading) {
    return (
      <ScrollableWrapper className="flex-1">
        <View className="mx-6 flex-1 items-center justify-center">
          <Text className="text-lg text-muted-foreground">
            Loading tasks...
          </Text>
        </View>
      </ScrollableWrapper>
    );
  }

  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 space-y-6 pb-6">
        <View className="flex flex-row items-center justify-between py-4">
          <View>
            <Text className="text-2xl font-bold">Tasks</Text>
            <Text className="text-sm text-muted-foreground">
              {filteredHomework.length} of {homeworkData.length} tasks
            </Text>
          </View>
          <View className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="icon"
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} color="#6b7280" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onPress={() => setShowSubjectManager(true)}
            >
              <Settings size={16} color="#6b7280" />
            </Button>
            <Button size="icon" onPress={() => setShowHomeworkForm(true)}>
              <Plus size={16} color="#000000" />
            </Button>
          </View>
        </View>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <Text className="mb-3 font-medium">Filter by Status</Text>
              <View className="mb-4 flex flex-row flex-wrap gap-2">
                {(
                  [
                    "all",
                    "pending",
                    "in-progress",
                    "completed",
                    "overdue",
                  ] as FilterType[]
                ).map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => setFilter(status)}
                    className={`rounded-full px-3 py-2 ${
                      filter === status ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-xs capitalize ${
                        filter === status
                          ? "text-primary-foreground"
                          : "text-secondary-foreground"
                      }`}
                    >
                      {status} ({filterCounts[status]})
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="mb-3 font-medium">Sort by</Text>
              <View className="flex flex-row flex-wrap gap-2">
                {(
                  ["dueDate", "priority", "subject", "status"] as SortType[]
                ).map((sort) => (
                  <Pressable
                    key={sort}
                    onPress={() => setSortBy(sort)}
                    className={`rounded-full px-3 py-2 ${
                      sortBy === sort ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <Text
                      className={`text-xs capitalize ${
                        sortBy === sort
                          ? "text-primary-foreground"
                          : "text-secondary-foreground"
                      }`}
                    >
                      {sort === "dueDate" ? "Due Date" : sort}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {filteredHomework.length > 0 ? (
          <View className="flex flex-col gap-2 space-y-3">
            {filteredHomework.map((homework) => {
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
                <Card key={homework.id}>
                  <CardContent className="p-4">
                    <View className="flex flex-row items-start justify-between">
                      <View className="flex-1">
                        <View className="mb-2 flex flex-row items-center gap-2">
                          <View
                            className={`h-3 w-3 rounded-full ${getPriorityColor(homework.priority)}`}
                          />
                          <Text className="flex-1 font-medium">
                            {homework.title}
                          </Text>
                          {getStatusIcon(homework.status)}
                        </View>

                        {homework.description && (
                          <Text className="mb-2 text-sm text-muted-foreground">
                            {homework.description}
                          </Text>
                        )}

                        <View className="mb-3 flex flex-row items-center gap-4">
                          {subject && (
                            <View className="flex flex-row items-center gap-1">
                              <BookOpen size={12} color="#6b7280" />
                              <View
                                className="ml-1 h-2 w-2 rounded-full"
                                style={{ backgroundColor: subject.color }}
                              />
                              <Text className="text-xs text-muted-foreground">
                                {subject.name}
                              </Text>
                            </View>
                          )}

                          {homework.dueDate && (
                            <View className="flex flex-row items-center gap-1">
                              <Calendar size={12} color="#6b7280" />
                              <Text
                                className={`text-xs ${
                                  daysUntilDue !== null && daysUntilDue <= 1
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {daysUntilDue === 0
                                  ? "Due today"
                                  : daysUntilDue === 1
                                    ? "Due tomorrow"
                                    : daysUntilDue && daysUntilDue > 0
                                      ? `${daysUntilDue} days left`
                                      : new Date(
                                          homework.dueDate,
                                        ).toLocaleDateString()}
                              </Text>
                            </View>
                          )}
                        </View>

                        {homework.tags && homework.tags.length > 0 && (
                          <View className="mb-3 flex flex-row flex-wrap gap-1">
                            {homework.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </View>
                        )}

                        <View className="flex flex-row gap-2">
                          {homework.status !== "completed" && (
                            <>
                              {homework.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onPress={() =>
                                    updateHomeworkStatus(
                                      homework.id,
                                      "in-progress",
                                    )
                                  }
                                >
                                  <Text className="text-xs">Start</Text>
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onPress={() =>
                                  updateHomeworkStatus(homework.id, "completed")
                                }
                              >
                                <Text className="text-xs">Complete</Text>
                              </Button>
                            </>
                          )}
                          {homework.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() =>
                                updateHomeworkStatus(homework.id, "pending")
                              }
                            >
                              <Text className="text-xs">Reopen</Text>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => editHomework(homework)}
                          >
                            <Edit size={12} color="#6b7280" />
                          </Button>
                          <Button
                            size="sm"
                            onPress={() => deleteHomework(homework.id)}
                          >
                            <X size={12} color="#ef4444" />
                          </Button>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <CardContent className="items-center py-12">
              <BookOpen size={48} color="#6b7280" className="mb-4" />
              <Text className="mb-2 text-lg font-medium">No tasks found</Text>
              <Text className="mb-4 text-center text-sm text-muted-foreground">
                {filter === "all"
                  ? "Ready to get organized? Add your homework assignments here!"
                  : `No tasks with status "${filter}".`}
              </Text>
              <Button onPress={() => setShowHomeworkForm(true)}>
                <Text>Add New Task</Text>
              </Button>
            </CardContent>
          </Card>
        )}

        <View className="pb-6" />
      </View>

      <HomeworkForm
        visible={showHomeworkForm}
        onClose={() => {
          setShowHomeworkForm(false);
          setEditingHomework(null);
        }}
        onSave={handleHomeworkSave}
        editingHomework={editingHomework}
      />

      <SubjectManager
        visible={showSubjectManager}
        onClose={() => setShowSubjectManager(false)}
        onUpdate={handleSubjectUpdate}
      />
    </ScrollableWrapper>
  );
}
