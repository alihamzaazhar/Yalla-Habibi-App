import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import CouponAdDetailsForm from "@/components/coupons/forms/BasicDetailsForm";
import { useCouponAdStoreContext } from "@/lib/coupons/coupon-ad-store-context";
import { useUpdateCouponAd } from "@/api/hooks/vendor/coupon-ads/mutations";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

const AddDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const collection_id = params.collectionId as string;
  const {
    mutateAsync: updateCouponAd,
    status: updateCouponAdStatus,
    error,
  } = useUpdateCouponAd();
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
  const data = useCouponAdStoreContext((store) => store.data);
  const updateStore = useCouponAdStoreContext(
    (store) => store.actions.updateData
  );
  const errorMessage = error
    ? error?.response?.data?.message ?? "Something went wrong"
    : null;
  return (
    <PlaceAdLayout
      title="Edit a coupon"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: "/coupon-ad/[id]",
          params: {
            id: id!,
          },
        });
      }}
    >
      <CouponAdDetailsForm
        data={{
          description: data?.description,
          discount_price: data?.discount_price,
          price: data?.price,
          title: data?.title,
          images: data?.images,
        }}
        hiddenFields={["coupon_code"]}
        errorMessage={errorMessage}
        mode="edit"
        onSubmit={async (values) => {
          const { discount_price, price, images, ...rest } = values;
          const { parsedForClient, parsedForServer } = await uploadFiles(
            images
          );
          await updateCouponAd({
            id,
            ...rest,
            images: parsedForServer,
            collection_id_from_defaults: collection_id,
            discounted_price_amount: discount_price,
            price_amount: price,
          });
          updateStore({
            ...rest,
            images: parsedForClient,
          });
          router.navigate({
            pathname: `/coupon-ad/[id]`,
            params: {
              id: id,
            },
          });
        }}
        onNext={() => {
          router.navigate({
            pathname: `/coupon-ad/[id]`,
            params: {
              id: id,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default AddDetailsScreen;
