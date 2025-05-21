import { addOpacityToHsl, cn } from "@/lib/common/utils";
import { VariantProps, cva } from "class-variance-authority";
import React, { PropsWithChildren } from "react";
import { ActivityIndicator, View, ViewProps } from "react-native";
import {
  BaseButtonProps as NativeBaseButtonProps,
  BaseButton as NativeBaseButton,
} from "react-native-gesture-handler";
import LoadingDots from "./animations/LoadingDots";
import { Theme } from "@/constants";
import colors from "@/constants/colors";

const buttonVariants = (disabled?: boolean) =>
  cva("flex flex-row items-center justify-center rounded-md self-start", {
    variants: {
      variant: {
        default: "px-2 h-14",
        outline: "border border-border px-3 py-2 overflow-hidden",
        icon: "p-3",
        ghost: "px-3 py-2",
        link: "px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

const activityIndicatorVariants = cva("", {
  variants: {
    variant: {
      default: "text-white",
      outline: "text-white",
      icon: "text-white",
      ghost: "text-white",
      link: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
type Props = PropsWithChildren<ViewProps> & {
  onPress?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  loadingClassName?: string;
  ButtonProps?: NativeBaseButtonProps;
} & VariantProps<ReturnType<typeof buttonVariants>>;
const BaseButton = React.forwardRef<View, Props>(
  (
    {
      ButtonProps,
      onPress,
      variant,
      className,
      disabled = false,
      isLoading = false,
      children,
      loadingClassName,
      ...props
    },
    ref
  ) => {
    const { style: buttonStyle, ...buttonProps } = ButtonProps ?? {};
    return (
      <NativeBaseButton
        onPress={onPress}
        //Darker shade of primary color
        rippleColor={variant === 'default' ? '#c57807':''}
        style={[
          [
            {
              overflow: "hidden",
              borderRadius: 4,
              alignItems: "center",
              justifyContent: "center",
            },
          ],
          disabled
            ? {
                opacity: 0.8,
              }
            : [],
          buttonStyle,
        ]}
        {...buttonProps}
      >
        <View
          className={cn(
            "flex flex-row gap-4 relative items-center justify-center rounded-md self-start h-14 p-2",
            className
            // buttonVariants(isLoading ? true : disabled)({
            //   variant,
            //   className,
            // })
          )}
          accessible
          accessibilityRole="button"
          style={[props.style]}
          {...props}
        >
          {isLoading ? (
            <LoadingDots
              className={activityIndicatorVariants({
                variant,
                className: loadingClassName,
              })}
            />
          ) : (
            children
          )}
        </View>
      </NativeBaseButton>
    );
  }
);
BaseButton.displayName = "BaseButton";
export default BaseButton;
