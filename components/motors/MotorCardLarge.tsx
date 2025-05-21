import { globalStyles, Theme } from "@/constants";
import { differenceInTime } from "@/lib/common/date-functions";
import { sortCategoriesByParent } from "@/lib/common/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import React, { lazy, Suspense } from "react";
import { View, Text, Image, Linking } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import useReverseGeocoding from "@/api/hooks/address/queries";
import { formatPrice } from "@/lib/common/prices";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FavouriteButtonSmall } from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";
import { Category } from "@/api/types";
import PremiumTag from "../shared/atoms/PremiumTag";
import _ from "lodash";

const ImagesCarousel = lazy(() => import("@/ui/ImagesCarousel"));
interface Props {
  className?: string;
  id: string;
  price: number;
  isPremium?: boolean;
  trim?: string;
  title: string;
  regionalSpec?: string;
  year?: number;
  kilometer?: number;
  phoneNumber?: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  age?: string;
  length?: string;
  owner: { created_at: string; firstName: string; lastName: string };
  images?: Array<string>;
  thumbnail?: string;
  categories: Array<Category>;
  isFavourite?: boolean;
}

const MotorCardLarge = ({
  id,
  title,
  images,
  location,
  createdAt,
  phoneNumber,
  regionalSpec,
  year,
  kilometer,
  price,
  owner,
  categories,
  isPremium = false,
  isFavourite = false,
  age,
  length,
  className,
  thumbnail,
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
  const sortedCategories = sortCategoriesByParent(categories).splice(1);

  const OverviewDetails = _.omitBy(
    _.omitBy(
      {
        Age: age,
        Length: length,
        Year: year,
        Mileage: kilometer,
      },
      _.isUndefined
    ),
    _.isNull
  );

  return (
    <Link href={`/motor-ad/${id}`} asChild>
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
            type="motor_ad"
            isFavourite={isFavourite}
          />
          {isPremium ? <PremiumTag style={{ bottom: 18, right: 16 }} /> : null}
        </View>
        <View className="px-3 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              {sortedCategories.map((category, idx) => (
                <View key={category.id} className="flex-row gap-1">
                  <Text className="text-gray-500 text-sm font-semibold">{`${category.name}`}</Text>
                  {idx !== sortedCategories.length - 1 ? (
                    <Text className="text-gray-500 text-sm font-semibold">
                      {" / "}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
            <Text className="text-sm text-slate-400">
              {differenceInTime(new Date(), createdAt)}
            </Text>
          </View>
          <Text
            className="text-2xl text-primary font-bold mt-1"
            style={{ marginLeft: -1 }}
          >{`${formatPrice({
            amount: price,
            currency_code: "aed",
          })}`}</Text>

          <View className="gap-2 mt-3">
            <Text
              className="text-gray-500 text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            <View className="flex-row flex-wrap justify-start gap-4">
              {Object.entries(OverviewDetails).map(([key, value]) => (
                <View className="flex-wrap flex flex-row" key={key}>
                  <Text className="text-gray-500 font-semibold text-sm">
                    {key}:{" "}
                  </Text>
                  <Text className="text-gray-600 text-sm">{value}</Text>
                </View>
              ))}
            </View>
            <View
              className="flex flex-row gap-1"
              style={{ marginLeft: -2, marginTop: 4 }}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={Theme.gray[400]}
              />
              {addressStatus === "loading" ? (
                <Skeleton className="w-24 h-4" style={{ marginTop: 2 }} />
              ) : (
                <Text
                  className="text-gray-500 w-[80%] text-sm"
                  numberOfLines={1}
                >
                  {address}
                </Text>
              )}
            </View>
          </View>
          <View className="flex mt-4 flex-row items-center gap-4 justify-between">
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
export const MotorCardLargeSkeleton = () => {
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

export default MotorCardLarge;
