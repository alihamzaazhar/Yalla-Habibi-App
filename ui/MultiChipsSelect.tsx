import React from "react";
import { View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Chip from "./Chip";

type Props<T> = {
  options: Array<{ value: T; label: string | number }>;
  label?: string;
  value?: Array<T>;
  onChange: (v?: Array<T>) => void;
  errorMessage?: string;
};

const MultiChipsSelect = <T,>({
  options,
  label,
  value,
  errorMessage,
  onChange,
}: Props<T>) => {
  return (
    <View className="gap-4">
      {label && <Text className="font-bold text-lg">{label}</Text>}
      <View className="gap-1.5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4"
        >
          {options.map((o, idx) => (
            <Chip
              key={idx}
              label={o.label}
              variant={value?.includes(o.value) ? "selected" : "default"}
              onPress={() =>
                onChange(
                  value?.includes(o.value)
                    ? value.filter((v) => v !== o.value)
                    : value
                    ? [...value, o.value]
                    : [o.value]
                )
              }
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
export default MultiChipsSelect;
