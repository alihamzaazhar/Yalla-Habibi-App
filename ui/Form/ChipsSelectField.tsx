import React from "react";
import { View, Text } from "react-native";
import {
  useController,
  useFormContext,
  UseControllerProps,
} from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import Chip from "../Chip";
import Feather from "@expo/vector-icons/Feather";
import { Theme } from "@/constants";
import { cn } from "@/lib/common/utils";

interface Props extends UseControllerProps {
  label?: string;
  name: string;
  options: Array<string | number>;
  labelClassName?: string;
  chipsContainerClassName?: string;
  showArrow?: boolean;
}

export const ChipsSelectField = ({
  options,
  showArrow = false,
  labelClassName,
  chipsContainerClassName,
  ...props
}: Props) => {
  const formContext = useFormContext();

  const { formState } = formContext;
  const { name, label, defaultValue } = props;
  const { field } = useController({ name, defaultValue });
  const hasError = Boolean(formState?.errors[name]);
  return (
    <View className="gap-2">
      {label ? (
        <View className={cn("flex-row items-center justify-between pr-4", labelClassName)}>
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
          contentContainerClassName={cn("gap-2 pr-4", chipsContainerClassName)}
        >
          {options.map((o, idx) => (
            <Chip
              key={idx}
              label={typeof o === "string" ? o : o.toString()}
              variant={field.value === o ? "selected" : "default"}
              onPress={() => field.onChange(o)}
            />
          ))}
        </ScrollView>
        <View>
          {hasError && (
            <Text className="text-red-600 text-sm">
              {formState.errors[name]?.message as string}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
