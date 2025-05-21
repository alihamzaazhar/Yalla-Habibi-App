import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CouponCard, { CouponCardSkeleton } from "./CouponCard";
import {
  MarketplaceCouponsListParams,
  useMarketplaceCoupons,
} from "@/api/hooks/marketplace/services/coupons/queries";
import { cn, humanizeString } from "@/lib/common/utils";

interface Props extends MarketplaceCouponsListParams {
  containerClassName?: string;
  exceptIds?: Array<string>;
}
const CouponsList = ({ exceptIds, containerClassName, ...props }: Props) => {
  const { data, status } = useMarketplaceCoupons({
    limit: 8,
    ...props,
  });

  if (status === "loading") {
    return (
      <ScrollView
        horizontal
        contentContainerClassName="gap-4 px-4 pt-2 pb-4 flex-row"
      >
        <CouponCardSkeleton />
        <CouponCardSkeleton />
        <CouponCardSkeleton />
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
  const data_ = data.couponAds.filter((d) => !exceptIds?.includes(d.id));
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName={cn("gap-4 px-4 pt-2 pb-4", containerClassName)}
    >
      {data_.map((coupon) => (
        <CouponCard
          key={coupon.id}
          id={coupon.id}
          collection={humanizeString(coupon.collection.title)}
          title={coupon.title}
          is_favourite={coupon.is_favourite}
          thumbnail={coupon.thumbnail}
          price={coupon.variants[0].prices[0].amount}
          discount_price={coupon.variants[0].prices[0].discount.value}
          created_at={coupon.created_at}
          owner={coupon.owner}
        />
      ))}
    </ScrollView>
  );
};

export default CouponsList;
