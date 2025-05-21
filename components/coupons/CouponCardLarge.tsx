import { globalStyles, Theme } from "@/constants";
import { differenceInTime } from "@/lib/common/date-functions";
import { cn, humanizeString } from "@/lib/common/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/Avatar";
import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import React, { lazy, Suspense } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { formatPrice } from "@/lib/common/prices";
import CouponSoldTag from "./CouponSoldTag";
import {
  FavouriteButtonLarge,
  FavouriteButtonSmall,
} from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";
const ImagesCarousel = lazy(() => import("@/ui/ImagesCarousel"));
interface Props {
  className?: string;
  id: string;
  showOrders?: boolean;
  price: number;
  collection: string;
  title: string;
  description: string;
  discountPrice: number;
  createdAt: Date;
  isFavourite?: boolean;
  owner: { id: string; createdAt: string; firstName: string; lastName: string };
  images?: Array<string>;
  thumbnail?: string;
}

const CouponCardLarge = ({
  id,
  images,
  description,
  createdAt,
  price,
  discountPrice,
  collection,
  title,
  owner,
  isFavourite = false,
  thumbnail,
  showOrders = false,
}: Props) => {
  const sortedHeaderImages = images?.sort((a, b) =>
    a === thumbnail ? -1 : b === thumbnail ? 1 : 0
  );
  return (
    <Link href={`/coupon-ad/${id}`} asChild>
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
            type="coupon_ad"
            isFavourite={isFavourite}
          />
        </View>
        <View className="px-3 pt-3 pb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-muted-foreground">
              {humanizeString(collection)}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {differenceInTime(new Date(), createdAt)}
            </Text>
          </View>
          <View className="flex-col items-start justify-between mt-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl text-primary font-bold">{`${formatPrice(
                {
                  amount: price,
                  currency_code: "aed",
                }
              )}`}</Text>
              <Text className="text-sm text-muted-foreground line-through">
                {formatPrice({
                  amount: discountPrice,
                  currency_code: "aed",
                })}
              </Text>
            </View>
          </View>
          <View className="gap-1">
            <Text
              className="text-xl font-semibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              className="text-gray-500"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {description}
            </Text>
          </View>
          <View className="flex mt-4 flex-row gap-4 justify-between">
            <View className="flex-row gap-2 items-center flex-1">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {owner.firstName.charAt(0).toLocaleUpperCase() +
                    owner.lastName?.charAt(0).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Text className="text-muted-foreground font-semibold">
                {owner.firstName + " " + owner.lastName}
              </Text>
            </View>
            <CouponSoldTag id={id} owner_id={owner.id} />
          </View>
        </View>
      </RectButton>
    </Link>
  );
};
export const CouponCardLargeSkeleton = () => {
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

export default CouponCardLarge;
