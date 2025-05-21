import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { MotorAdsFilterProvider } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

const Layout = () => {
  const searchParams = useLocalSearchParams();
  const is_premium = searchParams.is_premium as string;
  return (
    <MotorAdsFilterProvider
      initalFilters={{
        is_premium: is_premium === "true" ? true : undefined,
      }}
    >
      <NoHeaderLayout>
        <Stack>
          <Stack.Screen name="see-more" options={{ headerShown: false }} />
          <Stack.Screen name="filters/index" />
          <Stack.Screen name="filters/search-categories" />
        </Stack>
      </NoHeaderLayout>
    </MotorAdsFilterProvider>
  );
};

export default Layout;
