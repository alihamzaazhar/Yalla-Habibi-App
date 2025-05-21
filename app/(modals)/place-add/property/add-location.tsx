import React from "react";
import { LatLng } from "react-native-maps";
import { View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Text } from "react-native";
import { Button } from "@/ui/Button";
import SelectLocationMapView from "@/components/shared/SelectLocationMapView";
import { useRouter } from "expo-router";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import BaseButton from "@/ui/BaseButton";
import { Theme } from "@/constants";

export default function AddLocation() {
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );
  const [coordinates, setCoordinates] = React.useState<LatLng | undefined>();
  const router = useRouter();

  return (
    <StackScreenLayout title="Add Location">
      <SelectLocationMapView
        coordinates={coordinates}
        selectCoordinates={setCoordinates}
      />
      <View className="absolute bottom-0 p-6 w-full">
        <BaseButton
          ButtonProps={{
            style:{
              width:'100%',
              backgroundColor: Theme.primary.DEFAULT,
            }
          }}
          className="w-full"
          variant={'default'}
          disabled={!coordinates}
          onPress={() => {
            if (!coordinates) return;
            appendDataToStore({
              location: {
                lat: coordinates.latitude,
                lng: coordinates.longitude,
              },
            });
            router.navigate("/(modals)/place-add/property/add-features");
          }}
        >
          <Text className="text-white font-bold text-xl">Next</Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
}
