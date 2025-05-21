import AmountInput from "@/ui/AmountInput";
import { NumericalComparisonOperator } from "@medusajs/medusa";
import React from "react";
import { Text, View } from "react-native";
import ClearButton from "./ClearButton";

interface Props {
  filter?: NumericalComparisonOperator;
  setFilter: (v?: NumericalComparisonOperator) => void;
  prefix?: string;
  decimal_digits?: number;
  title?: string;
  placeholder?: string;
}
const RangeInputFilter = ({
  filter,
  setFilter,
  prefix,
  title,
  decimal_digits = 0,
  placeholder = "0",
}: Props) => {
  return (
    <View className="gap-2 px-4">
      <View className="justify-between flex-row items-center">
        <Text className="text-lg font-medium">{title}</Text>
        {filter ? <ClearButton onPress={() => setFilter(undefined)} /> : null}
      </View>
      <View className="flex flex-row items-center">
        <AmountInput
          value={filter?.gte ?? null}
          onChangeValue={(v) =>
            setFilter({
              ...filter,
              gte: v ?? undefined,
            })
          }
          prefix={prefix}
          textInputProps={{
            placeholder,
          }}
          decimal_digits={decimal_digits}
          className="bg-slate-100  rounded-md pl-2 flex-1"
          style={{minHeight:42, height:42}}
          containerClassName="border border-slate-300 overflow-hidden"
        />
        <Text className="text-lg font-medium px-4">To</Text>
        <AmountInput
          value={filter?.lte ?? null}
          onChangeValue={(v) =>
            setFilter({
              ...filter,
              lte: v ?? undefined,
            })
          }
          prefix={prefix}
          textInputProps={{
            placeholder,
          }}
          decimal_digits={decimal_digits}
          className="bg-slate-100  rounded-md pl-2 flex-1"
          style={{minHeight:42, height:42}}
          containerClassName="border border-slate-300 overflow-hidden"
        />
      </View>
    </View>
  );
};

export default RangeInputFilter;
