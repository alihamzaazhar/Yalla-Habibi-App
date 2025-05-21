import React from "react";
import { LatLng } from "react-native-maps";
import { View } from "react-native";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import { Text } from "react-native";
import SelectLocationMapView from "@/components/shared/SelectLocationMapView";
import { useRouter } from "expo-router";
import { useMotorAdStoreContext } from "@/lib/motors-ad/context/motor-ad-store-context";
import BaseButton from "@/ui/BaseButton";
import { Theme } from "@/constants";
import { Category } from "@/api/types";
import { MOTOR_CATEGORIES_HANDLES } from "@/lib/motors-ad/constants";

export default function AddLocation() {
  const appendDataToStore = useMotorAdStoreContext(
    (store) => store.actions.updateData
  );
  const savedData = useMotorAdStoreContext((store) => store.data);
  const [coordinates, setCoordinates] = React.useState<LatLng | undefined>();
  const router = useRouter();
  const metadata = useMotorAdStoreContext((store) => store.metadata);
  const rootCategory =
    typeof savedData?.categories?.[0] === "string"
      ? (metadata?.categories[savedData?.categories?.[0]] as Category)
      : null;

  if (!rootCategory) return null;

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
          disabled={!coordinates}
          onPress={() => {
            if (!coordinates) return;
            appendDataToStore({
              location: {
                lat: coordinates.latitude,
                lng: coordinates.longitude,
              },
            });
            if (
              rootCategory.handle.includes(
                MOTOR_CATEGORIES_HANDLES[
                  "auto-accessories-parts-motor-ad-categories"
                ]
              ) ||
              rootCategory.handle.includes(
                MOTOR_CATEGORIES_HANDLES["number-plates-motor-ad-categories"]
              )
            ) {
              router.navigate("/(modals)/place-add/motors/add-images");
            } else {
              router.navigate("/(modals)/place-add/motors/add-features");
            }
          }}
        >
          <Text className="text-white font-bold text-xl">Next</Text>
        </BaseButton>
      </View>
    </StackScreenLayout>
  );
}
