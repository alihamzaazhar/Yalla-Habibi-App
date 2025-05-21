import { Theme } from "@/constants";
import React, { PropsWithChildren } from "react";
import { ActivityIndicator, View, ViewProps } from "react-native";
import {
  BorderlessButtonProps as NativeBorderlessButtonProps,
  BorderlessButton as NativeBorderlessButton,
} from "react-native-gesture-handler";
type Props = PropsWithChildren<ViewProps> & {
  isLoading?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  ButtonProps?: NativeBorderlessButtonProps;
};
const BorderlessButton = React.forwardRef<NativeBorderlessButton, Props>(
  (
    { ButtonProps = {}, onPress, isLoading = false, disabled, ...props },
    ref
  ) => {
    const { style, ...buttonProps } = ButtonProps;
    if (isLoading) {
      return (
        <View
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
          className={props.className}
        >
          <ActivityIndicator size={"small"} color={`${Theme.slate[400]}`} />
        </View>
      );
    }
    return (
      <NativeBorderlessButton
        borderless={false}
        onPress={!disabled ? onPress : undefined}
        ref={ref}
        enabled={!disabled}
        style={[
          {
            alignSelf: "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
          },
          style,
          disabled
            ? {
                opacity: 0.8,
              }
            : {},
        ]}
        {...buttonProps}
      >
        <View
          className={props.className}
          accessible
          accessibilityRole="button"
          {...props}
        />
      </NativeBorderlessButton>
    );
  }
);
BorderlessButton.displayName = "BorderlessButton";
export default BorderlessButton;
