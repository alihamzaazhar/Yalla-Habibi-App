import { Theme } from "@/constants";
import React, { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";
import {
  RectButtonProps as NativeRectButtonProps,
  RectButton as NativeRectButton,
} from "react-native-gesture-handler";
type Props = PropsWithChildren<ViewProps> & {
  onPress?: () => void;

  ButtonProps?: NativeRectButtonProps;
};
const RectButton = React.forwardRef<View, Props>(
  ({ ButtonProps = {}, onPress, ...props }, ref) => {
    return (
      <NativeRectButton rippleColor={Theme.slate[200]} onPress={onPress} {...ButtonProps}>
        <View
          className={props.className}
          accessible
          accessibilityRole="button"
          ref={ref}
          {...props}
        />
      </NativeRectButton>
    );
  }
);
RectButton.displayName = "RectButton";
export default RectButton;
