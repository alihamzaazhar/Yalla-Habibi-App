import * as React from "react";
import { ViewStyle } from "react-native";
import { StyleSheet, Text, View, ViewProps } from "react-native";
import { HandlerStateChangeEvent, State, TapGestureHandler, TapGestureHandlerEventPayload } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ValueOf<T> = T[keyof T];

export interface RippleButtonProps {
  children: React.ReactElement<ViewProps>;
  onPress?: (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => void;
  disabled?: boolean;
  rippleScale?: number;
  duration?: number;
  rippleClassName?: string;
  rippleBorderRadius?: number;
  rippleStyle?: ViewStyle;
}

const RippleButton = React.forwardRef<any, RippleButtonProps>(
  (
    {
      children,
      disabled = false,
      onPress = () => {},
      rippleScale = 1,
      duration = 250,
      rippleClassName = "bg-primary/20",
      rippleBorderRadius = 4,
      rippleStyle = {},
    },
    ref
  ) => {
    const [radius, setRadius] = React.useState(-1);
    const child = React.Children.only(children);
    const scale = useSharedValue(0);
    const positionX = useSharedValue(0);
    const positionY = useSharedValue(0);
    const state = useSharedValue<ValueOf<typeof State>>(State.UNDETERMINED);
    const isFinished = useSharedValue(false);
    const uas = useAnimatedStyle(
      () => ({
        top: positionY.value - radius,
        left: positionX.value - radius,
        transform: [
          {
            scale: scale.value,
          },
        ],
      }),
      [radius]
    );

    return (
      <TapGestureHandler
        maxDurationMs={9999999999}
        onHandlerStateChange={(event) => {
          if (disabled) {
            return;
          }
          state.value = event.nativeEvent.state;
          positionX.value = event.nativeEvent.x;
          positionY.value = event.nativeEvent.y;

          scale.value =
            event.nativeEvent.state !== State.FAILED
              ? withTiming(
                  rippleScale,
                  { duration, easing: Easing.bezier(0, 0, 0.8, 0.4) },
                  (finised) => {
                    if (finised) {
                      isFinished.value = true;
                      scale.value = withTiming(0, { duration: 0 });
                    }
                    if (state.value === State.BEGAN && finised) {
                      scale.value = withTiming(1, { duration: 0 });
                    }
                  }
                )
              : 0;

          if (event.nativeEvent.state === State.BEGAN) {
            isFinished.value = false;
          }

          if (event.nativeEvent.state === State.END) {
            if (isFinished.value) {
              scale.value = withTiming(0, { duration: 0 });
            }
            onPress(event);
          }
        }}
      >
        <Animated.View ref={ref} {...child.props}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              borderRadius: rippleBorderRadius,
              ...rippleStyle,
            }}
            onLayout={({
              nativeEvent: {
                layout: { width, height },
              },
            }) => {
              setRadius(Math.sqrt(width ** 2 + height ** 2));
            }}
          >
            {radius !== -1 && (
              <Animated.View
                className={rippleClassName}
                style={[
                  uas,
                  {
                    position: "absolute",
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: radius,
                  },
                ]}
              />
            )}
          </View>
          {child.props.children}
        </Animated.View>
      </TapGestureHandler>
    );
  }
);
RippleButton.displayName = "RippleButton";
export default RippleButton;
