import { useProperty } from "@/api/hooks/marketplace/services/properties/queries";
import TruncatedText from "@/components/shared/TruncatedText";
import { differenceInTime } from "@/lib/common/date-functions";
import { EXTRA_FEATURES_ENUM } from "@/lib/property-ad/schemas";
import { humanizeString } from "@/lib/common/utils";
import { Button } from "@/ui/Button";
import Card from "@/ui/Card";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import { formatDate } from "date-fns";
import DisplayLocationCard from "@/components/shared/DisplayLocationCard";
import { formatPrice } from "@/lib/common/prices";
import { Theme } from "@/constants";
import TruncatedFlatList from "@/components/shared/TruncatedFlatList";
import RectButton from "@/ui/RectButton";
import AdParallexScrollLayout from "@/components/shared/AdParallexScrollLayout";

import DetailScreenSkeleton from "@/components/shared/skeletons/DetailScreenSkeleton";
import { Suspense, lazy } from "react";
const PropertyList = lazy(() => import("@/components/property/PropertyList"));
export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, status } = useProperty({ id: id as string });

  if (status === "loading") {
    return <DetailScreenSkeleton />;
  }
  if (status === "error") {
    return <Text>Something went wrong</Text>;
  }

  const DetailsList = Object.values(EXTRA_FEATURES_ENUM).reduce(
    (prev, curr) => {
      return {
        ...prev,
        [humanizeString(curr)]: data.extra_features?.includes(curr)
          ? "Yes"
          : "No",
      };
    },
    {
      ["Type"]: data.categories?.[0]?.name,
      ["Purpose"]: data.selling_mode,
      ["Furnishing"]: data.is_furnished ? "Furnished" : "Not Furnished",
      ["Listed By"]: data.listed_by,
    }
  );
  return (
    <View className="flex-1 bg-background">
      <AdParallexScrollLayout
        id={data.id}
        adOwnerId={data.requested_by.id}
        isPremium={data.is_premium}
        thumbnail={data.thumbnail}
        headerImages={data.images?.map((i) => i.url)}
        className="pb-24 relative"
        favouriteButton={{
          id: data.id,
          type: "property_ad",
          isFavourite: data.is_favourite,
        }}
        onImageTapped={(index) => {
          router.navigate({
            pathname: `/property/[id]/gallery`,
            params: {
              id: id,
            },
          });
        }}
        onEdit={() => {
          router.navigate({
            pathname: `/property/[id]/edit/edit-primary-category`,
            params: {
              id: id,
            },
          });
        }}
      >
        <View className="px-4 py-5 gap-8 bg-background flex-1">
          <View className="gap-y-3">
            <View className="gap-y-1">
              <View className="flex-row justify-between items-start">
                <Text className={`text-sm text-muted-foreground capitalize`}>
                  {`House for ${data.selling_mode}`}
                </Text>
                <Text className={`text-sm text-muted-foreground capitalize`}>
                  {`${differenceInTime(new Date(), new Date(data.created_at))}`}
                </Text>
              </View>
              <Text
                className={`font-bold text-primary`}
                style={{ fontSize: 28 }}
              >
                {`${formatPrice({
                  amount: data.price,
                  currency_code: "aed",
                })}`}
              </Text>
            </View>
            <View className="gap-y-3">
              <View className="flex-row gap-1 items-center w-[90%]">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Theme.slate[600]}
                  className="mt-1"
                />
                <Text className="text-slate-600">{data.address}</Text>
              </View>
              <View className="flex-row gap-4 flex-wrap">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="bed-outline"
                    size={20}
                    color={Theme.slate[600]}
                  />
                  <Text className="text-slate-800">{`${data.bedroom_count} Beds`}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="bathtub-outline"
                    size={20}
                    color={Theme.slate[600]}
                  />
                  <Text className="text-slate-800">{`${data.bathroom_count} Baths`}</Text>
                </View>
                {data.area ? (
                  <View className="flex-row items-center gap-2">
                    <Ionicons
                      name="expand-outline"
                      size={20}
                      color={Theme.slate[600]}
                    />
                    <Text className="text-slate-800">{`${new Intl.NumberFormat().format(
                      data.area
                    )} sqft`}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
          <View className="border-t pt-6 pb-2 border-gray-200 gap-4">
            <Text className="text-2xl font-medium">{`${data.title}`}</Text>
            <View>
              <Text className="text-lg font-medium">Description</Text>
              <TruncatedText>{`${data.description}`}</TruncatedText>
            </View>
          </View>
          <Card className="gap-y-5">
            <Text className="text-xl font-medium">Details</Text>
            <TruncatedFlatList
              data={Object.entries(DetailsList)}
              renderItem={({ item: [key, value], index }) => (
                <View style={{ width: "50%", marginBottom: 12 }} key={index}>
                  <Text className="text-gray-500 capitalize">{key}</Text>
                  <Text>{value}</Text>
                </View>
              )}
            />
          </Card>
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
        <Suspense fallback={null}>
          <View className="flex-1 bg-background py-8">
            <Text className="text-xl font-semibold pl-4 pb-2">
              {"Similar Ads"}
            </Text>
            <PropertyList
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
          onPress={() => Linking.openURL(`https://wa.me/${data.phone_number}`)}
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
