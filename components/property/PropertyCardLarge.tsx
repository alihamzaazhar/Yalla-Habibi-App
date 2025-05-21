import { globalStyles, Theme } from "@/constants";
import { differenceInTime } from "@/lib/common/date-functions";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import React, { lazy, Suspense } from "react";
import { View, Text, Image, Linking } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useReverseGeocoding from "@/api/hooks/address/queries";
import { FavouriteButtonSmall } from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";
import { formatPrice } from "@/lib/common/prices";
import { PROPERTY_SALE_TYPE_ENUM } from "@/lib/property-ad/schemas";
import PremiumTag from "../shared/atoms/PremiumTag";
const ImagesCarousel = lazy(() => import("@/ui/ImagesCarousel"));
interface Props {
  className?: string;
  saleType: (typeof PROPERTY_SALE_TYPE_ENUM)[number];
  id: string;
  title: string;
  price: number;
  beds: number;
  baths: number;
  area: number;
  phoneNumber: string;
  isPremium?: boolean;
  location: {
    lat: number;
    lng: number;
  };
  created_at: Date;
  isFavourite?: boolean;
  owner: { firstName: string; lastName?: string };
  thumbnail: string;
  images?: Array<string>;
}

const PropertyCardLarge = ({
  id,
  area,
  baths,
  beds,
  thumbnail,
  location,
  phoneNumber,
  saleType,
  created_at,
  price,
  owner,
  images,
  title,
  isFavourite = false,
  isPremium = false,
}: Props) => {
  const { data: address, status: addressStatus } = useReverseGeocoding({
    coordinates: {
      latitude: location.lat,
      longitude: location.lng,
    },
  });
  const sortedHeaderImages = images?.sort((a, b) =>
    a === thumbnail ? -1 : b === thumbnail ? 1 : 0
  );
  return (
    <Link href={`/property/${id}`} asChild>
      <RectButton
        ButtonProps={{
          style: [
            {
              backgroundColor: Theme.white,
              overflow: "hidden",
              borderRadius: 8,
            },
            globalStyles.shadowMd,
          ],
        }}
        className="overflow-hidden rounded-lg"
      >
        <View className="relative" style={{ height: 240 }}>
          {sortedHeaderImages ? (
            <Suspense fallback={null}>
              <ImagesCarousel images={sortedHeaderImages} height={240} />
            </Suspense>
          ) : (
            <Image
              source={
                thumbnail
                  ? { uri: thumbnail }
                  : require("@/assets/images/sample-image.png")
              }
              style={{ height: 240, width: "100%" }}
              resizeMode="cover"
            />
          )}
          <FavouriteButtonSmall
            id={id}
            type="property_ad"
            isFavourite={isFavourite}
          />
          {isPremium ? <PremiumTag style={{ bottom: 18, right: 16 }} /> : null}
        </View>
        <View className="px-4 pt-4 pb-5 gap-1">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-400 capitalize">{`For ${saleType}`}</Text>
            <Text className="text-sm text-gray-400">
              {differenceInTime(new Date(), created_at)}
            </Text>
          </View>
          <Text className="text-2xl text-primary font-bold">{`${formatPrice({
            amount: price,
            currency_code: "aed",
          })}`}</Text>
          <View></View>
          <Text
            className="text-gray-500"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View className="gap-2 mt-2">
            <View className="flex flex-row gap-1">
              <Ionicons
                name="location-outline"
                size={20}
                color={Theme.gray[500]}
              />
              {addressStatus === "loading" ? (
                <Skeleton className="w-24 h-4" style={{ marginTop: 2 }} />
              ) : (
                <Text
                  className="text-gray-500 font-medium w-[80%]"
                  numberOfLines={1}
                >
                  {address}
                </Text>
              )}
            </View>
            <View className="flex-row gap-6 flex-wrap">
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="bed-outline"
                  size={20}
                  color={Theme.gray[500]}
                />
                <Text className="text-gray-500 font-medium">{`${beds} Beds`}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="bathtub-outline"
                  size={20}
                  color={Theme.gray[500]}
                />
                <Text className="text-gray-500 font-medium">{`${baths} Baths`}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="expand-outline"
                  size={20}
                  color={Theme.gray[500]}
                />
                <Text className="text-gray-500 font-medium">
                  {new Intl.NumberFormat().format(area) + " Sqft"}
                </Text>
              </View>
            </View>
          </View>
          <View className="flex flex-row items-center gap-4 justify-between mt-4">
            <View className="flex-row gap-2 items-center">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  source={require("@/assets/images/empty-avatar.png")}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {owner.firstName.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Text className="text-muted-foreground font-semibold capitalize">
                {owner.firstName}
              </Text>
            </View>
            <View className="flex-row gap-2 flex-1">
              <Button
                className={"gap-1 bg-red-100 border-[rgb(220,38,38)] flex-1"}
                rippleClassName="bg-red-200"
                variant={"outline"}
                onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
              >
                <Feather name="phone-call" size={16} color={`rgb(220 38 38)`} />
                <Text
                  style={{ color: "rgb(220 38 38)" }}
                  className="font-medium"
                >
                  {"Call"}
                </Text>
              </Button>
              <Button
                className={
                  "gap-1 self-start bg-[hsl(140,100%,32%)]/10 border-[hsl(140,100%,32%)] flex-1"
                }
                rippleClassName="bg-[hsl(140,100%,32%)]/20"
                variant={"outline"}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                }}
                onPress={() => Linking.openURL(`https://wa.me/${phoneNumber}`)}
              >
                <Feather
                  name="phone-call"
                  size={16}
                  color={"hsl(140,100%,32%)"}
                />
                <Text
                  style={{ color: "hsl(140,100%,32%)" }}
                  className="font-medium"
                >
                  {"Whatsapp"}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </RectButton>
    </Link>
  );
};
export const PropertyCardLargeSkeleton = () => {
  return (
    <View
      className="rounded-lg overflow-hidden bg-card flex-1"
      style={{ height: 413, width: "100%" }}
    >
      <View className="relative">
        <Skeleton style={{ height: 250, width: "100%" }} />
      </View>
      <View className="flex flex-col gap-4 py-4 justify-between px-4 flex-1">
        <View className="gap-4">
          <Skeleton style={{ height: 20, width: "100%" }} />
          <View className="flex-row justify-between flex-wrap">
            <View className="flex-row items-center gap-1">
              <Skeleton style={{ height: 20, width: 20 }} />
              <Skeleton style={{ height: 20, width: 40 }} />
            </View>
            <View className="flex-row items-center gap-1">
              <Skeleton style={{ height: 20, width: 20 }} />
              <Skeleton style={{ height: 20, width: 40 }} />
            </View>
            <View className="flex-row items-center gap-1">
              <Skeleton style={{ height: 20, width: 20 }} />
              <Skeleton style={{ height: 20, width: 40 }} />
            </View>
          </View>
        </View>
        <View className="flex flex-row gap-1 mt-0.5">
          <View className="flex-row items-center gap-1">
            <Skeleton style={{ height: 40, width: 40, borderRadius: 20 }} />
            <View className="gap-2">
              <Skeleton style={{ height: 16, width: 80 }} />
              <Skeleton style={{ height: 10, width: 50 }} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PropertyCardLarge;
