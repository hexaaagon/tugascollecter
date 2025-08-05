import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";

export default function Home() {
  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-8 flex-1">
        <Text className="text-2xl font-semibold">Tasks</Text>

        {/* Add some content to make the page scrollable for testing */}
        <View className="mt-8">
          <Text className="mb-4 text-lg">Your homework assignments</Text>

          {/* Add filler content to test scrolling */}
          {Array.from({ length: 15 }, (_, i) => (
            <View
              key={i}
              className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
            >
              <Text className="text-base font-medium">Assignment #{i + 1}</Text>
              <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Due:{" "}
                {new Date(
                  Date.now() + (i + 1) * 24 * 60 * 60 * 1000,
                ).toLocaleDateString()}
              </Text>
              <Text className="mt-1 text-sm">
                Sample task description for testing the scroll behavior with the
                header.
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollableWrapper>
  );
}
