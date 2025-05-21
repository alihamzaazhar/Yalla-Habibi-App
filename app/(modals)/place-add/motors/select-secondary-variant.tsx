import React from "react";
import { Text, View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Theme, globalStyles } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import VariantSelectCard from "@/components/motors/VariantSelectCard";
import { useRouter } from "expo-router";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";
import BaseButton from "@/ui/BaseButton";

const SelectSecondaryVariant = () => {
  const router = useRouter();
  const currentVariant = useVariantsContext((state) => state.currentVariant);
  const setCurrentVariant = useVariantsContext(
    (state) => state.setCurrentVariant
  );

  const allOptions = useVariantsContext((state) => state.productOptions);
  const packageTypeOption = allOptions.find((o) => o.title === "PackageType");
  const activationTypeOption = allOptions.find(
    (o) => o.title === "ActivationTime"
  );
  const sellingModeOption = allOptions.find(
    (o) => o.title === "PlatformActsAs"
  );
  const allVariants = useVariantsContext((state) => state.allVariants);

  const activationTimeVariants = allVariants
    .filter((v) => {
      const packageOptionValue = v.options?.find(
        (o) => o.option_id === packageTypeOption?.id
      );
      const activationOptionValue = v.options?.find(
        (o) => o.option_id === activationTypeOption?.id
      );
      const sellingModeOptionValue = v.options?.find(
        (o) => o.option_id === sellingModeOption?.id
      );
      if (
        !packageOptionValue ||
        !activationOptionValue ||
        !sellingModeOptionValue
      )
        return false;
      if (activationOptionValue.value === "null") return false;
      return (
        currentVariant?.option_values?.includes(packageOptionValue.value) &&
        currentVariant?.option_values?.includes(sellingModeOptionValue.value)
      );
    })
    .map((v) => ({
      id: v.id!,
      price: v.calculated_price!,
      option_values: v.options?.map((o) => o.value),
      value: v.options?.find((o) => o.option_id === activationTypeOption?.id)
        ?.value as keyof typeof points,
    }));
  if (!activationTimeVariants.length) {
    return (
      <StackScreenLayout title="" className="bg-transparent">
        <Text>No variants available</Text>
      </StackScreenLayout>
    );
  }
  const points = {
    "15": ["Can edit your ad 1 time only"],
    "30": ["Can edit your ad 1 time only", "Featured for 7 days"],
    "60": ["Can edit your ad 1 time only", "Featured for 14 days"],
  };
  return (
    <StackScreenLayout title="" className="bg-transparent">
      <ScrollView className="mb-4 px-6 pt-6 pb-4 relative flex-1">
        <Text className="font-medium text-4xl text-center mb-8">
          Select Your Bundle
        </Text>
        <View className="flex-1 px-2 py-6 gap-4">
          {activationTimeVariants.map((v, idx) => (
            <VariantSelectCard
              key={idx}
              onPress={() => setCurrentVariant(v)}
              title={"Active for " + v.value + " days"}
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
          disabled={!currentVariant?.id}
          onPress={() => {
            router.navigate("/(modals)/place-add/motors/order-summary");
          }}
        >
          <Text className="text-white font-bold text-xl">Next</Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
};

export default SelectSecondaryVariant;
