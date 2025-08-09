import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useScroll } from "@/app/(main)/_layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScrollableWrapperProps extends ScrollViewProps {
  children: React.ReactNode;
  noPaddingTop?: boolean;
}

export const ScrollableWrapper: React.FC<ScrollableWrapperProps> = ({
  children,
  onScroll,
  contentContainerStyle,
  noPaddingTop = false,
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
        { paddingTop: noPaddingTop ? "auto" : headerHeight },
        contentContainerStyle,
      ]}
      {...props}
    >
      {children}
    </ScrollView>
  );
};
