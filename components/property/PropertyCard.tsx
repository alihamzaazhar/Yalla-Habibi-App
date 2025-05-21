import { Theme, globalStyles } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useReverseGeocoding from "@/api/hooks/address/queries";
import { formatPrice } from "@/lib/common/prices";
import { FavouriteButtonSmall } from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";
import PremiumTag from "../shared/atoms/PremiumTag";

interface Props {
  id: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  location: {
    lat: number;
    lng: number;
  };
  thumbnail?: { url: string };
  is_favourite: boolean;
  is_premium?: boolean;
}

const PropertyCard = ({
  id,
  area,
  baths,
  beds,
  thumbnail,
  location,
  price,
  is_favourite,
  is_premium = false,
}: Props) => {
  const { data: address, status: addressStatus } = useReverseGeocoding({
    coordinates: {
      latitude: location.lat,
      longitude: location.lng,
    },
  });
  return (
    <Link href={`/property/${id}`}>
      <RectButton
        className="rounded-lg overflow-hidden"
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
            style={{ height: 150, width: "100%", objectFit: "cover" }}
          />
          <FavouriteButtonSmall
            id={id}
            type="property_ad"
            isFavourite={is_favourite}
          />
          {is_premium ? (
            <PremiumTag style={{position:"absolute", bottom:8, right:8}} />
          ) : null}
        </View>
        <View className="px-3 pt-3 pb-4 gap-2">
          <Text
            className="text-xl font-bold text-primary"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {formatPrice({ amount: price, currency_code: "aed" })}
          </Text>
          <View className="flex-row gap-2 items-start">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={20} color={Theme.slate[500]} />
              <Text
                className={`text-slate-500 font-medium`}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {beds}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="bathtub-outline"
                size={20}
                color={Theme.slate[500]}
              />
              <Text
                className={`text-slate-500 font-medium`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {baths}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 flex-1">
              <Ionicons
                name="expand-outline"
                size={20}
                color={Theme.slate[500]}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={`text-slate-500 font-medium`}
                style={{ flex: 1 }}
              >{`${new Intl.NumberFormat().format(area) + " Ft"}`}</Text>
            </View>
          </View>
          <View
            className="flex flex-row gap-1 mt-0.5"
            style={{ marginLeft: -2.5 }}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color={Theme.slate[500]}
            />
            {addressStatus === "loading" ? (
              <Skeleton className="w-24 h-4" style={{ marginTop: 2 }} />
            ) : (
              <Text
                className="text-slate-500 font-medium w-[80%]"
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

export const PropertyCardSkeleton = () => {
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

export default PropertyCard;
