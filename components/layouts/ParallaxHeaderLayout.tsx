import { useAnimatedScrollView } from "@/contexts/AnimatedScrollViewProvider";
import React, { PropsWithChildren } from "react";
import { View, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import BackIcon from "../shared/BackIcon";

type Props = {
  title: string;
  rightIcon?: React.ReactElement;
};

const HEADER_HEIGHT = 80;
const ParallaxHeaderLayout = ({
  children,
  title,
  rightIcon = <View style={{ width: 16, height: 16 }} />,
}: PropsWithChildren<Props>) => {
  const { scrollOffset } = useAnimatedScrollView();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <Animated.View
        className="bg-white flex-row items-center justify-between"
        style={[
          {
            paddingHorizontal: 12,
            zIndex: 999,
            height: HEADER_HEIGHT,
          },
          headerAnimatedStyle,
        ]}
      >
        <View>
          <BackIcon />
        </View>
        <Text className="text-2xl font-bold">{title}</Text>
        <View>{rightIcon}</View>
      </Animated.View>
      {children}
    </SafeAreaView>
  );
};

export default ParallaxHeaderLayout;
