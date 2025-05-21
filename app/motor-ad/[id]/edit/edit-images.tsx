import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useUpdateMotorAd } from "@/api/hooks/vendor/services/motor-ads/mutations";
import MotorAdImagesForm from "@/components/motors/forms/ImagesForm";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

const EditImages = () => {
  const router = useRouter();
  const data = useMotorAdStoreContext((store) => store.data);
  const id = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: updateMotorAd, status: updateMotorAdStatus } =
    useUpdateMotorAd();
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
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
      <MotorAdImagesForm
        initalData={
          data
            ? {
                images: data.images,
              }
            : undefined
        }
        mode="edit"
        onSubmit={async (values) =>
          new Promise(async (resolve) => {
            const { parsedForClient, parsedForServer } = await uploadFiles(
              values.images
            );
            updateMotorAd(
              {
                id: id ?? "",
                payload: {
                  ...values,
                  images: parsedForServer,
                },
              },
              {
                onSuccess: (values) => {
                  const updatedData = { ...values, images: parsedForClient };
                  appendDataToStore(updatedData);
                  resolve();
                },
              }
            );
          })
        }
        onNext={() => {
          router.navigate(`/motor-ad/${id}`);
        }}
      />
    </PlaceAdLayout>
  );
};

export default EditImages;
