import { Theme, globalStyles } from "@/constants";
import { Button } from "@/ui/Button";
import Card from "@/ui/Card";
import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useBuyPropertyAdPlacement } from "@/lib/placing-property-ad/use-buy-property-ad-placement";
import { ScrollView } from "react-native-gesture-handler";
import { formatPrice } from "@/lib/common/prices";
import { PropertyAdInputSchema } from "@/lib/property-ad/schemas";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { VariantRadioButton } from "@/components/motors/VariantRadioButton";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";
import { useMutation } from "@tanstack/react-query";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import BaseButton from "@/ui/BaseButton";
import { omit } from "lodash";
import { camelCaseToHumanReadable } from "@/lib/common/utils";

const OrderSummaryScreen = () => {
  const router = useRouter();
  const currentVariant = useVariantsContext((state) => state.currentVariant);
  const allVariants = useVariantsContext((state) => state.allVariants);

  const selectVariant = useVariantsContext((state) => state.setCurrentVariant);
  const { mutate: buyPropertyAdPlacement, isLoading: isBuyingAd } =
    useUploadImagesAndBuyPropertyAd();
  const handlePayment = async () => {
    buyPropertyAdPlacement(undefined, {
      onSuccess: () => {
        router.navigate("/(tabs)");
      },
    });
  };

  return (
    <PlaceAdLayout title="Order Summary">
      <ScrollView className="mb-4 px-4 pt-6 pb-4 relative flex-1 bg-gray-100">
        <View className="gap-4">
          <Card
            className="gap-2 p-0"
            style={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 18,
            }}
          >
            {allVariants.map((v) => (
              <VariantRadioButton
                label={v.options
                  .map((o) => camelCaseToHumanReadable(o.value))
                  .join(" / ")}
                key={v.id}
                isChecked={v.id === currentVariant?.id}
                badge_price={v.calculated_price!}
                setChecked={() =>
                  selectVariant({
                    id: v.id!,
                    price: v.calculated_price!,
                    option_values: v.options?.map((o) => o.value),
                    tax_price: v.calculated_tax,
                    tax_rates: v.tax_rates,
                    total_price: v.calculated_price_incl_tax,
                  })
                }
              />
            ))}
          </Card>
          {currentVariant ? (
            <Card
              className="gap-2 p-0"
              style={{
                paddingHorizontal: 16,
                paddingTop: 10,
                paddingBottom: 18,
              }}
            >
              <View className="py-2">
                <View
                  className="gap-0.5 py-3"
                  style={{ borderBottomWidth: 0.5, borderColor: Theme.border }}
                >
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">
                      Ad Posting Fee
                    </Text>
                    <Text>{`${formatPrice({
                      amount: currentVariant.price,
                      currency_code: "aed",
                    })}`}</Text>
                  </View>
                </View>
                {currentVariant.tax_rates
                  ? currentVariant.tax_rates.map((v, idx) => (
                      <View
                        key={idx}
                        className="gap-0.5 py-3"
                        style={{
                          borderBottomWidth: 0.5,
                          borderColor: Theme.border,
                        }}
                      >
                        <View className="flex-row justify-between">
                          <Text className="text-muted-foreground">
                            {v.name === "default" ? "VAT" : v.name}
                          </Text>
                          <Text>{`${v.rate} %`}</Text>
                        </View>
                      </View>
                    ))
                  : null}
                {currentVariant.tax_price ? (
                  <View
                    className="gap-0.5 py-3"
                    style={{
                      borderBottomWidth: 0.5,
                      borderColor: Theme.border,
                    }}
                  >
                    <View className="flex-row justify-between">
                      <Text className="text-muted-foreground">{"VAT"}</Text>
                      <Text>
                        {formatPrice({
                          amount: currentVariant.tax_price,
                          currency_code: "aed",
                        })}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </View>
              <View
                className="gap-0.5 py-3"
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: Theme.border,
                }}
              >
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">
                    {"Your ad will be published for 60 days only."}
                  </Text>
                </View>
              </View>
              <View className="py-2">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground font-bold text-xl">
                    Total
                  </Text>
                  <Text className="text-primary font-bold text-xl">{`${formatPrice(
                    {
                      amount: currentVariant.total_price ?? 0,
                      currency_code: "aed",
                    }
                  )}`}</Text>
                </View>
              </View>
            </Card>
          ) : null}
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
          onPress={handlePayment}
          isLoading={isBuyingAd}
        >
          <Text className="text-white font-bold text-xl">Pay Now</Text>
        </BaseButton>
      </View>
    </PlaceAdLayout>
  );
};

const useUploadImagesAndBuyPropertyAd = () => {
  const data = usePropertyAdStoreContext((state) => state.data);
  const currentVariant = useVariantsContext((state) => state.currentVariant);
  const { mutateAsync: buyPropertyAdPlacement } = useBuyPropertyAdPlacement();
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
  return useMutation({
    mutationFn: async () => {
      if (!currentVariant) return;
      const propertyAdFormData = omit(data, [
        "child_category",
        "parent_category",
      ]) as PropertyAdInputSchema;
      const uploadedImages = propertyAdFormData.images
        ? await uploadFiles(propertyAdFormData.images)
        : undefined;
      return await buyPropertyAdPlacement({
        variant_id: currentVariant.id,
        property_ad: {
          ...propertyAdFormData,
          images: uploadedImages?.parsedForServer ?? [],
        },
      });
    },
  });
};

export default OrderSummaryScreen;
