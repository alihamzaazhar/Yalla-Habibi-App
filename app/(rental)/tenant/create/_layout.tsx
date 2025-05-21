import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import RentalBookingStoreProvider from "@/lib/rental-property/tenant/tenant-store-context";
import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <NoHeaderLayout>
      <RentalBookingStoreProvider>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen name="select-space-type" />
          <Stack.Screen name="select-available-space" />
          <Stack.Screen name="add-further-details" />
        </Stack>
      </RentalBookingStoreProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
