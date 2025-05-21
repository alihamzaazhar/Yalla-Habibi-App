import React from "react";
import { TextInput, View } from "react-native";
import Input from "../Input";
import { StyleSheet } from "react-native";
import { Text } from "react-native";

interface Props extends React.ComponentPropsWithoutRef<typeof TextInput> {
  errorMessage?: string;
  label?: string;
}

const InputField = ({ label, errorMessage, style, ...props }: Props) => {
  return (
    <View className="gap-1.5">
      <View className="gap-2">
        {label && <Text className="text-sm text-gray-500 font-medium">{label}</Text>}
        <Input
          autoCapitalize="none"
          textAlign="left"
          style={StyleSheet.flatten([
            { borderColor: errorMessage ? `rgb(220,38,38)` : undefined },
            style,
          ])}
          {...props}
        />
      </View>

      <View>
        {errorMessage && (
          <Text className="text-red-600 text-sm">{errorMessage}</Text>
        )}
      </View>
    </View>
  );
};

export default InputField;
