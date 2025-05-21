import { useCouponAd } from "@/api/hooks/marketplace/services/coupons/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Theme } from "@/constants";
import { convertObjectNullFieldsToUndefined } from "@/lib/common/utils";
import CouponAdStoreProvider from "@/lib/coupons/coupon-ad-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const id = useLocalSearchParams().id as string;
  const { data, status } = useCouponAd(id);
  if (status === "loading") {
    return (
      <NoHeaderLayout>
        <View className="flex-1 gap-4 bg-gray-100 items-center justify-center">
          <ActivityIndicator size={"large"} color={Theme.gray[600]} />
        </View>
      </NoHeaderLayout>
    );
  }
  if (status === "error") {
    return (
      <NoHeaderLayout>
        <Text>Something went wrong</Text>
      </NoHeaderLayout>
    );
  }
  const { couponAd } = data;
  const data_ = convertObjectNullFieldsToUndefined(couponAd);
  return (
    <NoHeaderLayout>
      <CouponAdStoreProvider
        data={{
          id: data_.id,
          collection_id: data_.collection?.id,
          description: data_.description,
          images: data_.images,
          price: data_.variants?.[0].prices?.[0]?.amount,
          title: data_.title,
          coupon_code: data_.metadata?.coupon_code,
          discount_price: data_.variants?.[0]?.prices?.[0]?.discount?.value,
        }}
      >
        <Stack>
          <Stack.Screen name="edit-coupon-collection" />
          <Stack.Screen name="edit-details" />
        </Stack>
      </CouponAdStoreProvider>
    </NoHeaderLayout>
  );
};
export default Layout;
