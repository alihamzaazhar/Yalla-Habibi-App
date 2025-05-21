import useServices from "@/api/hooks/marketplace/services/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import CouponAdStoreProvider from "@/lib/coupons/coupon-ad-store-context";
import VariantsProvider from "@/lib/placing-ad/variants-context";
import { Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Layout = () => {
  const { data } = useServices();
  const couponAdService = data?.get("coupon_ads")?.[0];

  if (!couponAdService)
    return (
      <View>
        <Text>404</Text>
      </View>
    );

  return (
    <NoHeaderLayout>
      <CouponAdStoreProvider>
        <VariantsProvider serviceProduct={couponAdService}>
          <Stack>
            <Stack.Screen name="set-coupon-collection" />
            <Stack.Screen name="add-details" />
            <Stack.Screen name="order-summary" />
          </Stack>
        </VariantsProvider>
      </CouponAdStoreProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
