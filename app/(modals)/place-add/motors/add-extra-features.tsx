import React from "react";
import { useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import MotorAdExtraFeaturesForm from "@/components/motors/forms/car-forms/ExtraFeaturesForm";

const AddExtraDetails = () => {
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const data = useMotorAdStoreContext((store) => store.data);
  const router = useRouter();

  return (
    <PlaceAdLayout title="Add Motors Details">
      <MotorAdExtraFeaturesForm
        initalData={
          data
            ? {
                extra_features: data.extra_features,
              }
            : undefined
        }
        mode="create"
        onSubmit={async (values) => {
          appendDataToStore(values);
          router.navigate("/(modals)/place-add/motors/add-images");
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddExtraDetails;
