import useServices from "@/api/hooks/marketplace/services/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import VariantsProvider from "@/lib/placing-ad/variants-context";
import { PROPERTY_SALE_TYPE_ENUM } from "@/lib/property-ad/schemas";
import PropertyAdStoreProvider from "@/lib/property-ad/property-ad-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const Layout = () => {
  const { data } = useServices();
  const { selling_mode } = useLocalSearchParams();
  const propertyAdService = data?.get("property_ads")?.[0];
  if (!propertyAdService) return <View>404</View>;

  return (
    <NoHeaderLayout>
      <VariantsProvider serviceProduct={propertyAdService}>
        <PropertyAdStoreProvider
          data={{
            selling_mode:
              selling_mode as (typeof PROPERTY_SALE_TYPE_ENUM)[number],
          }}
        >
          <Stack>
            <Stack.Screen name="add-details" />
            <Stack.Screen name="add-features" />
            <Stack.Screen name="add-location" />
            <Stack.Screen name="add-extra-details" />
            <Stack.Screen name="order-summary" />
            <Stack.Screen name="select-primary-category" />
            <Stack.Screen name="select-secondary-category" />
          </Stack>
        </PropertyAdStoreProvider>
      </VariantsProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
