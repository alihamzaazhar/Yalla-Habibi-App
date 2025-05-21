import ParallaxHeaderLayout from "@/components/layouts/ParallaxHeaderLayout";
import { Theme } from "@/constants";
import { AnimatedScrollViewProvider } from "@/contexts/AnimatedScrollViewProvider";
import { Button } from "@/ui/Button";
import { Link, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Suspense, lazy, memo, useState } from "react";
import { View, Text } from "react-native";
import NoHeaderLayout from "@/components/layouts/NoHeaderLayout";
import useAdminAds, { ADS_MODULES } from "@/api/hooks/admin-ads/queries";
import ContentWithFullScreenAds from "@/components/shared/ContentWithFullScreenAds";
import useContentWithCardAds from "@/lib/hooks/admin-ads/useContentWithCardAds";
import AdCardLarge from "@/components/property/AdCardLarge";
import { useMarketplaceCoupons } from "@/api/hooks/marketplace/services/coupons/queries";
import { CouponCardLargeSkeleton } from "@/components/coupons/CouponCardLarge";
import { humanizeString } from "@/lib/common/utils";
import { useCouponAdsFilters } from "@/lib/coupons/hooks/useCouponFilters";
import SearchingInput from "@/components/shared/SearchingInput";
import { Image } from "expo-image";
const CouponCardLarge = lazy(
  () => import("@/components/coupons/CouponCardLarge")
);
const CouponCardLargeMemo = memo(CouponCardLarge);

function SeeMoreScreen_() {
  const filters = useCouponAdsFilters((state) => state.filters);
  const { data: content, status: couponAdsStatus } =
    useMarketplaceCoupons(filters);
  const { data: allAds, status: allAdsStatus } = useAdminAds({
    module: ADS_MODULES.COUPON_ADS,
  });

  const cardAds =
    allAds?.adminAds
      .filter((ad) => ad.metadata?.type === "card")
      .map((ad) => (
        <AdCardLarge
          key={ad.id}
          title={ad.title ?? ""}
          body={ad.title ?? ""}
          url={ad.url}
          imageUrl={ad.images?.[0].url}
        />
      )) ?? [];

  const contentElements =
    content?.couponAds.map((coupon, idx) => {
      return (
        <Suspense fallback={<CouponCardLargeSkeleton key={idx} />} key={idx}>
          <CouponCardLargeMemo
            key={idx}
            discountPrice={coupon.variants[0].prices[0].discount.value}
            id={coupon.id}
            collection={humanizeString(coupon.collection.title)}
            title={coupon.title}
            price={coupon.variants[0]?.prices[0]?.amount}
            createdAt={new Date(coupon.created_at)}
            isFavourite={coupon.is_favourite}
            owner={{
              firstName: coupon.owner.first_name,
              lastName: coupon.owner.last_name,
              createdAt: coupon.owner.created_at,
              id: coupon.owner.id,
            }}
            //[Todo]: Fix this performance issue
            images={coupon.images.map((i) => i.url) as Array<string>}
            description={coupon.description}
            thumbnail={coupon.thumbnail ?? coupon.images[0].url}
          />
        </Suspense>
      );
    }) ?? [];
  const contentElementWithCardAds = useContentWithCardAds({
    ads: cardAds,
    content: contentElements,
  });

  const fullScreenAds =
    allAds?.adminAds
      .filter((ad) => ad.metadata?.type === "fullscreen")
      .map((ad, idx) => {
        return (
          <Image
            key={idx}
            source={
              ad.images?.[0].url
                ? { uri: ad.images[0].url }
                : require("@/assets/images/sample-image.png")
            }
            contentFit={"cover"}
            style={{ width: "100%", flex: 1 }}
          />
        );
      }) ?? [];
  if (couponAdsStatus === "error" || allAdsStatus === "error") {
    return (
      <Text className="text-center text-red-500">{"An error occurred."}</Text>
    );
  }

  if (allAdsStatus === "loading" || couponAdsStatus === "loading") {
    return (
      <View className="bg-background p-4 gap-4">
        <CouponCardLargeSkeleton />
        <CouponCardLargeSkeleton />
        <CouponCardLargeSkeleton />
        <CouponCardLargeSkeleton />
      </View>
    );
  }

  return (
    <ContentWithFullScreenAds
      contentsContainerClassName="bg-background p-4"
      content={contentElementWithCardAds}
      adElements={fullScreenAds}
    />
  );
}

export default function SeeMoreScreen() {
  const title = (useLocalSearchParams().title ?? "Nearby Coupons") as string;
  const setFilters = useCouponAdsFilters((state) => state.setFilters);

  const FilterButton = (
    <Link asChild href="/coupon-ad/filters">
      <Button
        className="rounded-full"
        variant={"link"}
        rippleClassName="bg-gray-300/60"
      >
        <AntDesign
          name="filter"
          size={20}
          color={`hsl(${Theme.colors.foreground})`}
        />
      </Button>
    </Link>
  );

  return (
    <NoHeaderLayout>
      <AnimatedScrollViewProvider>
        <ParallaxHeaderLayout title={title} rightIcon={FilterButton}>
          <View className="bg-background overflow-hidden">
            <View style={{ paddingBottom: 10, paddingTop: 20 }}>
              <SearchingInput
                afterDebounce={(value) =>
                  setFilters({ q: value.length > 1 ? value : undefined })
                }
                placeholder="Search coupons"
              />
            </View>
          </View>
          <SeeMoreScreen_ />
        </ParallaxHeaderLayout>
      </AnimatedScrollViewProvider>
    </NoHeaderLayout>
  );
}
