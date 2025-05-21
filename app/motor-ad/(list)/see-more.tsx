import ParallaxHeaderLayout from "@/components/layouts/ParallaxHeaderLayout";
import { Theme } from "@/constants";
import { AnimatedScrollViewProvider } from "@/contexts/AnimatedScrollViewProvider";
import { Button } from "@/ui/Button";
import { Link, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { View, Text } from "react-native";
import { useMotorAds } from "@/api/hooks/marketplace/services/motors/queries";
import { MotorCardLargeSkeleton } from "@/components/motors/MotorCardLarge";
import useAdminAds, { ADS_MODULES } from "@/api/hooks/admin-ads/queries";
import ContentWithFullScreenAds from "@/components/shared/ContentWithFullScreenAds";
import useContentWithCardAds from "@/lib/hooks/admin-ads/useContentWithCardAds";
import AdCardLarge from "@/components/property/AdCardLarge";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import SearchingInput from "@/components/shared/SearchingInput";
import { Suspense, lazy, memo } from "react";
import { Image } from "expo-image";

const MotorCardLarge_ = lazy(
  () => import("@/components/motors/MotorCardLarge")
);
const MotorCardLarge = memo(MotorCardLarge_);
function SeeMoreScreen_() {
  const filters = useMotorAdsFilter((state) => state.filters);
  const { data: content, status: motorAdsStatus } = useMotorAds(filters);
  const { data: allAds, status: allAdsStatus } = useAdminAds({
    module: ADS_MODULES.MOTOR_ADS,
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
    content?.motorAds.map((motor, idx) => {
      return (
        <Suspense fallback={<MotorCardLargeSkeleton key={idx} />} key={idx}>
          <MotorCardLarge
            key={idx}
            id={motor.id}
            age={motor.age}
            length={motor.length}
            isPremium={motor.is_premium}
            isFavourite={motor.is_favourite}
            price={motor.price}
            categories={motor.categories}
            createdAt={new Date(motor.created_at)}
            trim={motor.trim}
            regionalSpec={motor.regional_spec}
            year={motor.year}
            kilometer={motor.kilometer}
            phoneNumber={motor.phone_number}
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
            owner={{
              firstName: motor.requested_by.first_name,
              lastName: motor.requested_by.last_name,
              created_at: motor.requested_by.created_at,
            }}
            //[Todo]: Fix this performance issue
            images={motor.images.map((i) => i.url)}
            thumbnail={motor.thumbnail ?? motor.images[0].url}
            title={motor.title}
          />
        </Suspense>
      );
    }) ?? [];
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
            resizeMode={"cover"}
            style={{ width: "100%", flex: 1 }}
          />
        );
      }) ?? [];
  const contentElementWithCardAds = useContentWithCardAds({
    ads: cardAds ?? [],
    content: contentElements,
  });

  if (motorAdsStatus === "error" || allAdsStatus === "error") {
    return (
      <Text className="text-center text-red-500">{"An error occurred."}</Text>
    );
  }

  if (allAdsStatus === "loading" || motorAdsStatus === "loading") {
    return (
      <View className="bg-background p-4 gap-4">
        <MotorCardLargeSkeleton />
        <MotorCardLargeSkeleton />
        <MotorCardLargeSkeleton />
        <MotorCardLargeSkeleton />
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
  const title = (useLocalSearchParams().title ?? "Nearby Motors") as string;
  const setFilters = useMotorAdsFilter((state) => state.setFilters);

  const FilterButton = (
    <Link asChild href="/motor-ad/filters">
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
    <AnimatedScrollViewProvider>
      <ParallaxHeaderLayout title={title} rightIcon={FilterButton}>
        <View className=" bg-background overflow-hidden">
          <View style={{ paddingBottom: 10, paddingTop: 20 }}>
            <SearchingInput
              afterDebounce={(value) =>
                setFilters({ q: value.length > 1 ? value : undefined })
              }
              placeholder="Search Motors"
            />
          </View>
        </View>
        <SeeMoreScreen_ />
      </ParallaxHeaderLayout>
    </AnimatedScrollViewProvider>
  );
}
