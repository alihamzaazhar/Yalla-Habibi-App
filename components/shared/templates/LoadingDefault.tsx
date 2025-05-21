import { Theme } from "@/constants";
import React from "react";
import { ActivityIndicator, View } from "react-native";


const LoadingDefault = () => {
  return (
    <View className="gap-y-4 px-4 flex-1 items-center justify-center">
      <ActivityIndicator size={"large"} color={Theme.gray[600]} />
    </View>
  );
};

export default LoadingDefault;
