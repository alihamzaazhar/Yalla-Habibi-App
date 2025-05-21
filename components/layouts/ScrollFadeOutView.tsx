import { useAnimatedScrollView } from "@/contexts/AnimatedScrollViewProvider";
import React, { PropsWithChildren } from "react";
import { View, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useScrollOffset } from "@/contexts/ScrollOffsetProvider";
import { cn } from "@/lib/common/utils";

type Props = {
  className?: string;
};

const HEADER_HEIGHT = 200;
const ScrollFadeOutView = ({
  children,
  className,
}: PropsWithChildren<Props>) => {
  const { scrollOffset } = useScrollOffset();
  const [containerHeight, setContainerHeight] = React.useState<
    number | undefined
  >();
  
  const headerAnimatedStyle = useAnimatedStyle(() => {
    if (!containerHeight) return {};

    const styles = {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, containerHeight],
            [0, -containerHeight],
            Extrapolation.CLAMP
          ),
        },
      ],
      
      // opacity: interpolate(
      //   scrollOffset.value,
      //   [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
      //   [1, 0.5, 0],
      //   Extrapolation.CLAMP
      // ),
    };
    return styles;
  });
  return (
    <Animated.View
      className={cn("bg-white flex-1", className)}
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
      style={[
        {
          paddingHorizontal: 12,
          zIndex: 999,
          height: HEADER_HEIGHT,
        },
        headerAnimatedStyle,
      ]}
    >
      {children}
    </Animated.View>
  );
};

export default ScrollFadeOutView;
