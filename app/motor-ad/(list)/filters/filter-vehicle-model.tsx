import React from "react";
import { useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import SelectNestedCategory from "@/components/motors/SelectNestedCategory";
import { Text } from "react-native";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";

const SelectCarTypeScreen = () => {
  const { filters, setFilters } = useMotorAdsFilter((store) => store);
  const { updateMetadata } = useGlobalMetaData();
  const router = useRouter();
  const rootCategoryId = filters.categories?.[1];
  if (typeof rootCategoryId !== "string")
    return (
      <PlaceAdLayout title="Select Model">
        <Text>{"No Root Category Selected"}</Text>
      </PlaceAdLayout>
    );

  return (
    <PlaceAdLayout
      title="Select Model"
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
            categories:
              filters?.categories?.[0] && filters?.categories?.[1]
                ? [filters.categories[0], filters.categories[1]]
                : [],
          });
          router.navigate("/motor-ad/(list)/see-more");
        }}
        onCategorySelect={({ id, name, handle }) => {
          setFilters({
            categories: filters.categories ? [...filters.categories, id] : [id],
          });
          updateMetadata({
            [id]: {
              id: id,
              handle: handle,
              name: name,
              parent_category_id: filters.categories?.[0],
            },
          });

          router.navigate("/motor-ad/(list)/see-more");
        }}
        rootCategoryId={rootCategoryId}
      />
    </PlaceAdLayout>
  );
};
export default SelectCarTypeScreen;
