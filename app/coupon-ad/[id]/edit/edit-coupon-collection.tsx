import { useUpdateCouponAd } from "@/api/hooks/vendor/coupon-ads/mutations";
import SelectCouponCollection from "@/components/coupons/forms/SelectCouponCollection";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme, globalStyles } from "@/constants";
import { useCouponAdStoreContext } from "@/lib/coupons/coupon-ad-store-context";
import BaseButton from "@/ui/BaseButton";
import { Button } from "@/ui/Button";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const EditCouponCollection = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const id = useLocalSearchParams().id as string;
  const savedCollectionId = useCouponAdStoreContext(
    (store) => store.data?.collection_id
  );
  const updateStore = useCouponAdStoreContext(
    (store) => store.actions.updateData
  );
  const [selectedCollectionId, setSelectedCollectionId] = React.useState<
    string | undefined
  >(savedCollectionId);

  const { mutate: updateCouponAd, status: updatingStatus } =
    useUpdateCouponAd();
  const shouldUpdate = selectedCollectionId !== savedCollectionId;
  return (
    <PlaceAdLayout
      title="Edit Coupon Collection"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: "/coupon-ad/[id]",
          params: {
            id: id!,
          },
        })
      }}
    >
      <SelectCouponCollection
        selectedCollectionId={selectedCollectionId}
        setSelectedCollectionId={setSelectedCollectionId}
        savedCollectionId={savedCollectionId}
      />
      <View
        className="absolute bottom-0 p-6 w-full bg-white"
        style={globalStyles.shadowMd}
      >
        <BaseButton
          ButtonProps={{
            style: {
              width: "100%",
              backgroundColor: Theme.primary.DEFAULT,
            },
          }}
          className="w-full"
          variant={"default"}
          onPress={() => {
            if (shouldUpdate) {
              updateCouponAd(
                {
                  id: id!,
                  collection_id_from_defaults: selectedCollectionId,
                },
                {
                  onSuccess: () => {
                    updateStore({
                      collection_id: selectedCollectionId,
                    });
                  },
                }
              );
            } else {
              router.navigate({
                pathname: "/coupon-ad/[id]/edit/edit-details",
                params: {
                  id: id!,
                },
              });
            }
          }}
          isLoading={updatingStatus === "loading"}
        >
          <Text className="text-white font-bold text-xl">
            {shouldUpdate ? "Update" : "Next"}
          </Text>
        </BaseButton>
      </View>
    </PlaceAdLayout>
  );
};

export default EditCouponCollection;
