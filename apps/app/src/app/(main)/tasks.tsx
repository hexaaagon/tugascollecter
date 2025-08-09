import { View, Pressable, Alert, ActivityIndicator } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HomeworkForm } from "@/components/dialogs/homework-form";
import { SubjectManager } from "@/components/subject-manager";
import { AttachmentViewer } from "@/components/attachment-viewer";
import { HomeworkDetailDialog } from "../../components/dialogs/homework-detail";
import { useState, useEffect, Suspense, lazy } from "react";
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
  Paperclip,
  Loader2,
  Rewind,
} from "lucide-react-native";
import { useLanguage } from "@/lib/language";
import { useColorScheme } from "@/lib/useColorScheme";

// Lazy load the attachment viewer for better performance
const LazyAttachmentViewer = lazy(() =>
  import("@/components/attachment-viewer").then((module) => ({
    default: module.AttachmentViewer,
  })),
);

// Loading fallback component for attachments
const AttachmentLoadingFallback = () => {
  const { t } = useLanguage();
  return (
    <View className="mt-3 flex flex-row items-center gap-2 border-t border-border pt-3">
      <ActivityIndicator size="small" color="#6b7280" />
      <Text className="text-xs text-muted-foreground">
        {t("loadingAttachments")}
      </Text>
    </View>
  );
};

type FilterType = "all" | "pending" | "in-progress" | "completed" | "overdue";
type SortType = "dueDate" | "priority" | "subject" | "status";

export default function Tasks() {
  const { t } = useLanguage();
  const [homeworkData, setHomeworkData] = useState<HomeworkData[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [attachmentLoading, setAttachmentLoading] = useState<Set<string>>(
    new Set(),
  );
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("dueDate");
  const [showFilters, setShowFilters] = useState(false);
  const [showHomeworkForm, setShowHomeworkForm] = useState(false);
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [showHomeworkDetail, setShowHomeworkDetail] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkData | null>(
    null,
  );
  const [editingHomework, setEditingHomework] = useState<HomeworkData | null>(
    null,
  );

  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load core data first (homework and subjects)
        const [homework, subjects] = await Promise.all([
          StorageManager.getHomework(),
          StorageManager.getSubjects(),
        ]);

        // Set the basic data immediately
        setHomeworkData(homework);
        setSubjectData(subjects);

        setLoading(false);

        // Then load attachment metadata in background (don't block UI)
        if (homework.length > 0) {
          const homeworkWithAttachments = homework.filter(
            (h) => h.attachments && h.attachments.length > 0,
          );

          // Pre-load attachment metadata for better UX
          for (const hw of homeworkWithAttachments) {
            setAttachmentLoading((prev) => new Set(prev).add(hw.id));

            // Simulate async attachment loading (replace with actual logic if needed)
            setTimeout(() => {
              setAttachmentLoading((prev) => {
                const newSet = new Set(prev);
                newSet.delete(hw.id);
                return newSet;
              });
            }, 500);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
      if (a.status === "completed" && b.status !== "completed") return 1;
      if (b.status === "completed" && a.status !== "completed") return -1;
      if (a.status === "completed" && b.status === "completed") {
        const aCompletedAt = a.completedAt
          ? new Date(a.completedAt).getTime()
          : 0;
        const bCompletedAt = b.completedAt
          ? new Date(b.completedAt).getTime()
          : 0;
        return bCompletedAt - aCompletedAt;
      }

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

  const handleHomeworkDelete = (deletedId: string) => {
    setHomeworkData((prev) => prev.filter((h) => h.id !== deletedId));
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

  const viewHomeworkDetail = (homework: HomeworkData) => {
    setSelectedHomework(homework);
    setShowHomeworkDetail(true);
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
        <View className="mx-6 flex-1 items-center justify-center space-y-4">
          {/* Loading Animation */}
          <View className="mb-6 items-center">
            <View className="mb-4 rounded-full bg-primary/10 p-8">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
            {/* Animated Loading Text */}
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-lg font-medium text-foreground">
                Loading Tasks
              </Text>
            </View>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              Fetching your homework assignments...
            </Text>
          </View>

          {/* Loading Progress Indicators */}
          <View className="flex w-full max-w-xs flex-col gap-1">
            <View className="flex flex-row items-center gap-2">
              <View className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <Text className="text-xs text-muted-foreground">
                {t("loadingHomeworkData")}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <View className="h-2 w-2 animate-pulse rounded-full bg-primary/60" />
              <Text className="text-xs text-muted-foreground">
                {t("loadingSubjects")}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-2">
              <View className="h-2 w-2 animate-pulse rounded-full bg-primary/30" />
              <Text className="text-xs text-muted-foreground">
                {t("organizingTasks")}
              </Text>
            </View>
          </View>

          {/* Performance Tip */}
          <View className="mt-4 rounded-lg bg-muted/20 p-3">
            <Text className="text-center text-xs text-muted-foreground">
              💡 {t("performanceTip")}
            </Text>
          </View>

          {/* Loading skeleton cards */}
          <View className="mt-8 flex w-full flex-col gap-3">
            {[1, 2].map((i) => (
              <Card key={i} className="opacity-60">
                <CardContent className="p-4">
                  <View className="flex flex-row items-start justify-between">
                    <View className="flex-1">
                      <View>
                        {/* Title row skeleton - matches homework card structure */}
                        <View className="mb-2 flex flex-row items-center gap-2">
                          <View className="h-3 w-3 animate-pulse rounded-full bg-muted" />
                          <View className="mr-8 h-4 flex-1 animate-pulse rounded bg-muted" />
                          <View className="h-4 w-4 animate-pulse rounded bg-muted" />
                        </View>

                        {/* Description skeleton */}
                        <View className="mb-2 h-3 w-4/5 animate-pulse rounded bg-muted" />

                        {/* Metadata row skeleton - subject and due date */}
                        <View className="mb-3 flex flex-row items-center gap-4">
                          {/* Subject skeleton */}
                          <View className="flex flex-row items-center gap-1">
                            <View className="h-3 w-3 animate-pulse rounded bg-muted" />
                            <View className="ml-1 h-2 w-2 animate-pulse rounded-full bg-muted" />
                            <View className="h-3 w-16 animate-pulse rounded bg-muted" />
                          </View>
                          {/* Due date skeleton */}
                          <View className="flex flex-row items-center gap-1">
                            <View className="h-3 w-3 animate-pulse rounded bg-muted" />
                            <View className="h-3 w-20 animate-pulse rounded bg-muted" />
                          </View>
                        </View>

                        {/* Tags skeleton */}
                        <View className="mb-3 flex flex-row flex-wrap gap-1">
                          <View className="h-5 w-12 animate-pulse rounded-full bg-muted" />
                          <View className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                        </View>
                      </View>

                      {/* Action buttons skeleton */}
                      <View className="flex flex-row gap-2">
                        <View className="h-8 w-24 animate-pulse rounded bg-muted" />
                        <View className="h-8 w-16 animate-pulse rounded bg-muted" />
                        <View className="h-8 w-8 animate-pulse rounded bg-muted" />
                      </View>

                      {/* Attachment skeleton */}
                      {i === 2 && (
                        <View className="mt-3 flex flex-row gap-2 border-t border-border pt-3">
                          <View className="h-3 w-3 animate-pulse rounded bg-muted" />
                          <View className="h-3 w-20 animate-pulse rounded bg-muted" />
                        </View>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        </View>
      </ScrollableWrapper>
    );
  }

  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 space-y-6 pb-6">
        <View className="flex flex-row items-center justify-between py-4">
          <View>
            <Text className="text-2xl font-bold">{t("tasks")}</Text>
            <Text className="text-sm text-muted-foreground">
              {t("tasksCount", {
                count: filteredHomework.length,
                total: homeworkData.length,
              })}
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
              <Plus
                size={16}
                color={isDarkColorScheme ? "#000000" : "#ffffff"}
              />
            </Button>
          </View>
        </View>

        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <Text className="mb-3 font-medium">{t("filterByStatus")}</Text>
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
                      {t(`filterOptions.${status}`)} ({filterCounts[status]})
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="mb-3 font-medium">{t("sortBy")}</Text>
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
                      {t(`sortOptions.${sort}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </CardContent>
          </Card>
        )}

        {filteredHomework.length > 0 ? (
          <View className="flex flex-col gap-2 space-y-3">
            {(() => {
              // Separate completed and uncompleted tasks
              const uncompletedTasks = filteredHomework.filter(
                (homework) => homework.status !== "completed",
              );
              const completedTasks = filteredHomework.filter(
                (homework) => homework.status === "completed",
              );

              const renderHomeworkCard = (homework: HomeworkData) => {
                const subject = subjectData.find(
                  (s) => s.id === homework.subjectId,
                );
                const daysUntilDue = homework.dueDate
                  ? (() => {
                      // Normalize dates to compare only the date part (ignoring time)
                      const dueDate = new Date(homework.dueDate);
                      const today = new Date();

                      // Set both dates to start of day for accurate comparison
                      dueDate.setHours(0, 0, 0, 0);
                      today.setHours(0, 0, 0, 0);

                      return Math.ceil(
                        (dueDate.getTime() - today.getTime()) /
                          (1000 * 60 * 60 * 24),
                      );
                    })()
                  : null;

                return (
                  <Card key={homework.id}>
                    <CardContent className="p-4">
                      <View className="flex flex-row items-start justify-between">
                        <Pressable
                          className="flex-1"
                          onPress={() => viewHomeworkDetail(homework)}
                        >
                          <View>
                            <View className="mb-2 flex flex-row items-center gap-2">
                              <View
                                className={`h-3 w-3 rounded-full ${getPriorityColor(homework.priority)}`}
                              />
                              <Text className="mr-8 line-clamp-1 flex-1 font-medium">
                                {homework.title}
                              </Text>
                              {getStatusIcon(homework.status)}
                            </View>

                            {homework.description && (
                              <Text className="mb-2 text-sm text-muted-foreground">
                                {homework.description.split("\n").length > 1
                                  ? `${homework.description.split("\n")[0]}...`
                                  : homework.description.length > 40
                                    ? `${homework.description.slice(0, 40)}...`
                                    : homework.description}
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
                                      daysUntilDue !== null &&
                                      daysUntilDue <= 1 &&
                                      homework.status !== "completed"
                                        ? "text-red-500"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {daysUntilDue === 0
                                      ? t("dueToday")
                                      : daysUntilDue === 1
                                        ? t("dueTomorrow")
                                        : daysUntilDue && daysUntilDue > 0
                                          ? t("daysLeft", {
                                              days: daysUntilDue,
                                            })
                                          : new Date(
                                              homework.dueDate,
                                            ).toLocaleDateString()}
                                  </Text>
                                </View>
                              )}
                            </View>

                            {homework.tags && homework.tags.length > 0 && (
                              <View className="mb-3 flex flex-row flex-wrap gap-1">
                                {homework.tags.map((tag: string) => (
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
                          </View>

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
                                    className="flex flex-row items-center gap-2"
                                  >
                                    <PlayCircle size={16} color="#2563eb" />

                                    <Text className="text-xs">
                                      {t("startWorking")}
                                    </Text>
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  onPress={() =>
                                    updateHomeworkStatus(
                                      homework.id,
                                      "completed",
                                    )
                                  }
                                  className="flex flex-row items-center gap-2"
                                >
                                  <CheckCircle2 size={16} color="#22c55e" />
                                  <Text className="text-xs">
                                    {t("markCompleted")}
                                  </Text>
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
                                className="flex flex-row items-center gap-2"
                              >
                                <Rewind size={16} color="#6b7280" />
                                <Text className="text-xs">
                                  {t("markPending")}
                                </Text>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => editHomework(homework)}
                            >
                              <Edit size={12} color="#6b7280" />
                            </Button>
                          </View>

                          {homework.attachments &&
                            homework.attachments.length > 0 && (
                              <View className="mt-3 flex flex-row gap-2 border-t border-border pt-3">
                                {attachmentLoading.has(homework.id) ? (
                                  <Suspense
                                    fallback={<AttachmentLoadingFallback />}
                                  >
                                    <View className="flex flex-row items-center gap-2">
                                      <ActivityIndicator
                                        size="small"
                                        color="#6b7280"
                                      />
                                      <Text className="text-xs text-muted-foreground">
                                        {t("loadingAttachments")}
                                      </Text>
                                    </View>
                                  </Suspense>
                                ) : (
                                  <>
                                    <Paperclip
                                      color={
                                        isDarkColorScheme
                                          ? "#ffffff"
                                          : "#000000"
                                      }
                                      size={12}
                                    />
                                    <Text className="text-xs text-muted-foreground">
                                      {homework.attachments.length} attachment
                                      {homework.attachments.length > 1
                                        ? "s"
                                        : ""}
                                    </Text>
                                  </>
                                )}
                              </View>
                            )}
                        </Pressable>
                      </View>
                    </CardContent>
                  </Card>
                );
              };

              return (
                <>
                  {/* Render uncompleted tasks first */}
                  {uncompletedTasks.map(renderHomeworkCard)}

                  {/* Separator between uncompleted and completed tasks */}
                  {uncompletedTasks.length > 0 && completedTasks.length > 0 && (
                    <View className="my-6 flex flex-row items-center">
                      <View className="flex-1 border-t border-border" />
                      <View className="mx-4 flex flex-row items-center gap-2 rounded-full bg-muted px-4 py-2">
                        <CheckCircle2 size={14} color="#22c55e" />
                        <Text className="text-sm font-medium text-muted-foreground">
                          {t("completedTasks", {
                            count: completedTasks.length,
                          })}
                        </Text>
                      </View>
                      <View className="flex-1 border-t border-border" />
                    </View>
                  )}

                  {/* Render completed tasks */}
                  {completedTasks.map(renderHomeworkCard)}
                </>
              );
            })()}
          </View>
        ) : (
          <Card>
            <CardContent className="items-center py-12">
              <BookOpen size={48} color="#6b7280" className="mb-4" />
              <Text className="mb-2 text-lg font-medium">
                {t("noTasksFound")}
              </Text>
              <Text className="mb-4 text-center text-sm text-muted-foreground">
                {filter === "all"
                  ? t("createYourFirstTask")
                  : `No tasks with status "${t(`filterOptions.${filter}`)}".`}
              </Text>
              <Button onPress={() => setShowHomeworkForm(true)}>
                <Text>{t("addTask")}</Text>
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

      <HomeworkDetailDialog
        visible={showHomeworkDetail}
        homework={selectedHomework}
        subjects={subjectData}
        onClose={() => {
          setShowHomeworkDetail(false);
          setSelectedHomework(null);
        }}
        onEdit={editHomework}
        onStatusUpdate={updateHomeworkStatus}
        onDelete={handleHomeworkDelete}
      />
    </ScrollableWrapper>
  );
}
