import { Theme, globalStyles } from "@/constants";
import Card from "@/ui/Card";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { formatPrice } from "@/lib/common/prices";
import { usePurchaseMotorAd } from "@/lib/placing-motors-ad/hooks/usePurchaseMotorAd";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";
import { VariantRadioButton } from "@/components/motors/VariantRadioButton";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import BaseButton from "@/ui/BaseButton";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import MotorBadgeVariants from "@/components/motors/MotorBadgeVariants";
import { useCreateCartForDigitalProduct } from "@/api/hooks/vendor/mutations";
import { useGetCart } from "@/api/hooks/cart/queries";
import { useUpdateCart } from "@/api/hooks/cart/mutations";

//[Todo]
// - Show all variants, and make them selectable, make their label as combination of options title
// - This should be default behaviour
const OrderSummaryPrimaryVariant = () => {
  const router = useRouter();
  const currentVariant = useVariantsContext((store) => store.currentVariant);
  const selectVariant = useVariantsContext((store) => store.setCurrentVariant);
  const allVariants = useVariantsContext((store) => store.allVariants);
  const [badgeVariantId, setBadgeVariantId] = useState<{
    id: string;
    calculated_price: number;
  } | null>(null);
  const defaultPackageVariant = allVariants.find((v) => {
    const isDefaultPackageVariant = v.options?.find(
      (o) => o.value === "defaultPackage"
    );
    if (!isDefaultPackageVariant) return false;
    for (const option of v.options ?? []) {
      if (option.value === "defaultPackage") continue;
      if (!currentVariant?.option_values?.includes(option.value)) return false;
    }
    return true;
  });
  const premiumPackageVariant = allVariants.find((v) => {
    const isPremiumPackageVariant = v.options?.find(
      (o) => o.value === "premiumPackage"
    );
    if (!isPremiumPackageVariant) return false;
    for (const option of v.options ?? []) {
      if (option.value === "premiumPackage") continue;
      if (!currentVariant?.option_values?.includes(option.value)) return false;
    }
    return true;
  });

  const persistedDataId = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: purchaseAd, status: purchaseAdStatus } = usePurchaseMotorAd();
  const handlePayment = async () => {
    if (!persistedDataId || !currentVariant) {
      return;
    }
    let variants = [
      {
        variant_id: currentVariant?.id,
        metadata: {
          motor_ad_id: persistedDataId,
        } as Record<string, unknown>,
      },
    ];
    if (badgeVariantId) {
      variants.push({
        variant_id: badgeVariantId?.id,
        metadata: {},
      });
    }

    purchaseAd(
      {
        variants: variants,
      },
      {
        onSuccess: () => {
          router.navigate("/(tabs)");
        },
      }
    );
  };

  const handleBadgeVariantSelect = (
    variant: {
      id: string;
      calculated_price: number;
    } | null
  ) => {
    setBadgeVariantId(variant);
  };
  if (
    !currentVariant ||
    !persistedDataId ||
    !defaultPackageVariant ||
    !premiumPackageVariant
  ) {
    return <Text>404 | Order Summary</Text>;
  }

  //Assuming this for now, needs better cart management
  const taxRate = allVariants?.[0].tax_rates?.[0]?.rate ?? 0;
  const totalPrice =
    currentVariant.price + (badgeVariantId?.calculated_price ?? 0);

  const totalTax = totalPrice * (taxRate / 100);
  const totalPriceWithTax = totalPrice + totalTax;
  return (
    <PlaceAdLayout title="Order Summary">
      <ScrollView contentContainerClassName="px-4 py-4 relative">
        <View className="gap-4">
          <View>
            <MotorBadgeVariants onVariantSelect={handleBadgeVariantSelect} />
          </View>
          <Card
            className="gap-2 p-0 flex-1"
            style={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 18,
            }}
          >
            <Text className="text-lg font-bold">Choose your Package</Text>
            <View className="gap-2">
              <VariantRadioButton
                label={"Default Package"}
                isChecked={defaultPackageVariant.id === currentVariant?.id}
                badge_price={defaultPackageVariant.calculated_price!}
                setChecked={() =>
                  selectVariant({
                    id: defaultPackageVariant.id!,
                    price: defaultPackageVariant.calculated_price!,
                    option_values: defaultPackageVariant.options?.map(
                      (o) => o.value
                    ),
                  })
                }
              />
              <VariantRadioButton
                label={"Premium Package"}
                isChecked={premiumPackageVariant.id === currentVariant?.id}
                badge_price={premiumPackageVariant.calculated_price!}
                setChecked={() =>
                  selectVariant({
                    id: premiumPackageVariant.id!,
                    price: premiumPackageVariant.calculated_price!,
                    option_values: premiumPackageVariant.options?.map(
                      (o) => o.value
                    ),
                  })
                }
              />
            </View>
          </Card>
          <Card
            className="gap-2 p-0 flex-1"
            style={{
              paddingHorizontal: 16,
              paddingTop: 10,
              paddingBottom: 18,
            }}
          >
            <Text className="text-lg font-bold">Order Summary</Text>
            <View
              className="gap-0.5 pt-4 pb-4"
              style={{ borderBottomWidth: 0.5, borderColor: Theme.border }}
            >
              <View className="flex-row justify-between">
                <Text className="text-muted-foreground">Ad Posting Fee</Text>
                <Text>{`${formatPrice({
                  amount: currentVariant.price,
                  currency_code: "aed",
                })}`}</Text>
              </View>
              {badgeVariantId ? (
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">Badge Fee</Text>
                  <Text>{`${formatPrice({
                    amount: badgeVariantId.calculated_price,
                    currency_code: "aed",
                  })}`}</Text>
                </View>
              ) : null}

              <View className="gap-0.5 py-3">
                <View className="flex-row justify-between">
                  <Text className="text-muted-foreground">{"VAT"}</Text>
                  <Text>
                    {formatPrice({
                      amount: totalTax,
                      currency_code: "aed",
                    })}
                  </Text>
                </View>
              </View>
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
                    amount: totalPriceWithTax,
                    currency_code: "aed",
                  }
                )}`}</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
      <View className="p-6 w-full bg-white" style={globalStyles.shadowMd}>
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
          isLoading={purchaseAdStatus === "loading"}
        >
          <Text className="text-white font-bold text-xl">Pay Now</Text>
        </BaseButton>
      </View>
    </PlaceAdLayout>
  );
};

export default OrderSummaryPrimaryVariant;
