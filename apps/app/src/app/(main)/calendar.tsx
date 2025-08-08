import { View, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  Zap,
  Settings,
} from "lucide-react-native";

export default function Calendar() {
  const handleJoinBeta = () => {
    Alert.alert(
      "Join Beta Waitlist",
      "Thank you for your interest! You'll be notified when Google Calendar sync becomes available.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join Waitlist",
          onPress: () => {
            Alert.alert(
              "Success!",
              "You've been added to the beta waitlist. We'll notify you when the feature is ready!",
            );
          },
        },
      ],
    );
  };

  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-6 flex flex-col gap-2 space-y-6 pb-6">
        <View className="mb-2">
          <Text className="text-2xl font-bold">Calendar</Text>
          <Text className="text-sm text-muted-foreground">
            Assignment scheduling and Google Calendar sync
          </Text>
        </View>

        <Card>
          <CardContent className="items-center py-12">
            <CalendarIcon size={64} color="#6b7280" className="mb-6" />
            <Text className="mb-2 text-xl font-bold">Coming Soon</Text>
            <Text className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              We're working on Google Calendar synchronization to help you
              manage your homework deadlines more effectively.
            </Text>

            <View className="flex w-full max-w-sm flex-col gap-2 space-y-4">
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <View className="flex flex-row items-center gap-3">
                    <CalendarIcon size={20} color="#3b82f6" />
                    <View className="flex-1">
                      <Text className="font-medium">Google Calendar Sync</Text>
                      <Text className="text-xs text-muted-foreground">
                        Automatically sync homework deadlines
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
                      <Text className="font-medium">Smart Reminders</Text>
                      <Text className="text-xs text-muted-foreground">
                        Get notified before due dates
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
                      <Text className="font-medium">Time Blocking</Text>
                      <Text className="text-xs text-muted-foreground">
                        Schedule dedicated study time
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
            <CardTitle>Available Now</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              While we prepare the calendar integration, you can:
            </Text>

            <View className="space-y-3">
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  View upcoming deadlines in the Tasks section
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  Track progress and completion rates in Statistics
                </Text>
              </View>
              <View className="flex flex-row items-center gap-3">
                <View className="h-1 w-1 rounded-full bg-primary" />
                <Text className="flex-1 text-sm">
                  Organize assignments by priority and subject
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollableWrapper>
  );
}
