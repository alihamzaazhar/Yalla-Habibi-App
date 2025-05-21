import { Theme } from "@/constants";
import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
} from "react-native-reanimated";

const STEP_SIZE = 5;
const Slider = () => {
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const offset = useSharedValue(0);
  const statusSliderWidth = useSharedValue(0);
  const MAX_VALUE = containerWidth;

  const pan = Gesture.Pan().onChange((event) => {
    const newValue = offset.value + event.changeX;
    // offset.value = Math.max(0, Math.min(newValue, MAX_VALUE));

    // Clamp the newValue between 0 and MAX_VALUE, then round it to the nearest step
    const clampedValue = Math.max(0, Math.min(newValue, MAX_VALUE));
    offset.value = Math.round(clampedValue / STEP_SIZE) * STEP_SIZE;
    statusSliderWidth.value = (clampedValue / MAX_VALUE) * 100 + 2;
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });
  const sliderStatusStyle = useAnimatedStyle(() => {
    return {
      width: `${statusSliderWidth.value}%`,
    };
  });

  return (
    <View
      style={{
        backgroundColor: Theme.red[400],
      }}
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <View style={styles.sliderTrack}>
        <Animated.View
          style={[
            {
              backgroundColor: Theme.slate[600],
              height: 8,
              borderTopLeftRadius: 24,
              borderBottomLeftRadius: 24,
            },
            sliderStatusStyle,
          ]}
        />
        <GestureHandlerRootView>
          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.sliderHandle, sliderStyle]} />
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  sliderTrack: {
    flex: 1,
    width: "100%",
    height: 8,
    backgroundColor: Theme.slate[200],
    borderRadius: 24,
    position: "relative",
    justifyContent: "center",
  },
  sliderHandle: {
    width: 20,
    height: 20,
    backgroundColor: Theme.slate[400],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.slate[100],
    position: "absolute",
    top: 0,
  },
});

export default Slider;
