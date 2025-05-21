import { cn } from "@/lib/common/utils";
import React, { useEffect, useLayoutEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
type Props = {
  className?: string;
};
const DELAY = 200;
const DURATION = 500;
const MAX_OFFSET = 2;

const LoadingDots = ({ className }: Props) => {
  const offsets1 = useSharedValue(0);
  const offsets2 = useSharedValue(0);
  const offsets3 = useSharedValue(0);

  useEffect(() => {
    offsets1.value = withDelay(
      0 * DELAY,
      withRepeat(
        withSequence(
          withTiming(-MAX_OFFSET, { duration: DURATION }),
          withTiming(MAX_OFFSET, { duration: DURATION })
        ),
        -1,
        true
      )
    );
    offsets2.value = withDelay(
      1 * DELAY,
      withRepeat(
        withSequence(
          withTiming(-MAX_OFFSET, { duration: DURATION }),
          withTiming(MAX_OFFSET, { duration: DURATION })
        ),
        -1,
        true
      )
    );
    offsets3.value = withDelay(
      2 * DELAY,
      withRepeat(
        withSequence(
          withTiming(-MAX_OFFSET, { duration: DURATION }),
          withTiming(MAX_OFFSET, { duration: DURATION })
        ),
        -1,
        true
      )
    );
  }, []);
  return (
    <Animated.View className={"flex-row gap-1.5"}>
      <Animated.View
        className={cn("w-2.5 h-2.5 bg-white rounded-full", className)}
        style={[{ transform: [{ translateY: offsets1 }] }]}
      />
      <Animated.View
        className={cn("w-2.5 h-2.5 bg-white rounded-full", className)}
        style={[{ transform: [{ translateY: offsets2 }] }]}
      />
      <Animated.View
        className={cn("w-2.5 h-2.5 bg-white rounded-full", className)}
        style={[{ transform: [{ translateY: offsets3 }] }]}
      />
    </Animated.View>
  );
};

export default LoadingDots;
