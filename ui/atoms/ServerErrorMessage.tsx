import { Theme } from "@/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  errorMessage?: string;
};

const ServerErrorMessage = ({ errorMessage }: Props) => {
  if (!errorMessage) return null;
  return (
    <View className="bg-red-600 px-6 items-center py-4 rounded-md my-6 flex-row gap-4 flex-wrap">
      <AntDesign
        name="warning"
        size={24}
        color={`hsl(${Theme.colors.primary.foreground})`}
      />
      <Text className="text-white text-lg font-bold flex-1">
        {errorMessage}
      </Text>
    </View>
  );
};

export default ServerErrorMessage;
