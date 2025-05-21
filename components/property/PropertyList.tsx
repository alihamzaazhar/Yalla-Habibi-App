import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  MarketplaceListPropertiesParams,
  useProperties,
} from "@/api/hooks/marketplace/services/properties/queries";
import PropertyCard, { PropertyCardSkeleton } from "./PropertyCard";
import { cn } from "@/lib/common/utils";

type Props = MarketplaceListPropertiesParams & {
  containerClassName?: string;
};
const PropertyList = ({
  is_premium,
  selling_mode,
  exceptIds,
  containerClassName,
  ...props
}: Props & { exceptIds?: string[] }) => {
  const { data, status } = useProperties({
    limit: 8,
    is_premium: is_premium,
    selling_mode,
    ...props,
  });

  
  if (status === "loading") {
    return (
      <ScrollView
        horizontal
        contentContainerClassName="gap-4 px-4 pt-2 pb-4 flex-row"
      >
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </ScrollView>
    );
  }
  if (status === "error") {
    return (
      <View className="items-start flex-row">
        <Text>Failed to load properties</Text>
      </View>
    );
  }
  const data_ = data.properties.filter((p) => !exceptIds?.includes(p.id));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={cn("gap-4 px-4 pt-2 pb-4", containerClassName)}
    >
      {data_.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          is_favourite={property.is_favourite}
          thumbnail={property.thumbnail}
          price={property.price}
          beds={property.bedroom_count}
          baths={property.bathroom_count}
          is_premium={property.is_premium}
          area={property.area ?? 0}
          location={
            property.location
              ? {
                  lng: property.location.coordinates[0],
                  lat: property.location.coordinates[1],
                }
              : {
                  lat: 0,
                  lng: 0,
                }
          }
        />
      ))}
    </ScrollView>
  );
};

export default PropertyList;
