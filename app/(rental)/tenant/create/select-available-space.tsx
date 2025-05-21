import { useRentalProperties } from "@/api/hooks/rental-properties/queries";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import { Theme, globalStyles } from "@/constants";
import { SPACE_TYPES } from "@/constants/enums";
import { formatPrice } from "@/lib/common/prices";
import { humanizeString } from "@/lib/common/utils";
import { Button } from "@/ui/Button";
import RippleButton from "@/ui/animations/RippleButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
  Text,
} from "react-native";
import RectButton from "@/ui/RectButton";

const SelectAvailableSpaceScreen = () => {
  const router = useRouter();
  const spaceType = useLocalSearchParams()
    .spaceType as (typeof SPACE_TYPES)[number];
  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRentalProperties({
      status: "available",
      type: spaceType,
    });
  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;

  const allProperties = data.pages.map((d) => d.rental_properties).flat();
  if (allProperties.length === 0) return <NoDataFound />;

  return (
    <PlaceAdLayout
      title={`Select Available ${humanizeString(spaceType)}s`}
      className="relative flex-1"
    >
      <FlatList
        data={allProperties}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 16,
          paddingVertical: 8,
        }}
        renderItem={({ item: property }) => (

          <RectButton
            key={property.variant_id}
            style={{
              overflow: "hidden",
              borderWidth: 1,
              borderRadius: 8,
              backgroundColor:'transparent',
              borderColor: Theme.gray[200],
            }}
            onPress={() => {
              router.navigate({
                pathname: "/(rental)/tenant/create/add-further-details",
                params: {
                  variantId: property.variant_id,
                  variantPrice: property.prices?.[0].amount,
                },
              });
            }}
          >
            {/*[Todo]: In order to have the ripple effect, we need to update this button styles */}
            <View className="flex-row items-center gap-2 border-b border-gray-200 px-4 py-4 flex-1 bg-gray-50 justify-between">
              <Text className="font-semibold text-xl text-gray-500">
                {humanizeString(property.type)}
              </Text>
              <View className="rounded-md px-2 py-1 flex-row items-center gap-1">
                <FontAwesome
                  name="money"
                  color={`${Theme.green[600]}`}
                  size={18}
                />
                <Text className="text-md font-medium text-green-600">
                  {property.prices?.[0].amount
                    ? formatPrice({
                        amount: property.prices?.[0].amount,
                        currency_code: "aed",
                      })
                    : "0"}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2 px-4 py-4 flex-1 justify-between bg-card">
              <View>
                <Text className="font-medium text-2xl text-gray-800">
                  {humanizeString(property.title)}
                </Text>
                <View className="gap-4 flex-1">
                  <View className="gap-2 flex-row items-center">
                    <Text className="font-medium text-md text-gray-400">
                      {"Building:"}
                    </Text>
                    <Text className="font-medium text-md text-gray-600">
                      {property.building}
                    </Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="gap-2 flex-row items-center">
                      <Text className="font-medium text-sm text-gray-400">
                        {"Apartment:"}
                      </Text>
                      <Text className="font-medium text-sm text-gray-600">
                        {property.apartment}
                      </Text>
                    </View>
                    <View className="gap-2 flex-row items-center">
                      <Text className="font-medium text-sm text-gray-400">
                        {"Floor:"}
                      </Text>
                      <Text className="font-medium text-sm text-gray-600">
                        {property.floor}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </RectButton>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null
        }
      />
    </PlaceAdLayout>
  );
};
const Loading = () => {
  return (
    <PlaceAdLayout title="Select Space Type" className="flex-1">
      <View className="gap-y-4 px-4 flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    </PlaceAdLayout>
  );
};
const Error = () => {
  return (
    <PlaceAdLayout title="Select Space Type">
      <Text>Error</Text>
    </PlaceAdLayout>
  );
};
const NoDataFound = () => {
  return (
    <PlaceAdLayout
      title="Select Space Type"
      className="flex items-center justify-center flex-1"
    >
      <View className="flex items-center justify-center gap-4">
        <View className="gap-2">
          <Text className="text-2xl font-medium text-gray-600">
            There are no more available properties
          </Text>
          <Text className="text-md font-medium text-gray-400">
            Add more properties from properties tab
          </Text>
        </View>
        <View>
          <Link href="/(rental)/property">
            <Button variant={"ghost"} className="w-full">
              <Text className="text-primary font-bold text-xl">
                Go to Rental Properties
              </Text>
            </Button>
          </Link>
        </View>
      </View>
    </PlaceAdLayout>
  );
};

export default SelectAvailableSpaceScreen;
