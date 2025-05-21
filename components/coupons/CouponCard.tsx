import { Skeleton } from "@/ui/Skeleton";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { formatPrice } from "@/lib/common/prices";
import { Theme, globalStyles } from "@/constants";
import { FavouriteButtonSmall } from "../shared/FavouriteButton";
import RectButton from "@/ui/RectButton";

type Props = {
  id: string;
  price: number;
  discount_price: number;
  created_at: string;
  title: string;
  collection: string;
  is_favourite?: boolean;
  thumbnail?: string;
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
    email: string;
  };
};

const CouponCard = ({
  id,
  thumbnail,
  title,
  collection,
  created_at,
  owner,
  price,
  discount_price,
  is_favourite = false,
}: Props) => {
  return (
    <Link href={`/coupon-ad/${id}`}>
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
                ? { uri: thumbnail }
                : require("@/assets/images/sample-image.png")
            }
            style={{ height: 180, width: "100%", objectFit: "cover" }}
          />
          <FavouriteButtonSmall
            id={id}
            type="coupon_ad"
            isFavourite={is_favourite}
          />
        </View>
        <View className="px-3 pt-3 pb-4 gap-2">
          <View>
            <Text className="text-slate-400 font-medium text-sm">
              {collection}
            </Text>
            <Text
              className="text-xl font-bold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          <View className="flex-row items-start gap-2 relative overflow-hidden">
            <Text
              className="font-bold text-primary"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {formatPrice({ amount: price, currency_code: "aed" })}
            </Text>
            <Text
              className="text-sm text-muted-foreground line-through flex-1"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {formatPrice({ amount: discount_price, currency_code: "aed" })}
            </Text>
          </View>
        </View>
      </RectButton>
    </Link>
  );
};

export const CouponCardSkeleton = () => {
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

export default CouponCard;
