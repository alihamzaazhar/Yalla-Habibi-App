import { Theme } from "@/constants";
import { Skeleton } from "@/ui/Skeleton";
import React from "react";
import { Text } from "react-native";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import RectButton from "@/ui/RectButton";
import { useMotorsCategories } from "@/api/hooks/marketplace/services/motors/queries";
import { useRouter } from "expo-router";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
import { Image } from "expo-image";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";

const ImageMappings = {
  [MOTOR_CATEGORIES_HANDLES[
    "cars-motor-ad-categories"
  ]]: require("@/assets/images/motor-car.png"),
  [MOTOR_CATEGORIES_HANDLES[
    "motorcycles-motor-ad-categories"
  ]]: require("@/assets/images/motor-motorcycle.png"),
  [MOTOR_CATEGORIES_HANDLES[
    "auto-accessories-parts-motor-ad-categories"
  ]]: require("@/assets/images/motor-accessories.png"),
  [MOTOR_CATEGORIES_HANDLES[
    "boats-motor-ad-categories"
  ]]: require("@/assets/images/motor-boats.png"),
  [MOTOR_CATEGORIES_HANDLES[
    "heavy-vehicles-motor-ad-categories"
  ]]: require("@/assets/images/heavy-vehicles.png"),
  [MOTOR_CATEGORIES_HANDLES[
    "number-plates-motor-ad-categories"
  ]]: require("@/assets/images/number-plate.png"),
} as Record<string, string>;
const SelectRootCategory = () => {
  const { updateMetadata } = useGlobalMetaData();
  const setFilters = useMotorAdsFilter((store) => store.setFilters);
  const { status, data } = useMotorsCategories({ root_only: true });
  const router = useRouter();
  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  if (!data) return <NoDataFound />;

  return (
    <PlaceAdLayout
      title="Select Type"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/(tabs)`,
        });
      }}
    >
      <View className="flex-row flex-wrap p-8 gap-4 flex-1">
        {data.motorAdsCategories
          .map((o) => o.category_children)
          .flat()
          .map((o) => (
            <ServiceLink
              title={o.name}
              key={o.id}
              imageHref={
                Object.entries(ImageMappings).find(([key, value]) =>
                  o.handle.includes(key)
                )?.[1] ?? undefined
              }
              onPress={() => {
                setFilters({
                  categories: [o.id],
                });
                updateMetadata({
                  [o.id]: {
                    id: o.id,
                    name: o.name,
                    handle: o.handle,
                    parent_category_id: o.parent_category_id,
                  },
                });
                if (o.category_children?.length) {
                  router.navigate({
                    pathname: "/motor-ad/(list)/filters/filter-vehicle-make",
                    params: {
                      rootCategoryId: o.id,
                    },
                  });
                } else {
                  router.navigate({
                    pathname: "/motor-ad/(list)/see-more",
                    params: {
                      rootCategoryId: o.id,
                    },
                  });
                }
                
              }}
            />
          ))}
      </View>
    </PlaceAdLayout>
  );
};

const ServiceLink = (props: {
  title: string;
  imageHref?: string;
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
      {props.imageHref ? (
        <Image source={props.imageHref} style={{ width: 60, height: 60 }} />
      ) : (
        <Ionicons
          name="car"
          color={`hsl(${Theme.colors.primary.DEFAULT})`}
          size={60}
        />
      )}
      <Text className="text-center text-slate-500 font-medium break-words">
        {props.title}
      </Text>
    </RectButton>
  );
};

const Loading = () => {
  const router = useRouter();
  return (
    <PlaceAdLayout
      title="Select Type"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/(tabs)`,
        });
      }}
    >
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
};

const Error = () => {
  const router = useRouter();
  return (
    <PlaceAdLayout
      title="Select Type"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/(tabs)`,
        });
      }}
    >
      <Text>Error</Text>
    </PlaceAdLayout>
  );
};

const NoDataFound = () => {
  const router = useRouter();
  return (
    <PlaceAdLayout
      title="Select Type"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/(tabs)`,
        });
      }}
    >
      <Text>No data...</Text>
    </PlaceAdLayout>
  );
};

export default SelectRootCategory;
