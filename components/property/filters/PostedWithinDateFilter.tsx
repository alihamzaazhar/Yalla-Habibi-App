import ChipsSelect from "@/ui/ChipsSelect";
import React from "react";
import { View } from "react-native";
import ClearButton from "./ClearButton";
import { Text } from "react-native";
import { humanizeString } from "@/lib/common/utils";
import { DateComparisonOperator } from "@medusajs/medusa";
import { addDays, endOfDay, startOfDay, subDays } from "date-fns";

type Props = {
  filter?: DateComparisonOperator;
  clearable?: boolean;
  setFilter: (v?: DateComparisonOperator) => void;
};
const today = new Date();
const options = [
  {
    label: "Today",
    value: {
      gte: startOfDay(today),
      lte: endOfDay(today),
    } as DateComparisonOperator,
  },
  {
    label: "Within 3 days",
    value: {
      gte: startOfDay(subDays(today, 3)),
      lte: endOfDay(today),
    },
  },
  {
    label: "Within 1 week",
    value: {
      gte: startOfDay(subDays(today, 7)),
      lte: endOfDay(today),
    },
  },
  {
    label: "Within 2 weeks",
    value: { gte: startOfDay(subDays(today, 14)), lte: endOfDay(today) },
  },
  {
    label: "Within 1 month",
    value: { gte: startOfDay(subDays(today, 30)), lte: endOfDay(today) },
  },
  {
    label: "Within 3 months",
    value: { gte: startOfDay(subDays(today, 90)), lte: endOfDay(today) },
  },
  {
    label: "Within 6 months",
    value: { gte: startOfDay(subDays(today, 180)), lte: endOfDay(today) },
  },
];
const PostedWithinDateFilter = ({
  filter,
  setFilter,
  clearable = true,
}: Props) => {
  return (
    <View className="gap-2">
      <View className="justify-between flex-row items-center px-4">
        <Text className="text-lg font-medium">{"Ads Posted"}</Text>
        {clearable && typeof filter !== "undefined" ? (
          <ClearButton
            onPress={() => {
              setFilter(undefined);
            }}
          />
        ) : null}
      </View>
      <ChipsSelect
        options={options}
        value={filter}
        onChange={(v) => setFilter(v)}
        chipsContainerClassName="pr-4 pl-4"
      />
    </View>
  );
};

export default PostedWithinDateFilter;
