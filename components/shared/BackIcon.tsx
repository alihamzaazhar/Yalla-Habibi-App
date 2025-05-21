import { Theme } from "@/constants";
import { useNavigation } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import BorderlessButton from "@/ui/BorderlessButton";

const BackIcon = () => {
  const navigation = useNavigation();
  return (
    <BorderlessButton onPress={() => navigation.goBack()}>
      <Entypo
        name="chevron-left"
        size={18}
        color={Theme.slate[800]}
      />
    </BorderlessButton>
  );
};

export default BackIcon;
