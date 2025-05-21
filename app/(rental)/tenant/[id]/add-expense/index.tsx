import { useGetExpenseCategories } from "@/api/hooks/expense/queries";
import CategoryItem from "@/components/(rentals)/expense/CategoryItem";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import Feather from "@expo/vector-icons/Feather";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";

export const SelectBuilding = () => {
  const tenantId = useLocalSearchParams().id as string;
  const { data, status, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useGetExpenseCategories();
  const searchParams = useLocalSearchParams();
  const title = searchParams.title as string;
  const router = useRouter();

  if (status === "loading") {
    return <Loading />;
  }
  if (status === "error") {
    return <Error />;
  }
  const expenseCategories = data.pages.map((d) => d.expenseCategories).flat();
  if (expenseCategories.length === 0) {
    return <NoData />;
  }

  return (
    <PlaceAdLayout title="Select a category" className="relative flex-1">
      <FlatList
        data={expenseCategories}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          gap: 12,
        }}
        renderItem={(props) => (
          <CategoryItem
            onPress={() => {
              router.navigate({
                pathname: "/(rental)/tenant/[id]/add-expense/add-details",
                params: {
                  id: tenantId,
                  category_id: props.item.id,
                  category_name: props.item.name,
                  title: title,
                },
              });
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
        <Link
          href={{
            pathname: "/(rental)/tenant/[id]/add-expense/create-category",
            params: {
              id: tenantId,
              title: title,
            },
          }}
          asChild
        >
          <Button
            variant={"default"}
            rippleClassName="bg-blue-100"
            className="px-5 py-3 rounded-md self-end h-auto bg-blue-100"
            rippleBorderRadius={8}
          >
            <Text className="font-semibold text-blue-600 text-lg">
              Create New Category
            </Text>
          </Button>
        </Link>
      </View>
    </PlaceAdLayout>
  );
};
const Loading = () => {
  return (
    <PlaceAdLayout title="Select a category" className="relative flex-1">
      <View className="gap-2 flex items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    </PlaceAdLayout>
  );
};
const Error = () => {
  return (
    <PlaceAdLayout title="Select a category" className="relative flex-1">
      <View className="gap-2">
        <Text className="text-2xl font-bold">Something went wrong</Text>
      </View>
    </PlaceAdLayout>
  );
};
const NoData = () => {
  const tenantId = useLocalSearchParams().id as string;
  return (
    <PlaceAdLayout title="Select a category">
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
            You haven't created any Categories
          </Text>
          <Text className="text-sm text-center text-gray-600">
            Create a Category by clicking on the button below
          </Text>
        </View>
        <View>
          <Link
            href={{
              pathname: "/(rental)/tenant/[id]/add-expense/create-category",
              params: {
                id: tenantId,
              },
            }}
          >
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
