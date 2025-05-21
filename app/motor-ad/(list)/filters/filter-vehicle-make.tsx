import React from "react";
import { useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import SelectNestedCategory from "@/components/motors/SelectNestedCategory";
import { Text } from "react-native";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
const SelectCarTypeScreen = () => {
  const { setFilters, filters } = useMotorAdsFilter((state) => state);
  const { updateMetadata } = useGlobalMetaData();
  const router = useRouter();
  const rootCategoryId = filters.categories?.[0];
  if (typeof rootCategoryId !== "string")
    return (
      <PlaceAdLayout title="Select Make">
        <Text>{"No Root Category Selected"}</Text>
      </PlaceAdLayout>
    );

  return (
    <PlaceAdLayout
      title="Select Make"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/(tabs)`,
        });
      }}
    >
      <SelectNestedCategory
        allOption
        onAllOptionSelect={() => {
          setFilters({
            categories: [rootCategoryId],
          });
          router.navigate("/motor-ad/(list)/see-more");
        }}
        onCategorySelect={(category, has_children) => {
          setFilters({
            categories: [rootCategoryId, category.id],
          });
          updateMetadata({
            [category.id]: {
              id: category.id,
              name: category.name,
              handle: category.handle,
              parent_category_id: filters.categories?.[0],
            },
          });
          if (has_children) {
            router.navigate("/motor-ad/(list)/filters/filter-vehicle-model");
          } else {
            router.navigate("/motor-ad/(list)/see-more");
          }
        }}
        rootCategoryId={rootCategoryId}
      />
    </PlaceAdLayout>
  );
};
export default SelectCarTypeScreen;
