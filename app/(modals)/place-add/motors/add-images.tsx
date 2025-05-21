import { useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import MotorAdImagesForm from "@/components/motors/forms/ImagesForm";
import usePersistAdDataFromStore from "@/lib/placing-motors-ad/hooks/usePersistAdData";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";

const AddImages = () => {
  const router = useRouter();
  const data = useMotorAdStoreContext((store) => store.data);
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const currentVariant = useVariantsContext((store) => store.currentVariant);

  const id = useMotorAdStoreContext((store) => store.data?.id);
  const { mutate: persistAdData } = usePersistAdDataFromStore();

  return (
    <PlaceAdLayout title="Add Motor Details">
      <MotorAdImagesForm
        initalData={
          data
            ? {
                images: data?.images ?? [],
              }
            : undefined
        }
        mode="create"
        onSubmit={async (values) =>
          new Promise((resolve) => {
            persistAdData(
              {
                ...data,
                ...values,
                id: id,
              } as MotorAdInputSchema,
              {
                onSuccess: (values) => {
                  appendDataToStore(values);
                  router.navigate({
                    pathname: "/(modals)/place-add/motors/order-summary",
                    params: {
                      cartId: id,
                    },
                  });
                  resolve();
                },
              }
            );
          })
        }
      />
    </PlaceAdLayout>
  );
};

export default AddImages;
