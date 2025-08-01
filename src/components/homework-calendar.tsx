import * as React from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Homework } from "@/lib/types";
import { formatDate } from "@/lib/homework-utils";
import { useColorScheme } from "@/lib/useColorScheme";

interface HomeworkCalendarProps {
  homework: Homework[];
  onDateSelect?: (date: string) => void;
}

export function HomeworkCalendar({
  homework,
  onDateSelect,
}: HomeworkCalendarProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // Create marked dates from homework deadlines
  const markedDates = React.useMemo(() => {
    const marked: { [key: string]: any } = {};

    homework.forEach((item) => {
      if (item.deadline) {
        const dateString = item.deadline.toISOString().split("T")[0];

        if (!marked[dateString]) {
          marked[dateString] = {
            marked: true,
            dots: [],
          };
        }

        // Add color based on priority and due date
        const now = new Date();
        const isOverdue = item.deadline < now;
        const isDueSoon =
          (item.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <=
          3;

        let color = "#3B82F6"; // blue for normal
        if (isOverdue) color = "#EF4444"; // red for overdue
        else if (isDueSoon) color = "#F59E0B"; // yellow for due soon
        else if (item.priority === "high") color = "#DC2626"; // dark red for high priority

        marked[dateString].dots.push({ color });

        // Limit to 3 dots for visual clarity
        if (marked[dateString].dots.length > 3) {
          marked[dateString].dots = marked[dateString].dots.slice(0, 3);
        }
      }
    });

    // Add selection styling if date is selected
    if (selectedDate && marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = isDarkColorScheme
        ? "#1E40AF"
        : "#3B82F6";
    } else if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: isDarkColorScheme ? "#1E40AF" : "#3B82F6",
      };
    }

    return marked;
  }, [homework, selectedDate, isDarkColorScheme]);

  // Get homework for selected date
  const homeworkForSelectedDate = React.useMemo(() => {
    if (!selectedDate) return [];

    return homework.filter((item) => {
      if (!item.deadline) return false;
      const dateString = item.deadline.toISOString().split("T")[0];
      return dateString === selectedDate;
    });
  }, [homework, selectedDate]);

  const handleDatePress = (day: any) => {
    setSelectedDate(day.dateString);
    onDateSelect?.(day.dateString);
  };

  const calendarTheme = {
    backgroundColor: "transparent",
    calendarBackground: "transparent",
    textSectionTitleColor: isDarkColorScheme ? "#9CA3AF" : "#6B7280",
    selectedDayBackgroundColor: isDarkColorScheme ? "#1E40AF" : "#3B82F6",
    selectedDayTextColor: "#ffffff",
    todayTextColor: isDarkColorScheme ? "#3B82F6" : "#1E40AF",
    dayTextColor: isDarkColorScheme ? "#F9FAFB" : "#1F2937",
    textDisabledColor: isDarkColorScheme ? "#4B5563" : "#9CA3AF",
    dotColor: "#3B82F6",
    selectedDotColor: "#ffffff",
    arrowColor: isDarkColorScheme ? "#F9FAFB" : "#1F2937",
    disabledArrowColor: isDarkColorScheme ? "#4B5563" : "#9CA3AF",
    monthTextColor: isDarkColorScheme ? "#F9FAFB" : "#1F2937",
    indicatorColor: isDarkColorScheme ? "#3B82F6" : "#1E40AF",
    textDayFontWeight: "400" as const,
    textMonthFontWeight: "600" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 12,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={handleDatePress}
          theme={calendarTheme}
          firstDay={1} // Start week on Monday
          showWeekNumbers={false}
          hideExtraDays={true}
        />

        {selectedDate && (
          <View className="mt-4 pt-4 border-t border-border">
            <Text className="font-semibold mb-2">
              {formatDate(new Date(selectedDate))}
            </Text>

            {homeworkForSelectedDate.length > 0 ? (
              <View>
                {homeworkForSelectedDate.map((item) => (
                  <View key={item.id} className="mb-2 p-3 bg-muted rounded-lg">
                    <Text className="font-medium">{item.title}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {item.subject}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-muted-foreground">
                No homework due on this date
              </Text>
            )}
          </View>
        )}
      </CardContent>
    </Card>
  );
}
