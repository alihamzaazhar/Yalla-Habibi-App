import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { globalStyles } from "@/constants";
import { SPACE_TYPES } from "@/constants/enums";
import { humanizeString } from "@/lib/common/utils";
import RippleButton from "@/ui/animations/RippleButton";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const SelectSpaceType = () => {
  const router = useRouter();
  return (
    <PlaceAdLayout title="Select Space Type" className="relative flex-1">
      <View className="flex-1 gap-4 px-4 py-6">
        {SPACE_TYPES.map((type) => (
          <RippleButton
            key={type}
            rippleClassName="bg-gray-100"
            onPress={() => {
              router.navigate({
                pathname: `/(rental)/tenant/create/select-available-space`,
                params: {
                  spaceType: type,
                },
              });
            }}
          >
            <Pressable
              className="gap-2 items-center justify-between flex-row bg-white px-5 py-4 rounded-lg"
              style={[globalStyles.shadowSm]}
            >
              <Text className="text-lg font-medium">
                {humanizeString(type)}
              </Text>
            </Pressable>
          </RippleButton>
        ))}
      </View>
    </PlaceAdLayout>
  );
};

export default SelectSpaceType;
