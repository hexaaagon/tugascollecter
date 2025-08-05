import { useRef, useEffect, useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  throttle?: number;
}

export function useScrollPosition(
  effect: ({
    prevPos,
    currPos,
  }: {
    prevPos: ScrollPosition;
    currPos: ScrollPosition;
  }) => void,
  deps: any[] = [],
  options: UseScrollPositionOptions = {},
) {
  const position = useRef<ScrollPosition>({ x: 0, y: 0 });
  const throttleTimeout = useRef<any>(null);
  const { throttle = 16 } = options;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currPos: ScrollPosition = {
      x: event.nativeEvent.contentOffset.x,
      y: event.nativeEvent.contentOffset.y,
    };

    const callback = () => {
      effect({ prevPos: position.current, currPos });
      position.current = currPos;
      throttleTimeout.current = null;
    };

    if (throttle > 0) {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(callback, throttle);
      }
    } else {
      callback();
    }
  };

  useEffect(() => {
    return () => {
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, []);

  return handleScroll;
}
