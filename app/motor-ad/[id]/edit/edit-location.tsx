import React from "react";
import { LatLng } from "react-native-maps";
import { View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Text } from "react-native";
import SelectLocationMapView from "@/components/shared/SelectLocationMapView";
import { useRouter } from "expo-router";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import { useUpdateMotorAd } from "@/api/hooks/vendor/services/motor-ads/mutations";
import BaseButton from "@/ui/BaseButton";
import { Theme } from "@/constants";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";

const isSameLocation = (location: LatLng, savedLocation: LatLng) => {
  return (
    location.latitude === savedLocation.latitude &&
    location.longitude === savedLocation.longitude
  );
};

export default function EditLocation() {
  const router = useRouter();
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const data = useMotorAdStoreContext((store) => store.data);
  const { mutateAsync: updateMotorAd, status: updateMotorAdStatus } =
    useUpdateMotorAd();
  const savedLocation = {
    latitude: data?.location?.lat ?? 25.276987,
    longitude: data?.location?.lng ?? 55.296249,
  };
  const [coordinates, setCoordinates] = React.useState<LatLng>(savedLocation);
  const isUpdated = !isSameLocation(coordinates, savedLocation);
  const metadata = useMotorAdStoreContext((store) => store.metadata);
  const rootCategory =
    typeof data?.categories?.[0] === "string"
      ? (metadata?.categories[data?.categories?.[0]] as Category)
      : null;
  return (
    <StackScreenLayout
      title="Edit Location"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/motor-ad/[id]`,
          params: {
            id: data?.id!,
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
          isLoading={updateMotorAdStatus === "loading"}
          onPress={() => {
            if (isUpdated) {
              updateMotorAd(
                {
                  id: data?.id!,
                  payload: {
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
              if (
                rootCategory?.handle.includes(
                  MOTOR_CATEGORIES_HANDLES[
                    "auto-accessories-parts-motor-ad-categories"
                  ]
                ) ||
                rootCategory?.handle.includes(
                  MOTOR_CATEGORIES_HANDLES["number-plates-motor-ad-categories"]
                )
              ) {
                router.navigate({
                  pathname: `/motor-ad/[id]/edit/edit-images`,
                  params: {
                    id: data?.id!,
                  },
                });
              } else {
                router.navigate({
                  pathname: `/motor-ad/[id]/edit/edit-features`,
                  params: {
                    id: data?.id!,
                  },
                });
              }
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
