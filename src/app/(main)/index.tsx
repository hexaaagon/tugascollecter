import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";
import { getGreeting } from "@/lib/greeting";

export default function Home() {
  const testToast = () => {
    toast.success("Test Toast", {
      description: "This toast should appear above everything!",
    });
  };

  return (
    <View className="mx-8 mt-6 min-h-screen flex-1">
      <Text className="text-2xl font-semibold">{getGreeting()}</Text>
      <View className=""></View>
    </View>
  );
}
