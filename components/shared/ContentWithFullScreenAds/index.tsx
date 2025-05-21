import { useAnimatedScrollView } from "@/contexts/AnimatedScrollViewProvider";
import { useScreenDimensions } from "@/lib/hooks/useScreenDimensions";
import { cn } from "@/lib/common/utils";
import React, { PropsWithChildren, useState } from "react";
import { View, Image } from "react-native";
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import useMergedContentWithAds from "./useMergedContentWithAds";

type Props_ = {
  contentsContainerClassName?: string;
  containerRef: AnimatedRef<Animated.ScrollView>;
  containerHeight: number;
  contentElements: React.ReactNode[];
  scrollOffset: SharedValue<number>;
  adElement?: React.ReactNode;
};
const RevealAdsContainer_ = ({
  contentsContainerClassName,
  containerRef,
  containerHeight,
  contentElements,
  scrollOffset,
  adElement,
}: Props_) => {
  const [contentMeasurment, setContentMeasurment] = useState<
    undefined | { height: number; topOffset: number; bottomOffset: number }
  >();
  const adHeight = containerHeight;
  const adTopOffset = contentMeasurment
    ? contentMeasurment.height - adHeight
    : 0;
  const revealInStyles = useAnimatedStyle(() => {
    if (!contentMeasurment) return {};
    const adVisibleAtOffset = contentMeasurment.bottomOffset - containerHeight;
    const returned = {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [0, adVisibleAtOffset, adVisibleAtOffset + adHeight],
            [0, 0, adHeight]
          ),
        },
      ],
    };
    return returned;
  }, [contentMeasurment]);
  return (
    <>
      <Animated.View
        className={cn(contentsContainerClassName, "gap-4")}
        onLayout={(e) => {
          if (!containerRef.current) return;

          e.target.measureLayout(
            //@ts-ignore
            containerRef.current,
            //@ts-ignore
            (x, y, width, height, pageX, pageY) => {
              setContentMeasurment({
                height,
                topOffset: y,
                bottomOffset: y + height,
              });
            }
          );
        }}
      >
        {contentElements}
      </Animated.View>
      {adElement ? (
        <>
          <Animated.View
            style={[
              {
                width: "100%",
                height: adHeight,
                position: "absolute",
                top: adTopOffset,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -99999,
              },
              revealInStyles,
            ]}
          >
            {adElement}
          </Animated.View>
          <Animated.View
            style={{
              height: adHeight,
              backgroundColor: "transparent",
            }}
          />
        </>
      ) : null}
    </>
  );
};

type Props = {
  contentsContainerClassName?: string;
  content: React.ReactNode[];
  adElements: React.ReactNode[];
};
const ContentWithFullScreenAds = ({
  contentsContainerClassName,
  content,
  adElements,
}: Props) => {
  const { containerHeight, scrollOffset, containerRef } =
    useAnimatedScrollView();
  const contentElementsWithAds = useMergedContentWithAds({
    content,
    ads: adElements,
  });

  return (
    <View
      className="flex-1 bg-background"
      //style={{ minHeight: containerHeight ? containerHeight - 187 : 0 }}
    >
      {contentElementsWithAds.map(({ contentElements, adElement }, idx) => (
        <RevealAdsContainer_
          containerRef={containerRef}
          key={idx}
          containerHeight={containerHeight || 0}
          contentElements={contentElements}
          scrollOffset={scrollOffset}
          adElement={adElement}
          contentsContainerClassName={contentsContainerClassName}
        />
      ))}
    </View>
  );
};

export default ContentWithFullScreenAds;
