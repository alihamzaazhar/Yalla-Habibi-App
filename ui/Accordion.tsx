import createGenericContext from "@/lib/common/create-generic-context";
import React, { PropsWithChildren, useState } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Button } from "./Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Theme } from "@/constants";

type Context = {
  isExpanded: Animated.SharedValue<boolean>;
};

const [useAccordionContext, AccordionContextProvider] =
  createGenericContext<Context>();
export const Accordion = (props: ViewProps) => {
  const isExpanded = useSharedValue(true);
  return (
    <AccordionContextProvider value={{ isExpanded: isExpanded }}>
      <View {...props} />
    </AccordionContextProvider>
  );
};

export const AccordionItem = ({ children, style, ...props }: ViewProps) => {
  const duration = 250;

  const { isExpanded } = useAccordionContext();
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      style={[
        { width: "100%", overflow: "hidden", position: "relative" },
        bodyStyle,
        style,
      ]}
      {...props}
    >
      <View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[
          {
            width: "100%",
            position: "absolute",
          }
        ]}
        
      >
        {children}
      </View>
    </Animated.View>
  );
};
export const AccordionTrigger = () => {
  const { isExpanded } = useAccordionContext();
  const [show, setShow] = useState(false);
  const onAccordionStateChange = () => {
    isExpanded.value = !isExpanded.value;
  };
  useAnimatedReaction(
    () => isExpanded.value,
    (open) => {
      runOnJS(setShow)(open);
    }
  );
  return (
    <Button
      variant={"icon"}
      onPress={() => onAccordionStateChange()}
      rippleClassName="bg-gray-300"
    >
      {show ? (
        <FontAwesome
          name={"chevron-down"}
          color={`${Theme.gray[600]}`}
          size={10}
        />
      ) : (
        <FontAwesome
          name={"chevron-up"}
          color={`${Theme.gray[600]}`}
          size={10}
        />
      )}
    </Button>
  );
};
