import {
  RentalPropertiesListParams,
  useRentalProperties,
} from "@/api/hooks/rental-properties/queries";
import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ListRenderItem, Text } from "react-native";
import { ActivityIndicator, View } from "react-native";
import RentalPropertyCard from "../../RentalPropertyCard";
import Entypo from "@expo/vector-icons/Entypo";
import { FlatList } from "react-native-gesture-handler";
import { FlatListProps } from "react-native";
interface PropertyScreenProps {
  filters?: RentalPropertiesListParams;
}
type UseRentalPropertiesDataType = NonNullable<
  ReturnType<typeof useRentalProperties>["data"]
>["pages"][number]["rental_properties"][number];

type NestedVariants = Array<
  UseRentalPropertiesDataType & { children: NestedVariants }
>;

const ITEM_HEIGHT = 300;
const RentalPropertiesList = ({ filters }: PropertyScreenProps) => {
  const { data, status, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useRentalProperties(filters);

  const finalData = useMemo(() => {
    if (!data) return [];
    const allProperties = data.pages.map((d) => d.rental_properties).flat();
    //Group all properties by product_id
    const groupedProperties = allProperties.reduce((prev, curr) => {
      const productId = curr.product_id;
      if (!prev[productId]) {
        prev[productId] = [];
      }
      //@ts-ignore
      prev[productId].push(curr);
      return prev;
    }, {} as Record<string, NestedVariants>);
    for (let [key, variants] of Object.entries(groupedProperties)) {
      let variantsWithChildren = relateVariantsWithTheirChildren(variants);
      groupedProperties[key] = variantsWithChildren;
    }
    return Object.entries(groupedProperties);
  }, [data]);

  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  if (!data.pages.length || !data.pages[0].rental_properties.length)
    return <NoDataFound />;

  return (
    <FlatList
      data={finalData}
      keyExtractor={([id]) => id}
      extraData={finalData}
      renderItem={PropertyItem}
      onEndReachedThreshold={0.5}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
      ListFooterComponent={() => (
        <View style={{ marginBottom: 60 }}>
          {isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null}
        </View>
      )}
    />
  );
};

const PropertyItem = ({
  item: property,
  index,
}: Parameters<ListRenderItem<[string, NestedVariants]>>["0"]) => {
  const propertyId = property[0];
  const variants = property[1];
  if (!propertyId && !variants) return null;
  const firstVariant = variants[0];
  const propertyDetails = firstVariant ? firstVariant : null;
  if (!propertyDetails) return null;

  return (
    <View>
      <View className="flex-1">
        <View className="flex-row justify-between px-4 mb-6">
          <View>
            <Text className="text-xl font-semibold text-gray-800">
              {propertyDetails.property_title}
            </Text>
            <View>
              <View className="flex-row gap-4">
                <View className="flex-row gap-1">
                  <Text className="font-medium text-sm text-gray-400">
                    {"Building:"}
                  </Text>
                  <Text className="text-sm font-semibold text-gray-600">
                    {propertyDetails.building}
                  </Text>
                </View>
                <View className="gap-2 flex-row items-center">
                  <Text className="font-medium text-sm text-gray-400">
                    {"Apartment:"}
                  </Text>
                  <Text className="font-medium text-sm text-gray-600">
                    {propertyDetails.apartment}
                  </Text>
                </View>
                <View className="gap-2 flex-row items-center">
                  <Text className="font-medium text-sm text-gray-400">
                    {"Floor:"}
                  </Text>
                  <Text className="font-medium text-sm text-gray-600">
                    {propertyDetails.floor}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View>
            <Link
              href={{
                pathname: `/(rental)/property/[id]/edit/edit-basic-details`,
                params: { id: propertyId },
              }}
              asChild
            >
              <BorderlessButton className="rounded-full bg-white p-1.5">
                <Entypo name="pencil" size={20} color={Theme.slate[500]} />
              </BorderlessButton>
            </Link>
          </View>
        </View>
        <View className="gap-4">
          {variants.map((variant, idx) => (
            <View className="px-4 gap-4" key={idx}>
              <RentalPropertyCard key={variant.variant_id} property={variant} />
              {variant.children.map((variant, idx) => (
                <View className="pl-4 gap-4" key={idx}>
                  <RentalPropertyCard
                    key={variant.variant_id}
                    property={variant}
                  />
                  {variant.children.map((variant, idx) => (
                    <View className="pl-4 gap-4" key={idx}>
                      <RentalPropertyCard
                        key={variant.variant_id}
                        property={variant}
                      />
                    </View>
                  ))}
                </View>
              ))}
              {idx < variants.length - 1 ? (
                <View className="w-full bg-gray-200 h-0.5 my-4" />
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const relateVariantsWithTheirChildren = (
  variants: Array<UseRentalPropertiesDataType>
): NestedVariants => {
  const map = new Map<string, NestedVariants[number]>();
  for (const variant of variants) {
    map.set(variant.variant_id, { ...variant, children: [] as NestedVariants });
  }
  const result: NestedVariants = [];
  for (const variant of variants) {
    const parentId = variant.parent_id;
    if (parentId === null || !map.has(parentId)) {
      result.push(map.get(variant.variant_id)!);
    } else {
      map.get(parentId)?.children.push(map.get(variant.variant_id)!);
    }
  }
  return result;
};

const Loading = () => {
  return (
    <View>
      <View className="gap-y-4 px-4 flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    </View>
  );
};
const Error = () => {
  return (
    <View>
      <Text>Error</Text>
    </View>
  );
};

const NoDataFound = () => {
  return (
    <View className="flex items-center justify-center gap-4 flex-1 mb-8">
      <View className="gap-2">
        <Text className="text-2xl font-medium text-gray-500 text-center">
          You don't have any property
        </Text>
        <Text className="text-md font-medium text-gray-400 text-center">
          Add your first property using the button below
        </Text>
      </View>
      <Link
        href={{
          pathname: "/(rental)/property/create",
          params: {},
        }}
        asChild
      >
        <BorderlessButton ButtonProps={{ style: { alignSelf: "center" } }}>
          <Feather name="plus-circle" size={60} color={`${Theme.gray[400]}`} />
        </BorderlessButton>
      </Link>
    </View>
  );
};

export default RentalPropertiesList;
