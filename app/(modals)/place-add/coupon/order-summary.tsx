import { Theme, globalStyles } from "@/constants";
import Card from "@/ui/Card";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { formatPrice } from "@/lib/common/prices";
import { useRouter } from "expo-router";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";
import { usePurchaseAd } from "@/lib/placing-ad/hooks/usePurchaseAd";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import BaseButton from "@/ui/BaseButton";
import { useCouponAdStoreContext } from "@/lib/coupons/coupon-ad-store-context";
import { VariantRadioButton } from "@/components/motors/VariantRadioButton";
import { camelCaseToHumanReadable } from "@/lib/common/utils";

const OrderSummary = () => {
  const router = useRouter();
  const { currentVariant, setCurrentVariant, allVariants } = useVariantsContext(
    (store) => store
  );
  const couponId = useCouponAdStoreContext((store) => store.data?.id);
  const { mutate: purchaseAd, status: purchaseAdStatus } = usePurchaseAd();

  if (!currentVariant || !couponId) {
    return <Text>404 | Order Summary</Text>;
  }

  const handlePayment = async () => {
    if (!couponId) {
      return;
    }
    purchaseAd(
      {
        variant_id: currentVariant.id,
        vendor_ad_id: couponId,
        placement_service_type: "coupon_ads",
      },
      {
        onSuccess: () => {
          router.navigate("/(tabs)");
        },
      }
    );
  };

  return (
    <PlaceAdLayout title="Order Summary">
      <ScrollView className="mb-4 px-4 pt-6 pb-4 relative flex-1">
        <View className="gap-8">
          <Card>
            {allVariants.map((v) => (
              <VariantRadioButton
                label={v.options
                  .map((o) => camelCaseToHumanReadable(o.value))
                  .join(" / ")}
                key={v.id}
                isChecked={v.id === currentVariant?.id}
                badge_price={v.calculated_price!}
                setChecked={() =>
                  setCurrentVariant({
                    id: v.id!,
                    price: v.calculated_price!,
                    option_values: v.options?.map((o) => o.value),
                    tax_price: v.calculated_tax,
                    total_price: v.calculated_price_incl_tax,
                    tax_rates: v.tax_rates,
                  })
                }
              />
            ))}
          </Card>

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
                  <Text className="text-muted-foreground">Ad Posting Fee</Text>
                  <Text>{`${formatPrice({
                    amount: currentVariant.price,
                    currency_code: "aed",
                  })}`}</Text>
                </View>
              </View>
              {currentVariant.tax_rates
                ? currentVariant.tax_rates.map((v,idx) => (
                    <View
                      className="gap-0.5 py-3"
                      key={idx}
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
              <View
                  className="gap-0.5 py-3"
                  style={{
                    borderBottomWidth: 0.5,
                    borderColor: Theme.border,
                  }}
                >
                  <View className="flex-row justify-between">
                    <Text className="text-muted-foreground">{"Your ad will be published for 60 days only."}</Text>
                  </View>
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
        </View>
      </ScrollView>
      <View className="p-6 w-full bg-white" style={globalStyles.shadowMd}>
        <BaseButton
          className="bg-primary items-center w-full"
          onPress={handlePayment}
          isLoading={purchaseAdStatus === "loading"}
        >
          <Text className="text-white font-bold text-xl">Pay Now</Text>
        </BaseButton>
      </View>
    </PlaceAdLayout>
  );
};

export default OrderSummary;
