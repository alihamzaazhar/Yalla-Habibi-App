import React from "react";
import { View, StyleSheet } from "react-native";
import AmountInput from "../AmountInput";
import { CurrencyInputProps } from "react-native-currency-input";
import InputErrorMessage from "../atoms/InputErrorMessage";

interface Props
  extends Omit<CurrencyInputProps, "onBlur" | "value" | "onChange"> {
  onBlur?: () => void;
  value?: number | null;
  onChange?: (value: number | null) => void;
  errorMessage?: string;
  prefix?: string;
  prefixLeft?: boolean;
  decimal_digits?: number;
}

const CurrencyInputField = ({
  onBlur,
  value,
  onChange,
  errorMessage,
  prefix = "AED",
  decimal_digits = 2,
  prefixLeft,
  ...inputProps
}: Props) => {
  return (
    <View className="gap-1.5">
      <AmountInput
        onBlur={onBlur}
        value={value ?? null}
        onChangeValue={(v) => {
          onChange?.(v);
        }}
        style={StyleSheet.flatten([
          { borderColor: errorMessage ? `rgb(220,38,38)` : undefined },
        ])}
        prefix={prefix}
        decimal_digits={decimal_digits}
        prefixLeft={prefixLeft}
        className="bg-gray-200 flex-1 rounded-md"
        prefixClassName="text-gray-400 text-base"
        {...inputProps}
      />
      <InputErrorMessage errorMessage={errorMessage} />
    </View>
  );
};

export default CurrencyInputField;
