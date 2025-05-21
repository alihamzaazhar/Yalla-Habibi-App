import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import { PROPERTY_SALE_TYPE_ENUM } from "@/lib/property-ad/schemas";
import { PropertiesFilterProvider } from "@/lib/property-ad/context/properties-filter";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";

type Props = {};

const Layout = (props: Props) => {
  const params = useLocalSearchParams();
  const selling_mode = params.selling_mode as
    | (typeof PROPERTY_SALE_TYPE_ENUM)[number]
    | undefined;
  
  return (
    <PropertiesFilterProvider initalFilters={{ selling_mode, order:'-created_at' }}>
      <NoHeaderLayout>
        <Stack>
          <Stack.Screen name="see-more" options={{headerShown:false}} />
          <Stack.Screen name="filters" />
        </Stack>
      </NoHeaderLayout>
    </PropertiesFilterProvider>
  );
};

export default Layout;
