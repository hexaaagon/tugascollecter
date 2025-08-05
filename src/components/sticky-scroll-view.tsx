import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  ScrollViewProps,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

interface StickyScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  stickyElement?: React.ReactNode;
  onHeaderVisibilityChange?: (visible: boolean) => void;
}

export const StickyScrollView: React.FC<StickyScrollViewProps> = ({
  children,
  stickyElement,
  onHeaderVisibilityChange,
  ...props
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const headerHeight = useRef(0);
  const translateY = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection =
      currentScrollY > lastScrollY.current ? "down" : "up";

    // Only trigger hide/show behavior if scrolled enough
    const scrollThreshold = 10;
    const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);

    if (scrollDiff < scrollThreshold) return;

    if (
      scrollDirection === "down" &&
      currentScrollY > headerHeight.current &&
      isHeaderVisible
    ) {
      // Hide header when scrolling down
      setIsHeaderVisible(false);
      onHeaderVisibilityChange?.(false);
      Animated.timing(translateY, {
        toValue: -headerHeight.current,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (scrollDirection === "up" && !isHeaderVisible) {
      // Show header when scrolling up
      setIsHeaderVisible(true);
      onHeaderVisibilityChange?.(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  return (
    <View style={{ flex: 1 }}>
      {stickyElement && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            transform: [{ translateY }],
          }}
          onLayout={(event) => {
            headerHeight.current = event.nativeEvent.layout.height;
          }}
        >
          {stickyElement}
        </Animated.View>
      )}

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: headerHeight.current || 0,
        }}
        {...props}
      >
        {children}
      </ScrollView>
    </View>
  );
};
