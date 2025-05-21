import React from "react";
import { Text, View } from "react-native";
import DateFilter from "./DateFilter";

type Props = {
  from?: Date | undefined;
  to?: Date | undefined;
  onChange?: (from: Date | undefined, to: Date | undefined) => void;
};

const DateRangeFilter = (props: Props) => {
  const { from, to, onChange } = props;
  return (
    <View
      className="flex flex-row items-center"
      style={{ width: "80%", alignSelf: "flex-end" }}
    >
      <DateFilter
        value={from}
        onChange={(v) => onChange?.(v, undefined)}
        placeholder="From"
      />
      <Text className="text-gray-400 text-sm"> - </Text>
      <DateFilter
        value={to}
        onChange={(v) => onChange?.(from, v)}
        placeholder="To"
        minimumDate={from}
      />
    </View>
  );
};

export default DateRangeFilter;
