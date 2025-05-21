import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "../lib/common/utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Theme } from "@/constants";
import RippleButton from "./animations/RippleButton";
import AntDesign from "@expo/vector-icons/AntDesign";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  label: string;
  labelClassName?:string
  
}
interface ControlledRadioButtonProps extends CheckboxProps {
  isChecked: boolean;
  setChecked: (state: boolean) => void;
}
function RadioButton({
  label,
  labelClassName,
  className,
  isChecked,
  setChecked,
  ...props
}: ControlledRadioButtonProps) {
  const toggleRadioButton = () => {
    setChecked(!isChecked);
  };

  return (
    <RippleButton onPress={toggleRadioButton} duration={300} rippleClassName="bg-gray-200">
      <View
        className={"flex flex-row items-center gap-3 px-3 py-2"}
        {...props}
      >
        <View
          className={`items-center justify-center bg-background border-2 rounded-full ${
            isChecked ? "border-transparent bg-primary" : "border-border"
          }`}
          style={{ width: 20, height: 20 }}
        >
          {isChecked && (
            <AntDesign
              name='check'
              color={Theme.white}
              size={14}
              style={{ marginTop: 1.5 }}
            />
          )}
        </View>
        <Text className={cn(labelClassName)}>{label}</Text>
      </View>
    </RippleButton>
  );
}

export { RadioButton };
