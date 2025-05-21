import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "../lib/common/utils";
import { Button } from "./Button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Theme } from "@/constants";
import RippleButton from "./animations/RippleButton";
import RectButton from "./RectButton";

export interface CheckboxProps {
  label: string;
  labelClassName?: string;
  style: React.ComponentPropsWithoutRef<typeof View>["style"];
}
interface ControlledCheckboxProps extends CheckboxProps {
  isChecked: boolean;
  setChecked: (state: boolean) => void;
}
function Checkbox({
  label,
  labelClassName,
  isChecked,
  setChecked,
  style,
}: ControlledCheckboxProps) {
  const toggleCheckbox = () => {
    setChecked(!isChecked);
  };

  return (
    <RectButton
      onPress={toggleCheckbox}
      ButtonProps={{
        style: [style],
      }}
      className="flex-row items-center gap-3 px-2 py-3"
    >
      <View
        className={`items-center justify-center bg-background border-2 rounded-md ${
          isChecked ? "border-transparent bg-primary" : "border-border"
        }`}
        style={{ width: 20, height: 20 }}
      >
        {isChecked && (
          <MaterialIcons
            name="check"
            color={Theme.white}
            size={14}
            style={{ marginTop: 1.5 }}
          />
        )}
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        className={cn(labelClassName)}
      >
        {label}
      </Text>
    </RectButton>
  );
}

export { Checkbox };
