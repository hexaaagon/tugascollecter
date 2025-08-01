import * as React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { BottomNavigation } from "@/components/bottom-navigation";
import { HomeTab } from "@/components/home-tab";
import { HomeworkTab } from "@/components/homework-tab";
import { ProfileTab } from "@/components/profile-tab";
import { HomeworkDetailPage } from "@/components/homework-detail-page";
import { useColorScheme } from "@/lib/useColorScheme";
import { MOCK_HOMEWORK, Homework } from "@/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type PageType = "tab" | "homework-detail";

export default function App() {
  const { isDarkColorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const [homework] = React.useState<Homework[]>(MOCK_HOMEWORK);
  const [currentTab, setCurrentTab] = React.useState("home");
  const [previousTab, setPreviousTab] = React.useState("home");
  const [currentPage, setCurrentPage] = React.useState<PageType>("tab");
  const [selectedHomework, setSelectedHomework] =
    React.useState<Homework | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Animation values for smooth page transitions
  const pageOpacity = useSharedValue(1);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  // Calculate header padding based on safe area for placeholder screens
  const headerPaddingTop = Math.max(insets.top, 16);

  const handleHomeworkPress = React.useCallback(
    (homework: Homework) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Create worklet-safe functions
      const navigateToDetailSafely = () => {
        setSelectedHomework(homework);
        setCurrentPage("homework-detail");
        // Add delay for Expo Go
        setTimeout(() => {
          pageOpacity.value = withTiming(1, { duration: 200 });
          setIsTransitioning(false);
        }, 50);
      };

      // Slower fade out for Expo Go
      pageOpacity.value = withTiming(0.1, { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(navigateToDetailSafely)();
        }
      });
    },
    [isTransitioning, pageOpacity]
  );

  const handleAddHomework = React.useCallback(() => {
    console.log("Add homework");
  }, []);

  // Alternative: Simple React-based transitions (better for Expo Go)
  const handleTabChangeSimple = React.useCallback(
    (tab: string) => {
      if (tab === currentTab || isTransitioning) return;

      setIsTransitioning(true);
      setPreviousTab(currentTab);

      // Simple fade out using React state
      pageOpacity.value = withTiming(0.2, { duration: 250 });

      // Change tab after a short delay
      setTimeout(() => {
        setCurrentTab(tab);
        // Fade back in
        setTimeout(() => {
          pageOpacity.value = withTiming(1, { duration: 250 });
          setIsTransitioning(false);
        }, 100); // Give React time to render new content
      }, 250);
    },
    [currentTab, isTransitioning, pageOpacity]
  );

  const navigateToHome = React.useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Create worklet-safe functions
    const navigateHomeSafely = () => {
      setCurrentPage("tab");
      setSelectedHomework(null);
      if (currentTab !== "home") {
        setPreviousTab(currentTab);
        setCurrentTab("home");
      }
      // Add delay for Expo Go
      setTimeout(() => {
        pageOpacity.value = withTiming(1, { duration: 200 });
        setIsTransitioning(false);
      }, 50);
    };

    // Slower fade out for Expo Go
    pageOpacity.value = withTiming(0.1, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(navigateHomeSafely)();
      }
    });
  }, [currentTab, isTransitioning, pageOpacity]);

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // Animated style for smooth page transitions
  const animatedPageStyle = useAnimatedStyle(() => ({
    opacity: pageOpacity.value,
  }));

  // Render homework detail page with fade animation
  if (currentPage === "homework-detail" && selectedHomework) {
    return (
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
        className="flex-1"
      >
        <HomeworkDetailPage
          homework={selectedHomework}
          onBack={navigateToHome}
          onEdit={(hw) => console.log("Edit homework:", hw.id)}
          onDelete={(hw) => console.log("Delete homework:", hw.id)}
          onToggleComplete={(hw) => console.log("Toggle complete:", hw.id)}
        />
      </Animated.View>
    );
  }

  // Memoized tab content to prevent unnecessary re-renders
  const TabContent = React.useMemo(() => {
    switch (currentTab) {
      case "home":
        return (
          <HomeTab
            homework={homework}
            onHomeworkPress={handleHomeworkPress}
            onAddHomework={handleAddHomework}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );

      case "homework":
        return (
          <HomeworkTab
            homework={homework}
            onHomeworkPress={handleHomeworkPress}
            onAddHomework={handleAddHomework}
          />
        );

      case "calendar":
        return (
          <View className="flex-1 bg-background">
            <View
              className="px-6 py-4"
              style={{ paddingTop: headerPaddingTop }}
            >
              <Text className="text-2xl font-bold">Calendar</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg text-muted-foreground">
                Calendar Tab - Coming Soon
              </Text>
            </View>
          </View>
        );

      case "notifications":
        return (
          <View className="flex-1 bg-background">
            <View
              className="px-6 py-4"
              style={{ paddingTop: headerPaddingTop }}
            >
              <Text className="text-2xl font-bold">Notifications</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text className="text-lg text-muted-foreground">
                Notifications Tab - Coming Soon
              </Text>
            </View>
          </View>
        );

      case "profile":
        return <ProfileTab />;

      default:
        return (
          <View className="flex-1 bg-background items-center justify-center">
            <Text className="text-lg">Tab not found</Text>
          </View>
        );
    }
  }, [
    currentTab,
    homework,
    handleHomeworkPress,
    handleAddHomework,
    handleRefresh,
    refreshing,
  ]);

  return (
    <View className="flex-1 bg-background">
      <Animated.View style={[{ flex: 1 }, animatedPageStyle]}>
        {TabContent}
      </Animated.View>
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={handleTabChangeSimple}
      />
    </View>
  );
}
