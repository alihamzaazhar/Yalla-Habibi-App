import React from "react";
import CoreCurrencyInput, {
  CurrencyInputProps,
} from "react-native-currency-input";
import Input from "./Input";
import { TextInput } from "react-native-gesture-handler";
import { Text, TextInputProps, View } from "react-native";
import { cn } from "@/lib/common/utils";

interface Props extends CurrencyInputProps {
  textInputProps?: TextInputProps;
  prefixClassName?: string;
  prefixLeft?: boolean;
  decimal_digits?: number;
  containerClassName?: string;
}
const AmountInput = React.forwardRef<TextInput, Props>(
  (
    {
      textInputProps = {},
      prefixClassName,
      prefix,
      prefixLeft = false,
      value,
      decimal_digits = 1,
      onChangeValue,
      containerClassName,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <CoreCurrencyInput
        ref={ref}
        renderTextInput={(inputProps) => {
          const mergedProps = {
            ...inputProps,
            ...textInputProps,
          };

          return (
            <View
              className={cn("flex flex-row relative items-center", className, containerClassName)}
              style={mergedProps.style}
            >
              {prefixLeft ? (
                <View className="absolute" style={{ left: 2 }}>
                  <Text
                    className={cn(
                      "text-sm px-4 text-slate-400",
                      prefixClassName
                    )}
                  >
                    {prefix}
                  </Text>
                </View>
              ) : null}

              <Input
                {...mergedProps}
                className={cn("rounded-md", mergedProps.className, className)}
                style={[
                  {
                    flex: 1,
                    paddingHorizontal: prefixLeft ? 24 : 16,
                    position: "relative",
                    overflow: "scroll",
                  },
                  mergedProps.style,
                ]}
              />

              {prefixLeft ? null : (
                <View className="absolute" style={{ right: 2 }}>
                  <Text
                    className={cn(
                      "text-sm px-4 text-slate-400",
                      prefixClassName
                    )}
                  >
                    {prefix}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        delimiter=","
        separator="."
        precision={0}
        textAlign="left"
        value={value ? value / 10 ** decimal_digits : null}
        onChangeValue={(v) =>
          onChangeValue?.(v ? v * 10 ** decimal_digits : null)
        }
        {...props}
      />
    );
  }
);

export default AmountInput;
