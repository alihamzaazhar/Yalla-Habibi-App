import { useRentalProperty } from "@/api/hooks/rental-properties/queries";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { Theme } from "@/constants";
import { convertObjectNullFieldsToUndefined } from "@/lib/common/utils";
import RentalPropertyStoreProvider from "@/lib/rental-property/property/rental-property-store-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const Layout = () => {
  const { id } = useLocalSearchParams();
  const { data, status } = useRentalProperty(id as string);
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
  const { rental_property } = data;
  const data_ = convertObjectNullFieldsToUndefined(rental_property);
  return (
    <RentalPropertyStoreProvider
      data={{
        id: data_.id,
        apartment_number: data_.apartment,
        floor_number: data_.floor,
        building_id: data_.building_id,
        building: data_.building
          ? {
              id: data_.building.id,
              name: data_.building.name,
            }
          : undefined,
        landlord_address: data_.landlord?.address,
        landlord_email: data_.landlord?.email,
        landlord_name: data_.landlord?.name,
        landlord_phone_number: data_.landlord?.phone,
        name: data_.title,
        variants: data_.spaces,
      }}
    >
      <NoHeaderLayout>
        <Stack>
          <Stack.Screen name="edit-basic-details" options={{presentation:"modal"}} />
          <Stack.Screen name="edit-landlord-details" options={{presentation:"modal"}} />
          <Stack.Screen name="edit-room-details" options={{presentation:"modal"}} />
        </Stack>
      </NoHeaderLayout>
    </RentalPropertyStoreProvider>
  );
};

export default Layout;
