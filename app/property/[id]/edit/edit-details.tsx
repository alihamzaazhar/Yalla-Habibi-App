import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import PropertyDetailForm from "@/components/property/forms/PropertyDetailForm";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import { useUpdatePropertyAd } from "@/api/hooks/vendor/products/mutations";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

const EditDetailsScreen = () => {
  const router = useRouter();
  const data = usePropertyAdStoreContext((store) => store.data);
  const propertyId = usePropertyAdStoreContext((store) => store.data?.id);
  const { mutate: updatePropertyAd, status: updatePropertyAdStatus } =
    useUpdatePropertyAd();
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
  const selling_mode = data?.selling_mode;

  return (
    <PlaceAdLayout
      title="Edit Property Details"
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
      <PropertyDetailForm
        initialData={
          data
            ? {
                area: data.area,
                description: data.description,
                images: data.images,
                phone_number: data.phone_number,
                price: data.price,
                title: data.title,
                ready_at: data.ready_at ? new Date(data.ready_at) : undefined,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise(async (resolve) => {
            const { images, ...rest } = values;
            const { parsedForClient, parsedForServer } = await uploadFiles(
              images
            );
            updatePropertyAd(
              {
                id: propertyId ?? "",
                data: {
                  ...rest,
                  images: parsedForServer,
                },
              },
              {
                onSuccess: () => {
                  appendDataToStore({
                    ...rest,
                    images: parsedForClient,
                  });
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate({
            pathname: `/property/[id]/edit/edit-location`,
            params: {
              id: propertyId!,
            },
          });
        }}
        selling_mode={selling_mode}
      />
    </PlaceAdLayout>
  );
};

export default EditDetailsScreen;
