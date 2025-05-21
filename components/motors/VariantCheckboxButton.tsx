import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "@/constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import { cn } from "@/lib/common/utils";
import { formatPrice } from "@/lib/common/prices";
import BorderlessButton from "@/ui/BorderlessButton";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  label: string;
  labelClassName?: string;
  badgePrice?: number;
}
interface ControlledRadioButtonProps extends CheckboxProps {
  isChecked: boolean;
  setChecked: (state: boolean) => void;
}
function VariantCheckboxButton({
  label,
  labelClassName,
  className,
  isChecked,
  setChecked,
  badgePrice,
  ...props
}: ControlledRadioButtonProps) {
  const toggleRadioButton = () => {
    setChecked(!isChecked);
  };

  return (
    <Pressable onPress={toggleRadioButton}>
      <View
        className={
          "flex flex-row items-center py-1.5 rounded-md justify-between  bg-white px-1"
        }
        {...props}
      >
        <Text className={cn("text-lg", labelClassName)}>{label}</Text>
        <View className="gap-4 flex-row items-center">
          {badgePrice ? (
            <Text className={"text-lg"}>{`${formatPrice({
              amount: badgePrice,
              currency_code: "aed",
              without_symbol: true,
            })}`}</Text>
          ) : null}
          <BorderlessButton
            ButtonProps={{
              style: {
                width: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isChecked
                  ? `hsl(${Theme.primary.DEFAULT})`
                  : Theme.slate[200],
                borderRadius: 100,
                borderWidth: 1,
                borderColor: isChecked ? "transparent" : Theme.slate[300],
              },
            }}
          >
            {isChecked ? (
              <AntDesign
                name="check"
                color={Theme.white}
                size={16}
                style={{ marginTop: 1 }}
              />
            ) : null}
          </BorderlessButton>
        </View>
      </View>
    </Pressable>
  );
}

export default VariantCheckboxButton;
