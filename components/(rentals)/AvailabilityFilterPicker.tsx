import React from "react";
import { View } from "react-native";
import { useBottomSheetImperative } from "../shared/BottomSheetModal";
import { Theme } from "@/constants";
import { Text } from "react-native";
import BaseButton from "@/ui/BaseButton";
import RectButton from "@/ui/RectButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RentalPropertiesListParams } from "@/api/hooks/rental-properties/queries";
import { humanizeString } from "@/lib/common/utils";

type Props = {
  setFilters: (filters: RentalPropertiesListParams) => void;
  filters?: RentalPropertiesListParams;
};

const options = [
  {
    label: "All",
    value: undefined,
  },
  {
    label: "Booked",
    value: "booked",
  },
  {
    label: "Available",
    value: "available",
  },
];

const AvailabilityFilterPicker = ({ setFilters, filters }: Props) => {
  const Trigger = useBottomSheetImperative({
    content: (onClose) => {
      return (
        <View className="flex-1">
          {options.map((o, idx) => (
            <RectButton
              key={idx}
              onPress={() => {
                onClose();
                setFilters({
                  status: o.value as RentalPropertiesListParams["status"],
                });
              }}
              className="flex flex-row w-full items-center justify-start gap-4 p-6 border-b border-gray-200"
            >
              {filters?.status === o.value ? (
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
              {"Status: "}
            </Text>
            <Text className="text-slate-500 font-bold">
              {humanizeString(filters?.status ?? "All")}
            </Text>
          </View>
        </BaseButton>
      );
    },
  });
  return <>{Trigger}</>;
};

export default AvailabilityFilterPicker;
