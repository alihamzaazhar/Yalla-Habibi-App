import { Theme } from "@/constants";
import React, { ReactNode } from "react";
import { Text, View, ViewProps } from "react-native";
import { BaseButton } from "react-native-gesture-handler";

export interface Props extends ViewProps {
  label: string | number;
  labelPrefix?: ReactNode;
  onPress?: () => void;
  variant: "default" | "selected";
  containerStyle?: ViewProps["style"];
}
const Chip = React.forwardRef<React.ElementRef<typeof View>, Props>(
  (
    { label, variant, labelPrefix = null, containerStyle, className, ...props },
    ref
  ) => {
    const inner = (
      <View
        ref={ref}
        accessible
        accessibilityRole="button"
        className={className}
      >
        {labelPrefix}
        <Text
          style={{
            color:
              variant === "selected"
                ? Theme.primary.foreground
                : Theme.slate[400],
          }}
          className={`capitalize font-medium`}
        >
          {label}
        </Text>
      </View>
    );
    return props.onPress ? (
      <BaseButton
        onPress={props.onPress}
        rippleColor={`hsl(${Theme.primary.DEFAULT})`}
        style={[
          {
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderWidth: 1,
            margin: 1,
            borderColor:
              variant === "selected" ? "transparent" : Theme.slate[300],
            backgroundColor:
              variant === "selected"
                ? Theme.primary.DEFAULT
                : Theme.card.DEFAULT,
          },
          containerStyle,
        ]}
      >
        {inner}
      </BaseButton>
    ) : (
      inner
    );
  }
);

export default Chip;
