import { Theme } from "@/constants";
import BaseButton from "@/ui/BaseButton";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";
import { View } from "react-native";

type Props = {
  returnPath?: string;
};

const BuildingSelectFilterPicker = ({
  returnPath = "/(rental)/property",
}: Props) => {
  const searchParams = useLocalSearchParams();
  const router = useRouter();
  return (
    <View>
      <BaseButton
        onPress={() => {
          router.navigate({
            pathname: "/(filters)/select-building",
            params: searchParams
              ? {
                  ...searchParams,
                  returnPath: returnPath,
                }
              : {
                  returnPath: returnPath,
                },
          });
        }}
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
            {"Building: "}
          </Text>
          <Text className="text-slate-500 font-bold">
            {searchParams.buildingId ? searchParams.buildingName ?? "" : "All"}
          </Text>
        </View>
      </BaseButton>
    </View>
  );
};

export default BuildingSelectFilterPicker;
