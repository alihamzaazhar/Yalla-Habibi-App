import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import PropertyFeaturesForm from "@/components/property/forms/PropertyFeaturesForm";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";

const AddFeaturesScreen = () => {
  const router = useRouter();
  const data = usePropertyAdStoreContext((state) => state.data);
  const appendDataToStore = usePropertyAdStoreContext(
    (state) => state.actions.updateData
  );

  return (
    <PlaceAdLayout title="Add Property Details">
      <PropertyFeaturesForm
        initialData={
          data
            ? {
                bedroom_count: data?.bedroom_count,
                bathroom_count: data?.bathroom_count,
                is_furnished: data?.is_furnished,
                listed_by: data?.listed_by,
              }
            : undefined
        }
        mode="create"
        onSubmit={(values) => {
          appendDataToStore(values);
          router.navigate({
            pathname: "/(modals)/place-add/property/add-extra-details",
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddFeaturesScreen;
