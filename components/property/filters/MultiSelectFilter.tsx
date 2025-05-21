import React from "react";
import { View } from "react-native";
import ClearButton from "./ClearButton";
import { Text } from "react-native";
import { humanizeString } from "@/lib/common/utils";
import MultiChipsSelect from "@/ui/MultiChipsSelect";

type Props<T> = {
  filter?: T[];
  setFilter: (v?: T[]) => void;
  options: Array<T> | readonly T[];
  title?: string;
};

const MultiSelectFilter = <T extends string | number>({
  filter,
  setFilter,
  options,
  title,
}: Props<T>) => {
  return (
    <View className="gap-2">
      <View className="justify-between flex-row items-center px-4">
        <Text className="text-lg font-medium">{title}</Text>
        {filter ? (
          <ClearButton
            onPress={() => {
              setFilter(undefined);
            }}
          />
        ) : null}
      </View>
      <MultiChipsSelect
        options={options.map((o) => ({
          label: humanizeString(o),
          value: o,
        }))}
        value={filter}
        onChange={(v) => setFilter(v)}
      />
    </View>
  );
};

export default MultiSelectFilter;
