import React from "react";
import MenuScreenLayout from "./MenuScreenLayout";
import BorderlessButton from "@/ui/BorderlessButton";
import Entypo from "@expo/vector-icons/Entypo";
import { Theme } from "@/constants";
import Feather from "@expo/vector-icons/Feather";

interface Props
  extends Omit<
    React.ComponentPropsWithoutRef<typeof MenuScreenLayout>,
    "rightIcon"
  > {
  onRightIconPress?: () => void;
}

const MenuScreenWithEditLayout = (props: Props) => {
  return (
    <MenuScreenLayout
      {...props}
      rightIcon={
        <BorderlessButton onPress={props.onRightIconPress}>
          <Feather name="edit" size={20} color={Theme.slate[400]} />
        </BorderlessButton>
      }
    />
  );
};

export default MenuScreenWithEditLayout;
