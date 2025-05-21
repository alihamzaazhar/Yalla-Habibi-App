import { useRentalTenant } from "@/api/hooks/rental-properties/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Theme } from "@/constants";
import { convertObjectNullFieldsToUndefined } from "@/lib/common/utils";
import RentalBookingStoreProvider from "@/lib/rental-property/tenant/tenant-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const id = useLocalSearchParams().id as string;
  const { data, status } = useRentalTenant(id as string);
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
  const { booking } = data;
  const data_ = convertObjectNullFieldsToUndefined(booking);
  return (
    <NoHeaderLayout>
      <RentalBookingStoreProvider
        data={{
          address: data_.tenant?.address,
          name: data_.tenant?.name,
          phone: data_.tenant?.phone,
          total_keys: data_.keys_count,
          total_kids: data_.kids_count,
          total_tenants: data_.tenants_count,
          contract_starts_at: data_.contract_starts_at
            ? new Date(data_.contract_starts_at)
            : undefined,
          id: data_.id,
        }}
      >
        <Stack>
          <Stack.Screen name="edit-basic-details" />
        </Stack>
      </RentalBookingStoreProvider>
    </NoHeaderLayout>
  );
};
export default Layout;
