import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import CouponAdDetailsForm from "@/components/coupons/forms/BasicDetailsForm";
import { Alert } from "react-native";
import { useCouponAdStoreContext } from "@/lib/coupons/coupon-ad-store-context";
import useSaveCoupon from "@/lib/coupons/hooks/useSaveCoupon";

const AddDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const collection_id = params.collectionId as string;
  const { mutate: saveCoupon, isLoading: isSaving } = useSaveCoupon();
  const data = useCouponAdStoreContext((store) => store.data);
  const createdCouponId = useCouponAdStoreContext((store) => store.data?.id);
  const updateStore = useCouponAdStoreContext(
    (store) => store.actions.updateData
  );

  return (
    <PlaceAdLayout title="Create a coupon">
      <CouponAdDetailsForm
        data={data}
        mode="create"
        onSubmit={(values) =>
          new Promise((resolve) => {
            {
              const data = {
                collection_id,
                id: createdCouponId,
                ...values,
              };
              saveCoupon(data, {
                onError: (error) => {
                  let errorMessage =
                    typeof error?.response?.data?.message === "string"
                      ? error?.response?.data?.message
                      : "Something went wrong";
                  if (errorMessage.includes("already exists")) {
                    errorMessage =
                      "You have already created an coupon code with this title. Please use a different title";
                  }
                  resolve();
                  Alert.alert("Error", errorMessage);
                },
                onSuccess: (updatedData) => {
                  updateStore({
                    collection_id: updatedData.collection_id_from_defaults,
                    title: updatedData.title,
                    discount_price: updatedData.discounted_price_amount,
                    price: updatedData.price_amount,
                    images: updatedData.images,
                    description: updatedData.description,
                    id: updatedData.id,
                    coupon_code: updatedData.coupon_code,
                  });
                  resolve();
                  router.navigate("/(modals)/place-add/coupon/order-summary");
                },
              });
            }
          })
        }
      />
    </PlaceAdLayout>
  );
};

export default AddDetailsScreen;
