import { cn } from "@/lib/common/utils";
import React, { useCallback } from "react";
import { Dimensions, Pressable, Text, View, ViewProps } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import OverlayIndicator from "./OverlayIndicator";
import { Image } from "expo-image";
type Props = {
  images: Array<string>;
  height?: number;
  onImageTapped?: (index: number) => void;
} & AnimatedProps<ViewProps>;

const ImagesCarousel = ({
  images,
  height = 300,
  className,
  ...props
}: Props) => {
  const width = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const renderItem = useCallback(
    ({ index, item }: { item: string; index: number }) => {
      return (
        <Pressable
          key={index}
          className="flex-1"
          onPress={() => props.onImageTapped?.(index)}
        >
          <Image
            source={{ uri: item }}
            style={{ width: "100%", height }}
            contentFit="cover"
          />
        </Pressable>
      );
    },
    [images]
  );
  return (
    <Animated.View className={cn("flex-1 relative", className)} {...props}>
      <Carousel
        loop={Boolean(images.length)}
        width={width}
        height={height}
        data={images}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setCurrentIndex(index)}
        renderItem={renderItem}
      />
      {Boolean(images.length > 1) ? (
        <OverlayIndicator currentIndex={currentIndex} images={images} />
      ) : null}
    </Animated.View>
  );
};

export default ImagesCarousel;
