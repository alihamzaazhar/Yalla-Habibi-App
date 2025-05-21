import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import PropertyExtraDetailsForm from "@/components/property/forms/PropertyExtraDetailsForm";
import { useUpdatePropertyAd } from "@/api/hooks/vendor/products/mutations";

const EditExtraDetails = () => {
  const router = useRouter();
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  const data = usePropertyAdStoreContext((store) => store.data);
  const propertyId = data?.id;
  const { mutateAsync: updatePropertyAd, status: updatePropertyAdStatus } =
    useUpdatePropertyAd();

  return (
    <PlaceAdLayout
      title="Edit Extra Features"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/property/[id]`,
          params: {
            id: propertyId!,
          },
        });
      }}
    >
      <PropertyExtraDetailsForm
        initalData={
          data
            ? {
                extra_features: data.extra_features,
              }
            : undefined
        }
        mode="edit"
        onSubmit={(values) =>
          new Promise((resolve) => {
            updatePropertyAd(
              {
                id: propertyId ?? "",
                data: values,
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
            pathname: `/property/[id]`,
            params: {
              id: propertyId!,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default EditExtraDetails;
