import React from "react";
import { View } from "react-native";
import { Theme } from "@/constants";
import { Text } from "react-native";
import BaseButton from "@/ui/BaseButton";
import RectButton from "@/ui/RectButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { humanizeString } from "@/lib/common/utils";
import { useBottomSheetImperative } from "@/components/shared/BottomSheetModal";

type Props<T> = {
  options: Array<{ label: string; value: T }>;
  label: string;
  value?: T;
  onChange?: (value: T) => void;
};

const SheetPickerFilter = <T,>({
  value,
  label,
  options,
  onChange,
}: Props<T>) => {
  const Trigger = useBottomSheetImperative({
    content: (onClose) => {
      return (
        <View className="flex-1">
          {options.map((o, idx) => (
            <RectButton
              key={idx}
              onPress={() => {
                onClose();
                onChange?.(o.value);
              }}
              className="flex flex-row w-full items-center justify-start gap-4 p-6 border-b border-gray-200"
            >
              {value === o.value ? (
                <AntDesign
                  name="check"
                  color={`hsl(${Theme.colors.primary.DEFAULT})`}
                  size={16}
                />
              ) : null}
              <Text className="text-lg text-gray-600 text-center font-semibold">
                {o.label}
              </Text>
            </RectButton>
          ))}
        </View>
      );
    },
    trigger: (onOpen) => {
      return (
        <BaseButton
          onPress={onOpen}
          style={{
            height: "auto",
            paddingLeft: 8,
            paddingRight: 16,
            paddingVertical: 8,
          }}
          ButtonProps={{
            rippleColor: Theme.slate[200],
            style: [
              {
                borderRadius: 8,
                borderWidth: 1,
                margin: 1,
                borderColor: Theme.slate[300],
                backgroundColor: Theme.card.DEFAULT,
              },
            ],
          }}
        >
          <View className="flex-row items-center">
            <Text className="text-slate-400 text-sm font-medium">
              {`${label}: `}
            </Text>
            <Text className="text-slate-500 font-bold">
              {humanizeString(value ?? "All")}
            </Text>
          </View>
        </BaseButton>
      );
    },
  });
  return <>{Trigger}</>;
};

export default SheetPickerFilter;
