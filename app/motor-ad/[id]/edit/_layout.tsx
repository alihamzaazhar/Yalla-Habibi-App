import { useMotorAd } from "@/api/hooks/marketplace/services/motors/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Theme } from "@/constants";
import { convertObjectNullFieldsToUndefined } from "@/lib/common/utils";
import MotorAdStoreProvider from "@/lib/motors-ad/context/motor-ad-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const id = useLocalSearchParams().id as string;
  const { data, status } = useMotorAd({ id: id as string });
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
  const { motorAd } = data;
  const data_ = convertObjectNullFieldsToUndefined(motorAd);
  return (
    <NoHeaderLayout>
      <MotorAdStoreProvider
        data={{
          ...data_,
          extra_features: data.motorAd.extra_features,
          categories: data.motorAd.categories?.map((c) => c.id) ?? [],
          location: data_.location
            ? {
                lng: data_.location.coordinates[0],
                lat: data_.location.coordinates[1],
              }
            : undefined,
        }}
        metadata={{
          categories: data.motorAd.categories?.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.id]: {
                id: curr.id,
                name: curr.name,
                handle: curr.handle,
              },
            };
          }, {}),
        }}
      >
        <Stack>
          <Stack.Screen name="edit-details" />
          <Stack.Screen name="edit-location" />
          <Stack.Screen name="edit-features" />
          <Stack.Screen name="edit-images" />
          <Stack.Screen name="edit-extra-features" />
        </Stack>
      </MotorAdStoreProvider>
    </NoHeaderLayout>
  );
};
export default Layout;
