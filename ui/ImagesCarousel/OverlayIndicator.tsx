import { Theme } from "@/constants";
import React from "react";
import { Text, View } from "react-native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
type Props = {
  currentIndex: number;
  images: Array<string>;
};

const OverlayIndicator = ({ currentIndex, images }: Props) => {

  return (
    <View
      style={{
        position: "absolute",
        bottom: 18,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        width: "100%",
        zIndex: 9999,
        borderRadius: 24,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(1,1,1,0.5)",
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 2,
        }}
      >
        <Text className="text-gray-200 text-sm font-bold">{`${
          currentIndex + 1
        }/${images.length}`}</Text>
      </View>
      <AnimatedDotsCarousel
        length={images.length}
        duration={150}
        scrollableDotsConfig={{
          setIndex: () => {},
          containerBackgroundColor: "red",
          container: {
            alignItems: "center",
            borderRadius: 15,
            height: 20,
            justifyContent: "center",
            paddingHorizontal: 15,
          },
        }}
        currentIndex={currentIndex}
        maxIndicators={2}
        interpolateOpacityAndColor={true}
        activeIndicatorConfig={{
          color: Theme.gray[200],
          margin: 3,
          opacity: 1,
          size: 8,
        }}
        inactiveIndicatorConfig={{
          color: "white",
          margin: 3,
          opacity: 0.5,
          size: 8,
        }}
        decreasingDots={[
          {
            config: { color: "white", margin: 3, opacity: 0.5, size: 6 },
            quantity: 1,
          },
          {
            config: { color: "white", margin: 3, opacity: 0.5, size: 4 },
            quantity: 1,
          },
        ]}
      />
      <View style={{ width: 40 }} />
    </View>
  );
};

export default OverlayIndicator;
