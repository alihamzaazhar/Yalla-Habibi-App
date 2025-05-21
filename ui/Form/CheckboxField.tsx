import React from "react";
import { View, Text, ViewProps } from "react-native";
import {
  useController,
  useFormContext,
  UseControllerProps,
} from "react-hook-form";
import { Checkbox } from "../Checkbox";
import { cn } from "@/lib/common/utils";

interface Props extends UseControllerProps, ViewProps {
  label: string;
  name: string;
}

export const CheckboxField = ({ className, ...props }: Props) => {
  const formContext = useFormContext();
  const { formState } = formContext;
  const { name, label, defaultValue } = props;
  const { field } = useController({ name, defaultValue });
  const hasError = Boolean(formState?.errors[name]);
  return (
    <View className={cn("gap-1.5", className)} {...props}>
      <Checkbox
        isChecked={Boolean(field.value)}
        setChecked={(state) => field.onChange(state)}
        label={label}
      />
      <View>
        {hasError && (
          <Text className="text-red-600 text-sm">
            {formState.errors[name]?.message as string}
          </Text>
        )}
      </View>
    </View>
  );
};
