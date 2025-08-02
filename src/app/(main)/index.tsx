import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { toast } from "sonner-native";

export default function Home() {
  const testToast = () => {
    toast.success("Test Toast", {
      description: "This toast should appear above everything!",
    });
  };

  return (
    <View className="min-h-screen flex-1 items-center justify-center gap-4 pt-10">
      <Text>hello world!</Text>
      <Button onPress={testToast}>
        <Text>Test Toast</Text>
      </Button>
    </View>
  );
}
