import React from "react";
import { LatLng } from "react-native-maps";
import { View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Text } from "react-native";
import { Button } from "@/ui/Button";
import SelectLocationMapView from "@/components/shared/SelectLocationMapView";
import { useRouter } from "expo-router";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import { useUpdatePropertyAd } from "@/api/hooks/vendor/products/mutations";
import BorderlessButton from "@/ui/BorderlessButton";
import BaseButton from "@/ui/BaseButton";
import { Theme } from "@/constants";

const isSameLocation = (location: LatLng, savedLocation: LatLng) => {
  return (
    location.latitude === savedLocation.latitude &&
    location.longitude === savedLocation.longitude
  );
};

export default function EditLocation() {
  const router = useRouter();
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  const data = usePropertyAdStoreContext((store) => store.data);
  const { mutateAsync: updatePropertyAd, status: updatePropertyAdStatus } =
    useUpdatePropertyAd();
  const savedLocation = {
    latitude: data?.location?.lat ?? 25.276987,
    longitude: data?.location?.lng ?? 55.296249,
  };
  const propertyId = data?.id!;
  const [coordinates, setCoordinates] = React.useState<LatLng>(savedLocation);
  const isUpdated = !isSameLocation(coordinates, savedLocation);
  return (
    <StackScreenLayout
      title="Add Location"
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
      <SelectLocationMapView
        coordinates={coordinates}
        selectCoordinates={setCoordinates}
      />
      <View className="absolute bottom-0 p-6 w-full">
        <BaseButton
          ButtonProps={{
            style: {
              width: "100%",
              backgroundColor: Theme.primary.DEFAULT,
            },
          }}
          className="w-full"
          variant={"default"}
          isLoading={updatePropertyAdStatus === "loading"}
          onPress={() => {
            if (isUpdated) {
              updatePropertyAd(
                {
                  id: propertyId ?? "",
                  data: {
                    location: {
                      lat: coordinates.latitude,
                      lng: coordinates.longitude,
                    },
                  },
                },
                {
                  onSuccess: () => {
                    appendDataToStore({
                      location: {
                        lat: coordinates.latitude,
                        lng: coordinates.longitude,
                      },
                    });
                  },
                }
              );
            } else {
              router.navigate({
                pathname: `/property/[id]/edit/edit-features`,
                params: {
                  id: propertyId!,
                },
              });
            }
          }}
        >
          <Text className="text-white font-bold text-xl">
            {isUpdated ? "Update" : "Next"}
          </Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
}
