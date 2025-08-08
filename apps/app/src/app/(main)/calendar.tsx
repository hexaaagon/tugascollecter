import { View, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language";
import {
  Calendar as CalendarIcon,
  Clock,
  Zap,
  Settings,
} from "lucide-react-native";

export default function Calendar() {
  const { t } = useLanguage();
  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 flex flex-col gap-2 space-y-6 pb-6">
        <View className="mb-2">
          <Text className="text-2xl font-bold">{t("calendar")}</Text>
          <Text className="text-sm text-muted-foreground">
            {t("assignmentSchedulingAndSync")}
          </Text>
        </View>

        <Card>
          <CardContent className="items-center py-12">
            <CalendarIcon size={64} color="#6b7280" className="mb-6" />
            <Text className="mb-2 text-xl font-bold">{t("comingSoon")}</Text>
            <Text className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              {t("calendarSyncDescription")}
            </Text>

            <View className="flex w-full max-w-sm flex-col gap-2 space-y-4">
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3">
                    <CalendarIcon size={20} color="#3b82f6" />
                    <View className="flex-1">
                      <Text className="font-medium">{t("calendarSync")}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {t("automaticallySyncHomeworkDeadlines")}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3">
                    <Clock size={20} color="#22c55e" />
                    <View className="flex-1">
                      <Text className="font-medium">{t("smartReminders")}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {t("getNotifiedBeforeDueDates")}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3">
                    <Zap size={20} color="#eab308" />
                    <View className="flex-1">
                      <Text className="font-medium">{t("timeBlocking")}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {t("scheduleDedicatedStudyTime")}
                      </Text>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("availableNow")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              {t("whileWePreparCalendarIntegration")}
            </Text>

            <View className="space-y-3">
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  {t("viewUpcomingDeadlinesInTasks")}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  {t("trackProgressInStatistics")}
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  {t("organizeAssignmentsByPriority")}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollableWrapper>
  );
}
