import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text } from "react-native";
import { View, ViewProps } from "react-native";
import BorderlessButton from "../BorderlessButton";
import { Theme } from "@/constants";

interface Props extends ViewProps {
  label: string;
  onClear?: () => void;
}

const Tag = ({ label, onClear, ...props }: Props) => {
  return (
    <View
      className="flex-row items-center gap-1 px-3 py-1 bg-slate-400 rounded-md"
      {...props}
    >
      <Text className="text-white font-medium">{label}</Text>
      {onClear ? (
        <BorderlessButton onPress={onClear} ButtonProps={{ style: { marginTop:2, padding:2 } }}>
          <Feather name="x" size={16} color={`${Theme.white}`} />
        </BorderlessButton>
      ) : null}
    </View>
  );
};

export default Tag;
