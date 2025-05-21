import { Theme, globalStyles } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Image, Text, View } from "react-native";
import { formatPrice } from "@/lib/common/prices";
import useReverseGeocoding from "@/api/hooks/address/queries";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FavouriteButtonSmall } from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";
import { Category } from "@/api/types";
import { sortCategoriesByParent } from "@/lib/common/utils";
import PremiumTag from "../shared/atoms/PremiumTag";

interface Props {
  id: string;
  price: number;
  categories: Array<Category>;
  location: {
    lat: number;
    lng: number;
  };
  thumbnail?: { url: string };
  isFavourite: boolean;
  isPremium?: boolean;
}

const MotorCard = ({
  id,
  thumbnail,
  location,
  price,
  isFavourite,
  isPremium,
  categories,
}: Props) => {
  const { data: address, status: addressStatus } = useReverseGeocoding({
    coordinates: {
      latitude: location.lat,
      longitude: location.lng,
    },
  });
  const sortedCategories = sortCategoriesByParent(categories).splice(1);
  return (
    <Link href={`/motor-ad/${id}`}>
      <RectButton
        className="overflow-hidden rounded-lg"
        ButtonProps={{
          style: [
            {
              width: 180,
              backgroundColor: Theme.card.DEFAULT,
              borderRadius: 8,
              overflow: "hidden",
              borderColor: Theme.gray[200],
            },
            globalStyles.shadowSm,
          ],
        }}
      >
        <View className="relative">
          <Image
            source={
              thumbnail
                ? { uri: thumbnail.url }
                : require("@/assets/images/sample-image.png")
            }
            style={{ height: 180, width: "100%", objectFit: "cover" }}
          />
          <FavouriteButtonSmall
            id={id}
            type="motor_ad"
            isFavourite={isFavourite}
          />
          {isPremium ? <PremiumTag /> : null}
        </View>
        <View className="px-3 pt-3 pb-4 gap-2">
          <View className="gap-0.5">
            <View className="flex-row">
              {sortedCategories.map((category, idx) => (
                <View key={category.id} className="flex-row gap-1">
                  <Text className="text-slate-400 font-medium text-sm">{`${category.name}`}</Text>
                  {idx !== sortedCategories.length - 1 ? (
                    <Text className="text-slate-400 font-medium text-sm">
                      {" / "}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
            <Text className="text-xl font-bold text-primary">
              {formatPrice({ amount: price, currency_code: "aed" })}
            </Text>
          </View>
          <View
            className="flex flex-row gap-1 mt-0.5"
            style={{ marginLeft: -2.5 }}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={Theme.muted.foreground}
            />
            {addressStatus === "loading" ? (
              <Skeleton className="w-24 h-4" style={{ marginTop: 2 }} />
            ) : (
              <Text
                className="text-muted-foreground font-medium w-[80%]"
                numberOfLines={1}
              >
                {address}
              </Text>
            )}
          </View>
        </View>
      </RectButton>
    </Link>
  );
};

export const MotorCardSkeleton = () => {
  return (
    <View
      className="rounded-lg bg-card overflow-hidden"
      style={[{ width: 180, height: 256 }]}
    >
      <View className="relative">
        <Skeleton style={{ height: 150, width: "100%" }} />
      </View>
      <View className="px-3 py-3 justify-between flex-col flex-1">
        <View className="gap-2">
          <Skeleton style={{ height: 16, width: "100%" }} />
          <View className="flex-row justify-between flex-wrap">
            <View className="flex-row items-center gap-1">
              <Skeleton style={{ height: 14, width: 14 }} />
              <Skeleton style={{ height: 14, width: 40 }} />
            </View>
            <View className="flex-row items-center gap-1">
              <Skeleton style={{ height: 14, width: 14 }} />
              <Skeleton style={{ height: 14, width: 40 }} />
            </View>
          </View>
        </View>
        <View className="flex flex-row gap-1">
          <View className="flex-row items-center gap-1">
            <Skeleton style={{ height: 14, width: 20 }} />
            <Skeleton style={{ height: 14, width: 80 }} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MotorCard;
