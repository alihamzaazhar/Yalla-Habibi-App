import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import PropertyExtraDetailsForm from "@/components/property/forms/PropertyExtraDetailsForm";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";

const AddExtraDetails = () => {
  const router = useRouter();
  const data = usePropertyAdStoreContext((state) => state.data);
  const appendDataToStore = usePropertyAdStoreContext(
    (state) => state.actions.updateData
  );

  return (
    <PlaceAdLayout title="Add Property Details">
      <PropertyExtraDetailsForm
        initalData={
          data
            ? {
                extra_features: data?.extra_features,
              }
            : undefined
        }
        mode="create"
        onSubmit={(values) => {
          appendDataToStore(values);
          router.navigate({
            pathname: "/(modals)/place-add/property/order-summary",
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddExtraDetails;
