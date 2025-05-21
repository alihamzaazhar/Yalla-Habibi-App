import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import PropertyFeaturesForm from "@/components/property/forms/PropertyFeaturesForm";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import { useUpdatePropertyAd } from "@/api/hooks/vendor/products/mutations";

const AddFeaturesScreen = () => {
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
      title="Edit Features"
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
      <PropertyFeaturesForm
        initialData={
          data
            ? {
                bathroom_count: data.bathroom_count,
                bedroom_count: data.bedroom_count,
                is_furnished: data.is_furnished,
                listed_by: data.listed_by,
              }
            : undefined
        }
        mode="edit"
        onSubmit={(values) =>
          new Promise(async (resolve) => {
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
            pathname: `/property/[id]/edit/edit-extra-details`,
            params: {
              id: propertyId!,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddFeaturesScreen;
