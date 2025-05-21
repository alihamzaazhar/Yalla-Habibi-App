import {
  RentalPropertiesListParams,
  useRentalProperties,
} from "@/api/hooks/rental-properties/queries";
import AvailabilityFilterPicker from "@/components/(rentals)/AvailabilityFilterPicker";
import BuildingSelectFilterPicker from "@/components/(rentals)/BuildingSelectFilterPicker";
import RentalPropertyCard from "@/components/(rentals)/RentalPropertyCard";
import WithHeaderLayout from "@/components/layouts/(rental)/WithHeaderLayout";
import SearchingInput from "@/components/shared/SearchingInput";
import { Theme } from "@/constants";
import BorderlessButton from "@/ui/BorderlessButton";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const PropertyScreen = () => {
  const { buildingId } = useLocalSearchParams();
  const [filters, setFilters_] = useState<
    RentalPropertiesListParams | undefined
  >({
    order: "-created_at",
  });
  const setFilters = (filters: RentalPropertiesListParams) => {
    setFilters_((prev) => ({ ...prev, ...filters }));
  };
  return (
    <WithHeaderLayout
      title="Property"
      headerIconHref={{
        pathname: "/(rental)/property/create",
        params: {},
      }}
      className="bg-gray-100 flex-1"
    >
      <View style={{ paddingBottom: 10, paddingTop: 20 }}>
        <SearchingInput
          afterDebounce={(value) =>
            setFilters({ q: value.length > 1 ? value : undefined })
          }
          placeholder="Search by apartment, floor or title"
        />

        <View className="flex-row gap-1 p-4">
          <BuildingSelectFilterPicker />
          <AvailabilityFilterPicker filters={filters} setFilters={setFilters} />
        </View>
      </View>
      <View className="py-2 flex-1">
        <PropertyScreen_
          filters={{
            ...filters,
            building_id: buildingId as
              | RentalPropertiesListParams["building_id"]
              | undefined,
          }}
        />
      </View>
    </WithHeaderLayout>
  );
};

interface PropertyScreenProps {
  filters?: RentalPropertiesListParams;
}
type UseRentalPropertiesDataType = NonNullable<
  ReturnType<typeof useRentalProperties>["data"]
>["pages"][number]["rental_properties"][number];

type NestedVariants = Array<
  UseRentalPropertiesDataType & { children: NestedVariants }
>;
const PropertyScreen_ = ({ filters }: PropertyScreenProps) => {
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
    <ScrollView className="gap-2">
      {finalData.map((property, index) => {
        const propertyId = property[0];
        const variants = property[1];
        if (!propertyId && !variants) return null;
        return (
          <View key={index}>
            <PropertyItem id={propertyId} variants={variants} />
            {index < finalData.length - 1 ? (
              <View className="w-full bg-gray-300 h-0.5 my-6" />
            ) : null}
          </View>
        );
      })}
      <View style={{ marginBottom: 60 }} />
    </ScrollView>
  );
  //[Todo]: Move to the following once the problem of glitching when updates resovled.
  // return (
  //   <FlatList
  //     data={finalData}
  //     keyExtractor={([id]) => id}
  //     extraData={filters}
  //     renderItem={({ item: property, index }) => {
  //       const propertyId = property[0];
  //       const variants = property[1];
  //       if (!propertyId && !variants) return null;
  //       return (
  //         <View className="flex-1">
  //           <PropertyItem id={propertyId} variants={variants} />
  //           {index < finalData.length - 1 ? (
  //             <View className="w-full bg-gray-300 h-0.5 my-6" />
  //           ) : null}
  //         </View>
  //       );
  //     }}
  //     onEndReachedThreshold={0.5}
  //     onEndReached={() => (hasNextPage ? fetchNextPage() : null)}
  //     ListFooterComponent={() => (
  //       <View style={{ marginBottom: 60 }}>
  //         {isFetchingNextPage ? <ActivityIndicator size={"small"} /> : null}
  //       </View>
  //     )}
  //   />
  // );
};

interface PropertyItemProps {
  id: string;
  variants: NestedVariants;
}
const PropertyItem = ({ id, variants }: PropertyItemProps) => {
  const propertyId = id;
  const firstVariant = variants[0];
  const propertyDetails = firstVariant ? firstVariant : null;
  if (!propertyDetails) return null;

  return (
    <View>
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
          <View className="px-4 gap-2" key={idx}>
            <RentalPropertyCard key={variant.variant_id} property={variant} />
            {variant.children.map((variant, idx) => (
              <View className="pl-4 gap-2" key={idx}>
                <RentalPropertyCard
                  key={variant.variant_id}
                  property={variant}
                />
                {variant.children.map((variant, idx) => (
                  <View className="pl-4 gap-2" key={idx}>
                    <RentalPropertyCard
                      key={variant.variant_id}
                      property={variant}
                    />
                  </View>
                ))}
              </View>
            ))}
            {idx < variants.length - 1 ? (
              <View className="w-full bg-gray-200 h-0.5 my-2" />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

const Loading = () => {
  return (
    <View
      className="flex items-center gap-4 flex-1"
      style={{ marginTop: 80, marginHorizontal: 40 }}
    >
      <ActivityIndicator size={"large"} color={Theme.gray[600]} />
    </View>
  );
};
const Error = () => {
  return (
    <View
      className="flex items-center gap-4 flex-1"
      style={{ marginTop: 80, marginHorizontal: 40 }}
    >
      <Text className="text-red-500">Error</Text>
    </View>
  );
};
const NoDataFound = () => {
  return (
    <View
      className="flex items-center gap-4 flex-1"
      style={{ marginTop: 80, marginHorizontal: 40 }}
    >
      <View className="gap-2">
        <Text className="text-2xl font-medium text-gray-400 text-center">
          No property found
        </Text>
        <Text className="text-md font-medium text-gray-400 text-center">
          Clear your search or add your first property using the button below
        </Text>
      </View>
      <View className="gap-2">
        <Link href={"/(rental)/property/create"} asChild>
          <BorderlessButton ButtonProps={{ style: { alignSelf: "center" } }}>
            <Feather
              name="plus-circle"
              size={60}
              color={`${Theme.gray[300]}`}
            />
          </BorderlessButton>
        </Link>
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

export default PropertyScreen;
