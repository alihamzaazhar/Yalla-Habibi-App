import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "@/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { cn } from "@/lib/common/utils";
import { formatPrice } from "@/lib/common/prices";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  label: string;
  labelClassName?: string;
  badge_price?: number;
}
interface ControlledRadioButtonProps extends CheckboxProps {
  isChecked: boolean;
  setChecked: (state: boolean) => void;
}
function VariantRadioButton({
  label,
  labelClassName,
  className,
  isChecked,
  setChecked,
  badge_price,
  ...props
}: ControlledRadioButtonProps) {
  const toggleRadioButton = () => {
    setChecked(!isChecked);
  };

  return (
    <Pressable onPress={toggleRadioButton}>
      <View
        className={
          "flex flex-row items-center py-1.5 rounded-md justify-between bg-white"
        }
        {...props}
      >
        <Text className={cn("text-lg", labelClassName)}>
          {label}
        </Text>
        <View className="gap-4 flex-row items-center">
          {badge_price && (
            <Text className={"text-lg"}>{`${formatPrice({
              amount: badge_price,
              currency_code: "aed",
              without_symbol: true
            })}`}</Text>
          )}
          <View
            className={`items-center justify-center bg-background border-2 rounded-full mt-1 ${
              isChecked ? "border-transparent bg-primary" : "border-border"
            }`}
            style={{ width: 20, height: 20 }}
          >
            {isChecked && (
              <AntDesign
                name="check"
                color={Theme.white}
                size={16}
                style={{ marginTop: 1 }}
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export { VariantRadioButton };
