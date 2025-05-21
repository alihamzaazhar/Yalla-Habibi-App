import { useRentalBuildings } from "@/api/hooks/rental-properties/queries";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme } from "@/constants";
import RectButton from "@/ui/RectButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { formatDate } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

const SelectBuildingFilter = () => {
  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useRentalBuildings();
  const router = useRouter();
  const { returnPath, buildingId } = useLocalSearchParams();

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
      <RectButton
        className="flex-row bg-white rounded-md p-4 mx-4 gap-4 items-center"
        onPress={() =>
          router.navigate({
            //@ts-ignore
            pathname: returnPath ?? "/(rental)/property",
            params: {
              returnPath,
            },
          })
        }
      >
        {!buildingId ? (
          <AntDesign
            name="check"
            size={16}
            color={`hsl(${Theme.colors.foreground})`}
          />
        ) : null}
        <Text>All</Text>
      </RectButton>
      <FlatList
        data={allBuildings}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          gap: 12,
        }}
        renderItem={({ item: building, index }) => (
          <RectButton
            key={building.id}
            onPress={() => {
              router.navigate({
                //@ts-ignore
                pathname: returnPath ?? "/(rental)/property",
                params: {
                  buildingId: building.id,
                  buildingName: building.name,
                  returnPath: returnPath,
                },
              });
            }}
            className="flex-row bg-white rounded-md p-4 justify-between"
          >
            <View className="flex-row items-center gap-4">
              {buildingId === building.id ? (
                <AntDesign
                  name="check"
                  size={20}
                  color={`hsl(${Theme.colors.foreground})`}
                />
              ) : null}
              <Text>{building.name}</Text>
            </View>
            <Text className="text-sm font-medium text-muted-foreground">
              {formatDate(new Date(building.created_at), "MMM yyyy")}
            </Text>
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
        className="flex items-center gap-4 flex-1"
        style={{ marginTop: 80, marginHorizontal: 40 }}
      >
        <View className="gap-2">
          <Text className="text-2xl font-medium text-gray-400 text-center">
            No property created yet.
          </Text>
        </View>
      </View>
    </PlaceAdLayout>
  );
};
export default SelectBuildingFilter;
