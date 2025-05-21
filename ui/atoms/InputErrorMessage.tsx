import React from "react";
import { Text } from "react-native";
import { View } from "react-native";

type Props = {
  errorMessage?: string | undefined;
};

const InputErrorMessage = ({ errorMessage }: Props) => {
  return (
    <View>
      {errorMessage ? (
        <Text className="text-red-600 text-sm">{errorMessage as string}</Text>
      ) : null}
    </View>
  );
};

export default InputErrorMessage;
