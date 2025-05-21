import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import RentalPropertyStoreProvider from "@/lib/rental-property/property/rental-property-store-context";
import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <NoHeaderLayout>
      <RentalPropertyStoreProvider>
        <Stack>
          <Stack.Screen name="index" />
          <Stack.Screen
            name="create-building"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen name="property-basic-details" />
          <Stack.Screen name="property-landlord-details" />
          <Stack.Screen name="property-room-details" />
        </Stack>
      </RentalPropertyStoreProvider>
    </NoHeaderLayout>
  );
};

export default Layout;
