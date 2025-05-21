import { useCouponAdCollections } from "@/api/hooks/marketplace/services/coupons/queries";
import SelectCouponCollection from "@/components/coupons/forms/SelectCouponCollection";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme, globalStyles } from "@/constants";
import { humanizeString } from "@/lib/common/utils";
import { useCouponAdStoreContext } from "@/lib/coupons/coupon-ad-store-context";
import RippleButton from "@/ui/animations/RippleButton";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

const SelectSpaceType = () => {
  const router = useRouter();
  const selectedCollectionId = useCouponAdStoreContext(
    (store) => store.data?.collection_id
  );
  const updateStore = useCouponAdStoreContext(
    (store) => store.actions.updateData
  );
  const { data, status } = useCouponAdCollections();

  if (status === "loading")
    return (
      <PlaceAdLayout title="Select Coupon Type">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={Theme.slate[600]} />
        </View>
      </PlaceAdLayout>
    );
  if (status === "error")
    return (
      <PlaceAdLayout title="Select Coupon Type">
        <Text>Error...</Text>
      </PlaceAdLayout>
    );
  if (!data)
    return (
      <PlaceAdLayout title="Select Coupon Type">
        <Text>No data...</Text>
      </PlaceAdLayout>
    );
  
  return (
    <PlaceAdLayout title="Select Coupon Type">
      <SelectCouponCollection
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={(id) => {
          updateStore({
            collection_id: id,
          });
          router.navigate({
            pathname: `/(modals)/place-add/coupon/add-details`,
            params: {
              collectionId: id,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default SelectSpaceType;
