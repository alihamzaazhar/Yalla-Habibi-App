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
      <PlaceAdLayout title="Select Model">
        <Text>{"No Root Category Selected"}</Text>
      </PlaceAdLayout>
    );

  return (
    <PlaceAdLayout title="Select Model">
      <SelectNestedCategory
        selectedCatageoryId={savedData?.categories?.[2]}
        onCategorySelect={({ id, handle, name }) => {
          const newCategories = savedData?.categories ?? [];
          newCategories[2] = id;
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
          router.navigate("/(modals)/place-add/motors/add-details");
        }}
        rootCategoryId={rootCategoryId}
      />
    </PlaceAdLayout>
  );
};
export default SelectCarTypeScreen;
