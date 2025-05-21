import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import SelectNestedCategory from "@/components/motors/SelectNestedCategory";
import { Text } from "react-native";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";

const SelectCarTypeScreen = () => {
  const updateData = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const updateMetadata = useMotorAdStoreContext(
    (store) => store.actions.updateMetadata
  );
  const savedData = useMotorAdStoreContext((store) => store.data);

  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const rootCategoryId = searchParams.rootCategoryId;

  if (typeof rootCategoryId !== "string")
    return (
      <PlaceAdLayout title="Select Make">
        <Text>{"No Root Category Selected"}</Text>
      </PlaceAdLayout>
    );

  return (
    <PlaceAdLayout title="Select Make">
      <SelectNestedCategory
        selectedCatageoryId={savedData?.categories?.[1]}
        onCategorySelect={({ id, handle, name }, has_children) => {
          const newCategories = savedData?.categories ?? [];
          newCategories[1] = id;
          updateData({
            categories: newCategories,
          });
          updateMetadata({
            categories: {
              [id]: {
                id: id,
                name: name,
                handle: handle,
              },
            },
          });
          if (has_children) {
            router.navigate({
              pathname: "/(modals)/place-add/motors/select-car-model",
              params: {
                rootCategoryId: id,
              },
            });
          } else {
            router.navigate({
              pathname: "/(modals)/place-add/motors/add-details",
              params: {
                rootCategoryId: id,
              },
            });
          }
        }}
        rootCategoryId={rootCategoryId}
      />
    </PlaceAdLayout>
  );
};
export default SelectCarTypeScreen;
