import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import PropertyDetailForm from "@/components/property/forms/PropertyDetailForm";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";

const AddDetailsScreen = () => {
  const router = useRouter();
  const data = usePropertyAdStoreContext((store) => store.data);
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  return (
    <PlaceAdLayout title="Add Property Details">
      <PropertyDetailForm
        initialData={
          data
            ? {
                area: data?.area,
                description: data?.description,
                images: data?.images,
                phone_number: data?.phone_number,
                price: data?.price,
                title: data?.title,
                ready_at: data?.ready_at,
              }
            : undefined
        }
        selling_mode={data?.selling_mode}
        mode="create"
        onSubmit={(values) => {
          appendDataToStore(values);
          router.navigate("/(modals)/place-add/property/add-location");
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddDetailsScreen;
