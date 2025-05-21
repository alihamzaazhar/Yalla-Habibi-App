import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MotorCard, { MotorCardSkeleton } from "./MotorCard";
import {
  MarketplaceListMotorAdsParams,
  useMotorAds,
} from "@/api/hooks/marketplace/services/motors/queries";
import { cn } from "@/lib/common/utils";
type Props = MarketplaceListMotorAdsParams & {
  containerClassName?: string;
};

const MotorsList = ({
  exceptIds,
  containerClassName,
  ...props
}: Props & { exceptIds?: string[] }) => {
  const { data, status } = useMotorAds({
    limit: 8,
    ...props,
  });

  if (status === "loading") {
    return (
      <ScrollView
        horizontal
        contentContainerClassName="gap-4 px-4 pt-2 pb-4 flex-row"
      >
        <MotorCardSkeleton />
        <MotorCardSkeleton />
        <MotorCardSkeleton />
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
  const data_ = data.motorAds.filter((ad) => !exceptIds?.includes(ad.id));
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={cn("gap-4 px-4 pt-2 pb-4", containerClassName)}
    >
      {data_.map((motor) => (
        <MotorCard
          key={motor.id}
          id={motor.id}
          categories={motor.categories}
          isPremium={motor.is_premium}
          isFavourite={motor.is_favourite}
          thumbnail={{ url: motor.thumbnail ?? motor.images?.[0]?.url }}
          price={motor.price}
          location={
            motor.location
              ? {
                  lng: motor.location.coordinates[0],
                  lat: motor.location.coordinates[1],
                }
              : {
                  lng: 0,
                  lat: 0,
                }
          }
        />
      ))}
    </ScrollView>
  );
};

export default MotorsList;
