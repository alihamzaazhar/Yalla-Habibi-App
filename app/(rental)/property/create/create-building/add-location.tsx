import React from "react";
import { LatLng } from "react-native-maps";
import { Alert, Pressable, View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Text } from "react-native";
import SelectLocationMapView from "@/components/shared/SelectLocationMapView";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCreateBuilding } from "@/api/hooks/rental-properties/mutations";
import { Theme } from "@/constants";
import BaseButton from "@/ui/BaseButton";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";

export default function AddLocation() {
  const searchParams = useLocalSearchParams();
  const buildingName = searchParams.buildingName as string;
  const [coordinates, setCoordinates] = React.useState<LatLng | undefined>(
    undefined
  );
  const appendDataToStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const router = useRouter();
  const { mutate, status } = useCreateBuilding();

  return (
    <StackScreenLayout title="Add Location">
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
          isLoading={status === "loading"}
          onPress={() => {
            if (!buildingName) return;
            if (!coordinates) return;

            mutate(
              {
                name: buildingName,
                location: {
                  lat: coordinates.latitude,
                  lng: coordinates.longitude,
                },
              },
              {
                onSuccess: ({ building }) => {
                  appendDataToStore({
                    building_id: building.id,
                    building: building,
                  });
                  router.navigate({
                    pathname:
                      "/(rental)/property/create/property-basic-details",
                    params: {},
                  });
                },
                onError: (error) => {
                  const errorMessage =
                    error &&
                    (error?.response?.data?.type === "duplicate_error"
                      ? "A building with this name already exists"
                      : error?.response?.data?.message ??
                        "Something went wrong");

                  Alert.alert("Error", errorMessage);
                },
              }
            );
          }}
        >
          <Text className="text-white font-bold text-xl">Create Building</Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
}
