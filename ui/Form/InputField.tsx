import React from "react";
import {StyleSheet} from 'react-native'
import { View, TextInputProps as RNTextInputProps, Text } from "react-native";
import {
  useController,
  useFormContext,
  UseControllerProps,
} from "react-hook-form";
import Input from "../Input";

interface TextInputProps extends RNTextInputProps, UseControllerProps {
  label?: string;
  name: string;
  defaultValue?: string;
}

const ControlledInput = ({style, ...props}: TextInputProps) => {
  const formContext = useFormContext();
  const { formState } = formContext;
  const { name, label, rules, defaultValue, ...inputProps } = props;
  const { field } = useController({ name, rules, defaultValue });
  const hasError = Boolean(formState?.errors[name]);
  return (
    <View>
      {label && <Text>{label}</Text>}
      <View className="gap-1.5">
        <Input
          autoCapitalize="none"
          textAlign="left"
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          style={StyleSheet.flatten([{borderColor:hasError ? `rgb(220,38,38)`:undefined}, style])}
          {...inputProps}
        />

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

export const InputField = (props: TextInputProps) => {
  const { name, rules, label, defaultValue, ...inputProps } = props;

  const formContext = useFormContext();

  // Placeholder until input name is initialized
  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    return null;
  }

  return <ControlledInput {...props} />;
};
