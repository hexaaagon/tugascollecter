import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useScroll } from "@/app/(main)/_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScrollableWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const ScrollableWrapper: React.FC<ScrollableWrapperProps> = ({
  children,
  onScroll,
  contentContainerStyle,
  ...props
}) => {
  const { handleScroll } = useScroll();
  const insets = useSafeAreaInsets();

  const combinedScrollHandler = (event: any) => {
    handleScroll(event);

    if (onScroll) {
      onScroll(event);
    }
  };

  const headerHeight = insets.top + 8 + 54 + 12; // top inset + padding + content height + bottom padding

  return (
    <ScrollView
      onScroll={combinedScrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { paddingTop: headerHeight },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};
