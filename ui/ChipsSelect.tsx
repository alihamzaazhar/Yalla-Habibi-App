import React, { ReactNode } from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Chip from "./Chip";
import { Skeleton } from "./Skeleton";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/constants";
import { cn } from "@/lib/common/utils";

type Props<T> = {
  options: Array<{
    value: T;
    label: string | number;
    labelPrefix?: ReactNode;
    className?: string;
  }>;
  label?: string;
  value: T;
  showArrow?: boolean;
  onChange: (v: T) => void;
  errorMessage?: string;
  chipsContainerClassName?: string;
  labelClassName?: string;
};

const ChipsSelect = <T extends unknown>({
  options,
  label,
  value,
  errorMessage,
  labelClassName,
  chipsContainerClassName,
  showArrow = false,
  onChange,
}: Props<T>) => {
  return (
    <View className="gap-2">
      {label ? (
        <View className={cn("flex-row items-center justify-between px-4", labelClassName)}>
          <Text className="font-medium text-lg">{label}</Text>
          {showArrow ? (
            <Feather name="arrow-right" size={20} color={Theme.slate[500]} />
          ) : null}
        </View>
      ) : null}
      <View className="gap-1.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={cn("gap-2 px-4", chipsContainerClassName)}
        >
          {options.map((o, idx) => (
            <Chip
              key={idx}
              label={o.label}
              variant={value === o.value ? "selected" : "default"}
              onPress={() => onChange(o.value)}
              labelPrefix={o.labelPrefix}
              className={o.className}
            />
          ))}
        </ScrollView>
        <View>
          {errorMessage && (
            <Text className="text-red-600 text-sm">{errorMessage}</Text>
          )}
        </View>
      </View>
    </View>
  );
};
export const ChipsSelectSkeleton = (props:Pick<Props<string>, 'chipsContainerClassName'>) => {
  return (
    <View className={cn("flex-row items-center gap-2",props.chipsContainerClassName)}>
      <Skeleton style={{ height: 37, width: 120 }} />
      <Skeleton style={{ height: 37, width: 120 }} />
      <Skeleton style={{ height: 37, width: 120 }} />
      <Skeleton style={{ height: 37, width: 120 }} />
    </View>
  );
};
export default ChipsSelect;
