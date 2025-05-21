import { cn } from "@/lib/common/utils";
import { VariantProps, cva } from "class-variance-authority";
import { View, ViewProps } from "react-native";
import RippleButton from "./animations/RippleButton";
import React from "react";
import LoadingDots from "./animations/LoadingDots";
import {
  HandlerStateChangeEvent,
  TapGestureHandlerEventPayload,
} from "react-native-gesture-handler";

const buttonVariants = (disabled?: boolean) =>
  cva("flex flex-row items-center justify-center rounded-md self-start", {
    variants: {
      variant: {
        default: disabled ? "bg-gray-300 px-2 h-12" : "bg-primary px-2 h-12",
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
const rippleButtonVariants = {
  rippleClassName: {
    default: "bg-primary/20",
    outline: "bg-gray-100",
    icon: "bg-gray-100",
    ghost: "bg-gray-100",
    link: "bg-primary/20",
  },
  rippleBorderRadius: {
    default: 100,
    outline: 100,
    ghost: 100,
    icon: 400,
    link: 400,
  },
  duration: {
    default: 250,
    outline: 250,
    ghost: 250,
    icon: 300,
    link: 300,
  },
};

type Props = ViewProps & {
  onPress?: () => void;
} & {
  rippleClassName?: string;
  rippleBorderRadius?: number;
  loadingClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
} & VariantProps<ReturnType<typeof buttonVariants>>;
const Button = React.forwardRef<any, Props>(
  (
    {
      variant,
      className,
      rippleClassName,
      rippleBorderRadius,
      loadingClassName,
      onPress,
      isLoading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    return (
      <RippleButton
        rippleClassName={
          rippleClassName ??
          rippleButtonVariants["rippleClassName"][variant ?? "default"]
        }
        onPress={onPress}
        disabled={isLoading || disabled}
        rippleBorderRadius={
          rippleBorderRadius ??
          rippleButtonVariants["rippleBorderRadius"][variant ?? "default"]
        }
        duration={rippleButtonVariants["duration"][variant ?? "default"]}
        ref={ref}
      >
        <View
          className={cn(
            buttonVariants(disabled)({
              variant,
              className,
            })
          )}
          {...props}
        >
          {isLoading ? <LoadingDots className={loadingClassName} /> : props.children}
        </View>
      </RippleButton>
    );
  }
);
Button.displayName = "Button";
export { Button };
