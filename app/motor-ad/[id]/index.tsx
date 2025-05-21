import TruncatedText from "@/components/shared/TruncatedText";
import { Button } from "@/ui/Button";
import Card from "@/ui/Card";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Linking, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { useMotorAd } from "@/api/hooks/marketplace/services/motors/queries";
import {
  BIKE_ENGINE_SIZES_MAP,
  CAR_ENGINE_SIZES_MAP,
  CAR_HORSEPOWER_MAP,
  EXTRA_FEATURES_ENUM,
  MOTOR_CATEGORIES_HANDLES,
} from "@/lib/motors-ad/constants";
import {
  camelCaseToHumanReadable,
  humanizeString,
  sortCategoriesByParent,
} from "@/lib/common/utils";
import { differenceInTime } from "@/lib/common/date-functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar";
import { formatDate } from "date-fns";
import { formatPrice } from "@/lib/common/prices";
import DisplayLocationCard from "@/components/shared/DisplayLocationCard";
import AdParallexScrollLayout from "@/components/shared/AdParallexScrollLayout";

import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "@/constants";
import RectButton from "@/ui/RectButton";
import TruncatedFlatList from "@/components/shared/TruncatedFlatList";
import DetailScreenSkeleton from "@/components/shared/skeletons/DetailScreenSkeleton";
import { Suspense, lazy } from "react";
import _ from "lodash";
import Ionicons from "@expo/vector-icons/Ionicons";

const MotorsList = lazy(() => import("@/components/motors/MotorsList"));

export default function MotorAdDetailScreen() {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  const { data: data_, status } = useMotorAd({ id: id as string });
  if (status === "loading") {
    return <DetailScreenSkeleton />;
  }
  if (status === "error") {
    return <Text>Something went wrong</Text>;
  }
  const data = data_.motorAd;
  const isBike = data_.motorAd.categories[0].handle.includes(
    MOTOR_CATEGORIES_HANDLES["motorcycles-motor-ad-categories"]
  );
  console.log(data.has_insurance, "Data");
  const FeaturesList = Object.values(EXTRA_FEATURES_ENUM).filter(
    //@ts-ignore
    (v) => Boolean(data.extra_features?.[v])
  );

  const OverviewDetails = _.omitBy(
    _.omitBy(
      {
        Usage: data.usage,
        ["Wheels"]: data.wheels,
        ["Condition"]: data.condition,
        ["Body Condition"]: data.body_condition,
        ["Mechanical Condition"]: data.mechanical_condition,
        ["Weight"]: data.weight,
        ["Age"]: data.age,
        ["Plate Number"]: data.plate_number,
        ["Length"]: data.length,
        Year: data.year,
        Kilometer: data.kilometer,
        ["Has Insurance"]: data.has_insurance ? "Yes" : "No",
        ["Has Warranty"]: data.has_warranty ? "Yes" : "No",
        Trim: data.trim,
        ["Final Drive System"]: data.final_drive_system,
        Doors: data.doors_count,
        Cylinders: data.cylinder_count,
        Seats: data.seats_count,
        ["Regional Spec"]: data.regional_spec,
        ["Exterior Color"]: data.exterior_color,
        ["Interior Color"]: data.interior_color,
        ["Fuel Type"]: data.fuel_type,
        ["Body Type"]: data.body_type,
        ["Transmission Type"]: data.transmission_type,
        ["Steering Side"]: data.steering_side,
        ["Horsepower"]: Object.entries(CAR_HORSEPOWER_MAP).find(
          ([key, value]) => value === data.horsepower
        )?.[0],
        ["Engine Size"]: Object.entries(
          isBike ? BIKE_ENGINE_SIZES_MAP : CAR_ENGINE_SIZES_MAP
        ).find(([key, value]) => value === data.engine_size)?.[0],
      },
      _.isNull
    ),
    _.isUndefined
  ) as Record<string, string | undefined>;

  const sortedCategories = sortCategoriesByParent(data.categories).splice(1);

  return (
    <View className="flex-1">
      <AdParallexScrollLayout
        id={data.id}
        adOwnerId={data.requested_by.id}
        isPremium={data.is_premium}
        thumbnail={data.thumbnail}
        headerImages={data.images.map((i) => i.url)}
        className="pb-24 relative"
        favouriteButton={{
          id: data.id,
          type: "motor_ad",
          isFavourite: data.is_favourite,
        }}
        onImageTapped={(index) => {
          router.navigate({
            pathname: "/motor-ad/[id]/gallery",
            params: {
              id: data.id,
            },
          });
        }}
        onEdit={() => {
          router.navigate({
            pathname: "/motor-ad/[id]/edit/edit-details",
            params: {
              id: data.id,
            },
          });
        }}
      >
        <View className="py-2 gap-4 bg-background flex-1">
          <View className="gap-y-3">
            {data.badges ? (
              <ScrollView
                horizontal
                contentContainerClassName="flex flex-row items-center pl-2 gap-2 pt-1"
                showsHorizontalScrollIndicator={false}
              >
                {data.badges.map((v) => (
                  <Text
                    key={v}
                    className="bg-slate-600 px-2 py-1 font-medium text-sm text-white rounded-md"
                  >
                    {camelCaseToHumanReadable(v)}
                  </Text>
                ))}
              </ScrollView>
            ) : null}
            <View className="gap-y-1 pt-2 px-4">
              <View className="flex-row">
                {sortedCategories.map((category, idx) => (
                  <View key={category.id} className="flex-row gap-1">
                    <Text className="text-gray-600 font-medium text-md">{`${category.name}`}</Text>
                    {idx !== sortedCategories.length - 1 ? (
                      <Text className="text-gray-600 font-medium text-md">
                        {" / "}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
              <View>
                <Text className={`font-bold text-primary text-3xl`}>
                  {formatPrice({
                    amount: data.price,
                    currency_code: "aed",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-4 gap-4">
            <View className="border-t pt-6 pb-2 border-gray-200 gap-4">
              <Text className="text-2xl font-medium">{`${data.title}`}</Text>
              <View>
                <Text className="text-lg font-medium">Description</Text>
                <TruncatedText>{`${data.description}`}</TruncatedText>
              </View>
            </View>
            <Card className="gap-6 p-0 pt-4 px-5 rounded-xl">
              <Text className="text-xl font-medium text-slate-600">
                Overview
              </Text>
              <TruncatedFlatList
                data={Object.entries(OverviewDetails)}
                renderItem={({ item: [key, value], index }) => (
                  <View style={{ width: "50%" }} key={index}>
                    <Text className="text-gray-500 capitalize">{key}</Text>
                    <Text>{value}</Text>
                  </View>
                )}
              />
            </Card>
            {FeaturesList.length > 0 ? (
              <Card className="gap-6 p-0 pt-4 px-5 rounded-xl">
                <Text className="text-xl font-medium text-slate-600">
                  Features
                </Text>
                <TruncatedFlatList
                  data={FeaturesList}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: "50%",
                        marginBottom: 12,
                        gap: 4,
                        flexDirection: "row",
                      }}
                      key={index}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={Theme.primary.DEFAULT}
                      />
                      <Text className="text-gray-500 capitalize">{item}</Text>
                    </View>
                  )}
                />
              </Card>
            ) : null}
            <View className="flex-1">
              {data.location ? (
                <DisplayLocationCard
                  title={data.title}
                  address={data.address}
                  location={data.location}
                />
              ) : null}
            </View>
            <RectButton
              onPress={() => {
                router.navigate(`/profile-public/${data.requested_by.id}`);
              }}
              ButtonProps={{
                rippleColor: Theme.slate[100],
                style: {
                  backgroundColor: Theme.card.DEFAULT,
                },
              }}
              className="px-4 py-4 flex-row rounded-md border border-border gap-4 items-center"
            >
              <Avatar>
                <AvatarFallback>
                  {data.requested_by.first_name.charAt(0) +
                    data.requested_by.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <View>
                <Text className="font-medium text-lg capitalize">
                  {data.requested_by.first_name +
                    " " +
                    data.requested_by.last_name}
                </Text>
                <Text className="text-xs font-medium text-gray-400">
                  {`Member since ${formatDate(
                    data.requested_by.created_at,
                    "MMM yyyy"
                  )}`}
                </Text>
              </View>
            </RectButton>
          </View>
        </View>
        <Suspense fallback={null}>
          <View className="flex-1 bg-background py-8">
            <Text className="text-xl font-semibold pl-4 pb-2">
              {"Similar Ads"}
            </Text>
            <MotorsList
              vendor_id={data.requested_by.id}
              is_premium={data.is_premium}
              exceptIds={[data.id]}
            />
          </View>
        </Suspense>
      </AdParallexScrollLayout>
      <Animated.View
        className={
          "flex-row gap-6 absolute bottom-0 px-4 py-6 border-t border-border items-center justify-center bg-card"
        }
      >
        <Button
          className={"gap-3 bg-red-100 border-[rgb(220,38,38)] flex-1"}
          rippleClassName="bg-red-200"
          rippleBorderRadius={2}
          variant={"outline"}
          onPress={() => Linking.openURL(`tel:${data.phone_number}`)}
        >
          <Feather name="phone-call" size={20} color={`rgb(220 38 38)`} />
          <Text
            style={{ color: "rgb(220 38 38)" }}
            className="font-medium text-xl"
          >
            {"Call"}
          </Text>
        </Button>
        <Button
          className={
            "gap-3 bg-[hsl(140,100%,32%)]/10 border-[hsl(140,100%,32%)] flex-1"
          }
          rippleBorderRadius={2}
          rippleClassName="bg-[hsl(140,100%,32%)]/20"
          variant={"outline"}
        >
          <Feather name="phone-call" size={20} color={"hsl(140,100%,32%)"} />
          <Text
            style={{ color: "hsl(140,100%,32%)" }}
            className="font-medium text-xl"
          >
            {"Whatsapp"}
          </Text>
        </Button>
      </Animated.View>
    </View>
  );
}
