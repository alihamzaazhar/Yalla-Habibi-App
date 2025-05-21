import { useProperty } from "@/api/hooks/marketplace/services/properties/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Theme } from "@/constants";
import { convertObjectNullFieldsToUndefined } from "@/lib/common/utils";
import PropertyAdStoreProvider from "@/lib/property-ad/property-ad-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const { id } = useLocalSearchParams();
  const { data, status } = useProperty({ id: id as string });
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
  const { response, ...data_ } = data;
  const data__ = convertObjectNullFieldsToUndefined(data_);
  return (
    <NoHeaderLayout>
      <PropertyAdStoreProvider
        data={{
          ...data__,
          id: data.id,
          selling_mode: data.selling_mode,
          parent_category: data.parent_category,
          child_category: data.child_category,
          category_id: data.categories?.[0]?.id,
          location: data.location
            ? {
                lng: data.location.coordinates[0],
                lat: data.location.coordinates[1],
              }
            : undefined,
        }}
      >
        <Stack>
          <Stack.Screen name="edit-details" />
          <Stack.Screen name="edit-features" />
          <Stack.Screen name="edit-location" />
          <Stack.Screen name="edit-extra-details" />
          <Stack.Screen name="edit-primary-category" />
          <Stack.Screen name="edit-secondary-category" />
        </Stack>
      </PropertyAdStoreProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
