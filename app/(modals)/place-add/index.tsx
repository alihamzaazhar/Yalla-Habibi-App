import useServices from "@/api/hooks/marketplace/services/queries";
import { Theme } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text } from "react-native";
import { View } from "react-native";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import RectButton from "@/ui/RectButton";

const Index = () => {
  const { status, data } = useServices();
  const router = useRouter();

  if (status === "loading") {
    return (
      <PlaceAdLayout title="Select an ad">
        <View className="flex-row flex-wrap p-8 gap-4 flex-1">
          <Skeleton
            className="rounded-md"
            style={{ height: 140, width: "47%" }}
          />
          <Skeleton
            className="rounded-md"
            style={{ height: 140, width: "47%" }}
          />
          <Skeleton
            className="rounded-md"
            style={{ height: 140, width: "47%" }}
          />
          <Skeleton
            className="rounded-md"
            style={{ height: 140, width: "47%" }}
          />
        </View>
      </PlaceAdLayout>
    );
  }

  if (status === "error") {
    return (
      <PlaceAdLayout title="Select an ad">
        <View className="flex-row gap-6 flex-wrap mt-24 p-8">
          <Text>{`Something went wrong`}</Text>
        </View>
      </PlaceAdLayout>
    );
  }
  if (!data) {
    // Thers is no service available
    return (
      <PlaceAdLayout title="Select an ad">
        <View className="flex-row gap-6 flex-wrap mt-24 p-8">
          <Text>{`No services are available`}</Text>
        </View>
      </PlaceAdLayout>
    );
  }

  const propertyAds = data?.get("property_ads");
  const motor_ads = data?.get("motor_ads");
  const couponAds = data?.get("coupon_ads");

  return (
    <PlaceAdLayout title="Select an ad">
      <View className="flex-row flex-wrap p-8 gap-4 flex-1">
        {couponAds ? (
          <PlacingAdServiceLink
            title={"Coupons"}
            icon={
              <Image
                source={require("@/assets/images/coupons-service.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            }
            onPress={() =>
              router.navigate({
                pathname: "/(modals)/place-add/coupon",
                params: {},
              })
            }
          />
        ) : null}
        {propertyAds ? <PropertyAdsLinks /> : null}
        {motor_ads ? (
          <PlacingAdServiceLink
            title={"Motors"}
            icon={
              <Image
                source={require("@/assets/images/motor-service.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            }
            onPress={() =>
              router.navigate({
                pathname: "/(modals)/place-add/motors",
                params: {},
              })
            }
          />
        ) : null}
      </View>
    </PlaceAdLayout>
  );
};

const PlacingAdServiceLink = (props: {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  return (
    <RectButton
      ButtonProps={{
        style: {
          paddingVertical: 24,
          paddingHorizontal: 16,
          borderRadius: 24,
          width: "47%",
          backgroundColor: Theme.card.DEFAULT,
        },
        rippleColor: Theme.slate[200],
      }}
      style={{ alignItems: "center", gap: 12 }}
      onPress={props.onPress}
    >
      {props.icon}
      <Text className="text-center text-slate-500 font-medium break-words">
        {props.title}
      </Text>
    </RectButton>
  );
};

const PropertyAdsLinks = () => {
  const router = useRouter();

  return (
    <>
      <PlacingAdServiceLink
        title={"Property For Rent"}
        icon={
          <Image
            source={require("@/assets/images/p-rent.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
        }
        onPress={() => {
          router.navigate({
            pathname: "/(modals)/place-add/property/select-primary-category",
            params: {
              selling_mode: "rent",
            },
          });
        }}
      />
      <PlacingAdServiceLink
        title={"Property For Sale"}
        icon={
          <Image
            source={require("@/assets/images/p-sale.png")}
            style={{
              width: 60,
              height: 60,
            }}
          />
        }
        onPress={() => {
          router.navigate({
            pathname: "/(modals)/place-add/property/select-primary-category",
            params: {
              selling_mode: "sale",
            },
          });
        }}
      />
    </>
  );
};

export default Index;
