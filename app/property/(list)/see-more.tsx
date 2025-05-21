import { useProperties } from "@/api/hooks/marketplace/services/properties/queries";
import ParallaxHeaderLayout from "@/components/layouts/ParallaxHeaderLayout";
import { PropertyCardLargeSkeleton } from "@/components/property/PropertyCardLarge";
import { Theme } from "@/constants";
import { AnimatedScrollViewProvider } from "@/contexts/AnimatedScrollViewProvider";
import { Link, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Suspense, lazy, memo } from "react";
import { View } from "react-native";
import useAdminAds, { ADS_MODULES } from "@/api/hooks/admin-ads/queries";
import AdCardLarge from "@/components/property/AdCardLarge";
import useContentWithCardAds from "@/lib/hooks/admin-ads/useContentWithCardAds";
import ContentWithFullScreenAds from "@/components/shared/ContentWithFullScreenAds";
import BorderlessButton from "@/ui/BorderlessButton";
import { usePropertiesFilter } from "@/lib/property-ad/context/properties-filter";
import Error from "@/components/shared/templates/Error";
import SearchingInput from "@/components/shared/SearchingInput";
import { Image } from "expo-image";
const PropertyCardLarge_ = lazy(
  () => import("@/components/property/PropertyCardLarge")
);
const PropertyCardLarge = memo(PropertyCardLarge_);
function SeeMoreScreen_() {
  const filters = usePropertiesFilter((store) => store.filters);
  const { data: content, status: propertiesStatus } = useProperties(filters);

  const { data: allAds, status: allAdsStatus } = useAdminAds({
    module: ADS_MODULES.PROPERTY_ADS,
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
    content?.properties.map((property, idx) => {
      return (
        <Suspense fallback={<PropertyCardLargeSkeleton key={idx} />} key={idx}>
          <PropertyCardLarge
            key={idx}
            title={property.title}
            phoneNumber={property.phone_number}
            saleType={property.selling_mode}
            id={property.id}
            isFavourite={property.is_favourite}
            area={property.area ?? 0}
            isPremium={property.is_premium}
            location={
              property.location
                ? {
                    lng: property.location.coordinates[0],
                    lat: property.location.coordinates[1],
                  }
                : {
                    lat: 0,
                    lng: 0,
                  }
            }
            price={property.price}
            beds={property.bedroom_count}
            baths={property.bathroom_count}
            created_at={new Date(property.created_at)}
            owner={{
              firstName: property.requested_by.first_name,
              lastName: property.requested_by.last_name,
            }}
            thumbnail={property.thumbnail?.url ?? property.images[0].url}
            //[Todo]: Fix this performance issue
            images={property.images.map((i) => i.url) as Array<string>}
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
  if (allAdsStatus === "error" || propertiesStatus === "error") {
    return <Error />;
  }

  if (allAdsStatus === "loading" || propertiesStatus === "loading") {
    return (
      <View className="bg-background p-4 gap-4">
        <PropertyCardLargeSkeleton />
        <PropertyCardLargeSkeleton />
        <PropertyCardLargeSkeleton />
        <PropertyCardLargeSkeleton />
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
  const searchParams = useLocalSearchParams();
  const title = (searchParams.title ?? "Nearby Properties") as string;
  const setFilters = usePropertiesFilter((store) => store.setFilters);
  const FilterButton = (
    <Link asChild href="/property/(list)/filters">
      <BorderlessButton>
        <AntDesign
          name="filter"
          size={20}
          color={`hsl(${Theme.colors.foreground})`}
        />
      </BorderlessButton>
    </Link>
  );

  return (
    <AnimatedScrollViewProvider>
      <ParallaxHeaderLayout title={title} rightIcon={FilterButton}>
        <View className="bg-background overflow-hidden">
          <View style={{ paddingBottom: 10, paddingTop: 20 }}>
            <SearchingInput
              afterDebounce={(value) =>
                setFilters({ q: value.length > 1 ? value : undefined })
              }
              placeholder="Search properties"
            />
          </View>
        </View>
        <SeeMoreScreen_ />
      </ParallaxHeaderLayout>
    </AnimatedScrollViewProvider>
  );
}
