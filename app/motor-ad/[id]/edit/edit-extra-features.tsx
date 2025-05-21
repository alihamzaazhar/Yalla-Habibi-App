import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useUpdateMotorAd } from "@/api/hooks/vendor/services/motor-ads/mutations";
import MotorAdExtraFeaturesForm from "@/components/motors/forms/car-forms/ExtraFeaturesForm";

const EditExtraFeatures = () => {
  const router = useRouter();
  const data = useMotorAdStoreContext((store) => store.data);
  const id = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: updateMotorAd, status: updateMotorAdStatus } =
    useUpdateMotorAd();
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  return (
    <PlaceAdLayout
      title="Edit Motor Details"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/motor-ad/[id]`,
          params: {
            id: id!,
          },
        });
      }}
    >
      <MotorAdExtraFeaturesForm
        initalData={
          data
            ? {
                extra_features: data.extra_features,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise((resolve) => {
            console.log(values)
            updateMotorAd(
              {
                id: id ?? "",
                payload: values,
              },
              {
                onSuccess: () => {
                  appendDataToStore(values);
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate({
            pathname: `/motor-ad/[id]/edit/edit-images`,
            params: {
              id: id!,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default EditExtraFeatures;
