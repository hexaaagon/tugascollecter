import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { getGreeting } from "@/lib/greeting";
import { ScrollableWrapper } from "@/components/scrollable-wrapper";

export default function Home() {
  return (
    <ScrollableWrapper className="flex-1">
      <View className="mx-8 flex-1">
        <Text className="text-2xl font-semibold">{getGreeting()}</Text>

        {/* Add some content to make the page scrollable for testing */}
        <View className="mt-8">
          <Text className="mb-4 text-lg">
            Welcome to your homework tracker!
          </Text>
          <Text className="mb-4">
            Here you can manage all your assignments and stay organized with
            your studies.
          </Text>

          {/* Add filler content to test scrolling */}
          {Array.from({ length: 20 }, (_, i) => (
            <View
              key={i}
              className="mb-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
            >
              <Text className="text-base">Sample content item #{i + 1}</Text>
              <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This is some example content to demonstrate the scrolling
                behavior. When you scroll down, the header should hide, and when
                you scroll up, it should show again.
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollableWrapper>
  );
}
