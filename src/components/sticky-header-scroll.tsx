import React, { useState, useRef } from "react";
import {
  ScrollView,
  ScrollViewProps,
  View,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

interface StickyHeaderScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  onHeaderVisibilityChange?: (visible: boolean) => void;
}

export const StickyHeaderScrollView: React.FC<StickyHeaderScrollViewProps> = ({
  children,
  onHeaderVisibilityChange,
  onScroll,
  ...props
}) => {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const headerVisible = useRef(true);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollingDown = currentScrollY > lastScrollY.current;
    const scrollingUp = currentScrollY < lastScrollY.current;

    // Threshold to prevent constant toggling
    const scrollThreshold = 20;
    const isSignificantScroll =
      Math.abs(currentScrollY - lastScrollY.current) > scrollThreshold;

    if (isSignificantScroll) {
      if (scrollingDown && currentScrollY > 100 && headerVisible.current) {
        // Hide header when scrolling down
        setShowHeader(false);
        headerVisible.current = false;
        onHeaderVisibilityChange?.(false);
      } else if (scrollingUp && !headerVisible.current) {
        // Show header when scrolling up
        setShowHeader(true);
        headerVisible.current = true;
        onHeaderVisibilityChange?.(true);
      }
    }

    lastScrollY.current = currentScrollY;

    // Call the original onScroll handler if provided
    if (onScroll) {
      onScroll(event);
    }
  };

  return (
    <ScrollView
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
};
