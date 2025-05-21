import React from "react";
import { Text, View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Theme, globalStyles } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";

import { useRouter } from "expo-router";
import VariantSelectCard from "@/components/motors/VariantSelectCard";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";
import BaseButton from "@/ui/BaseButton";

const points = {
  platform: ["Fastest way to sell your car", "Sell at a good price"],
  vendor: ["Can manage your ad", "Recieve messages from buyers"],
};
const title = {
  platform: "We will sell your car",
  vendor: "Use our platform to sell your car",
};
const SelectPrimaryVariant = () => {
  const router = useRouter();
  const currentVariant = useVariantsContext((state) => state.currentVariant);
  const allVariants = useVariantsContext((state) => state.allVariants);
  const setCurrentVariant = useVariantsContext(
    (state) => state.setCurrentVariant
  );

  const primaryVariants = allVariants
    .filter(
      (v) =>
        v.options?.find(
          (o) => o.value === "vendor" || o.value === "platform"
        ) &&
        v.options?.find((o) => o.value === "defaultPackage") &&
        v.options?.find((o) => o.value === "null")
    )
    .map((v) => ({
      id: v.id!,
      price: v.calculated_price!,
      option_values: v.options?.map((o) => o.value),
      value: v.options?.find(
        (o) => o.value === "vendor" || o.value === "platform"
      )?.value as keyof typeof points,
    }));

  if (!primaryVariants.length) {
    return (
      <StackScreenLayout title="" className="bg-transparent">
        <Text>No variants available</Text>
      </StackScreenLayout>
    );
  }
  return (
    <StackScreenLayout title="" className="bg-transparent">
      <ScrollView className="mb-4 px-6 pt-6 pb-4 relative flex-1">
        <Text className="font-medium text-4xl text-center mb-8">
          Choose how fast you want to sell your car
        </Text>
        <View className="flex-1 px-2 py-6 gap-4">
          {primaryVariants.map((v, idx) => (
            <VariantSelectCard
              key={idx}
              onPress={() => setCurrentVariant(v)}
              title={title[v.value]}
              price={v.price}
              points={points[v.value]}
              isSelected={currentVariant?.id === v.id}
            />
          ))}
        </View>
      </ScrollView>
      <View
        className="absolute bottom-0 p-6 w-full bg-white"
        style={globalStyles.shadowMd}
      >
        <BaseButton
          ButtonProps={{
            style: {
              width: "100%",
              backgroundColor: Theme.primary.DEFAULT,
            },
          }}
          className="w-full"
          variant={"default"}
          disabled={!currentVariant}
          onPress={() => {
            if (currentVariant?.option_values?.includes("vendor")) {
              // When vendors wants to manage their own ad
              router.navigate(
                "/(modals)/place-add/motors/select-secondary-variant"
              );
            } else if (currentVariant?.option_values?.includes("platform")) {
              router.navigate("/(modals)/place-add/motors/order-summary");
            }
          }}
        >
          <Text className="text-white font-bold text-xl">Next</Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
};

export default SelectPrimaryVariant;
