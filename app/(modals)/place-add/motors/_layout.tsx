import useServices from "@/api/hooks/marketplace/services/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import MotorAdStoreProvider from "@/lib/motors-ad/context/motor-ad-store-context";
import VariantsProvider from "@/lib/placing-ad/variants-context";
import { Stack } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const Layout = () => {
  const { data } = useServices();
  const motorAdService = data?.get("motor_ads");

  const motorAdServicePlacementProduct = motorAdService?.find(
    (v) => v.handle === "motors-ad-placement-service"
  );
  if (!motorAdServicePlacementProduct) {
    return (
      <View>
        <Text>404</Text>
      </View>
    );
  }

  return (
    <NoHeaderLayout>
      <MotorAdStoreProvider>
        <VariantsProvider serviceProduct={motorAdServicePlacementProduct}>
          <Stack>
            <Stack.Screen name="select-vehicle-type" />
            <Stack.Screen name="select-car-make" />
            <Stack.Screen name="select-car-model" />
            <Stack.Screen name="select-primary-variant" />
            <Stack.Screen name="select-secondary-variant" />
            <Stack.Screen name="order-summary" />
            <Stack.Screen name="add-details" />
            <Stack.Screen name="add-location" />
            <Stack.Screen name="add-features" />
            <Stack.Screen name="add-extra-features" />
            <Stack.Screen name="add-images" />
          </Stack>
        </VariantsProvider>
      </MotorAdStoreProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
