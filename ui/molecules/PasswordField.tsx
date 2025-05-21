import React from "react";
import { TextInput, View } from "react-native";
import Input from "../Input";
import { StyleSheet } from "react-native";
import { Text } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Theme } from "@/constants";
import BorderlessButton from "../BorderlessButton";

interface Props extends React.ComponentPropsWithoutRef<typeof TextInput> {
  errorMessage?: string;
}

const InputField = ({ errorMessage, style, ...props }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  return (
    <View className="gap-1.5">
      <View className="flex-row items-center justify-center bg-gray-200 rounded-md">
        <Input
          autoCapitalize="none"
          textAlign="left"
          style={StyleSheet.flatten([
            {
              flex: 1,
              borderColor: errorMessage ? `rgb(220,38,38)` : undefined,
            },
            style,
          ])}
          secureTextEntry={!isPasswordVisible}
          {...props}
        />
        <View className="px-4">
          <BorderlessButton
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Entypo
              name={isPasswordVisible ? "eye-with-line" : "eye"}
              size={20}
              color={Theme.slate[400]}
            />
          </BorderlessButton>
        </View>
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
