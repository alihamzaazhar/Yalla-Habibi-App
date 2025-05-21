import { useRentalBuildings } from "@/api/hooks/rental-properties/queries";
import BuildingItem from "@/components/(rentals)/building/BuildingItem";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme } from "@/constants";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import { Button } from "@/ui/Button";
import Feather from "@expo/vector-icons/Feather";
import { Link, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

export const SelectBuilding = () => {
  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useRentalBuildings();
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "error") {
    return <Error />;
  }
  const allBuildings = data.pages.map((d) => d.buildings).flat();
  if (allBuildings.length === 0) {
    return <NoData />;
  }

  return (
    <PlaceAdLayout title="Select a building" className="relative flex-1">
      <FlatList
        data={allBuildings}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          gap: 12,
        }}
        renderItem={(props) => (
          <BuildingItem
            onPress={() => {
              updateStore({
                building_id: props.item.id,
                building: props.item,
              });
              router.navigate(
                `/(rental)/property/create/property-basic-details`
              );
            }}
            {...props}
          />
        )}
        onEndReachedThreshold={0.5}
        onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null
        }
      />
      <View className="absolute bottom-12 right-6 w-full">
        <Link href={"/(rental)/property/create/create-building"} asChild>
          <Button
            variant={"default"}
            rippleClassName="bg-blue-100"
            className="px-5 py-3 rounded-md self-end h-auto bg-blue-100"
            rippleBorderRadius={8}
          >
            <Text className="font-semibold text-blue-600 text-lg">
              Create New Building
            </Text>
          </Button>
        </Link>
      </View>
    </PlaceAdLayout>
  );
};
const Loading = () => {
  return (
    <PlaceAdLayout title="Select a building" className="relative flex-1">
      <View className="gap-2 flex items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    </PlaceAdLayout>
  );
};
const Error = () => {
  return (
    <PlaceAdLayout title="Select a building" className="relative flex-1">
      <View className="gap-2">
        <Text className="text-2xl font-bold">Something went wrong</Text>
      </View>
    </PlaceAdLayout>
  );
};
const NoData = () => {
  return (
    <PlaceAdLayout
      title="Select a building"
      className="relative flex-1 items-center justify-center gap-6"
    >
      <View
        style={{
          flex: 1,
          gap: 24,
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 24,
        }}
      >
        <View className="px-2 items-center justify-center flex-col">
          <Text className="text-xl font-semibold text-center">
            You haven't created any Building
          </Text>
          <Text className="text-sm text-center text-gray-600">
            Create a Building by clicking on the button below
          </Text>
        </View>
        <View>
          <Link href={"/(rental)/property/create/create-building"}>
            <Button
              variant={"icon"}
              className="bg-primary rounded-full"
              rippleClassName="bg-primary/20"
            >
              <Feather
                name="plus"
                size={30}
                color={`hsl(${Theme.colors.primary.foreground})`}
              />
            </Button>
          </Link>
        </View>
      </View>
    </PlaceAdLayout>
  );
};
export default SelectBuilding;
