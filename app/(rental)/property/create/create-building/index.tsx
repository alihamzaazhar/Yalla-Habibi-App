import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import { Theme } from "@/constants";
import BaseButton from "@/ui/BaseButton";
import { Button } from "@/ui/Button";
import Input from "@/ui/Input";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const SelectBuilding = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [errorMessage, setFieldError] = React.useState<string | undefined>(
    undefined
  );

  return (
    <WithFormHeaderLayout title="Create a building" className="relative flex-1">
      <View className="px-4 py-6">
        <Input
          className="h-14 text-xl bg-gray-200"
          placeholder="Building Name"
          placeholderTextColor={`hsl(${Theme.colors.muted.foreground})`}
          cursorColor={`hsl(${Theme.colors.muted.foreground})`}
          value={value}
          onChangeText={(t) => setValue(t)}
        />
        <View className="mt-2">
          {errorMessage ? (
            <View className="bg-red-600 px-6 items-center py-4 rounded-md mt-12 flex-row gap-4">
              <AntDesign
                name="warning"
                size={24}
                color={`hsl(${Theme.colors.primary.foreground})`}
              />
              <Text className="text-white text-lg font-bold text-wrap flex-1 flex-wrap">
                {errorMessage}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="mt-10 absolute bottom-0 w-full px-4 py-6">
        <BaseButton
          ButtonProps={{
            style:{
              width:'100%',
              backgroundColor: Theme.primary.DEFAULT,
            }
          }}
          className="w-full"
          variant={'default'}
          onPress={() => {
            if (value.length > 0) {
              router.navigate({
                pathname:
                  "/(rental)/property/create/create-building/add-location",
                params: {
                  buildingName: value,
                },
              });
            } else {
              setFieldError("Please enter a building name");
            }
          }}
        >
          <Text className="text-white font-bold text-2xl">Next</Text>
        </BaseButton>
      </View>
    </WithFormHeaderLayout>
  );
};

export default SelectBuilding;
