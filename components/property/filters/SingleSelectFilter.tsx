import ChipsSelect from "@/ui/ChipsSelect";
import React from "react";
import { View } from "react-native";
import ClearButton from "./ClearButton";
import { Text } from "react-native";
import { humanizeString } from "@/lib/common/utils";

type OptionType<T> = { value: T; label: string };
type Props<T> = {
  filter?: T;
  clearable?: boolean;
  setFilter: (v?: T) => void;
  options: T[] | readonly T[] | Array<OptionType<T>>;
  title?: string;
};

const SingleSelectFilter = <T extends unknown>({
  filter,
  setFilter,
  options,
  title,
  clearable = true,
}: Props<T>) => {
  return (
    <View className="gap-2">
      <View className="justify-between flex-row items-center px-4 relative">
        <Text className="text-lg font-medium">{title}</Text>
        <View className="absolute" style={{ right: 16 }}>
          {clearable && typeof filter !== "undefined" ? (
            <ClearButton
              onPress={() => {
                setFilter(undefined);
              }}
            />
          ) : null}
        </View>
      </View>
      <ChipsSelect
        options={options.map((o) =>
          typeof o === "object"
            ? (o as OptionType<T>)
            : { label: humanizeString(o), value: o }
        )}
        value={filter}
        onChange={(v) => setFilter(v as T | undefined)}
        chipsContainerClassName="pr-4 pl-4"
      />
    </View>
  );
};

export default SingleSelectFilter;
