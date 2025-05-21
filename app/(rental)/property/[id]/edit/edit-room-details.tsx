import { Button } from "@/ui/Button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { globalStyles } from "@/constants";
import { useUpdateRentalProperty } from "@/api/hooks/rental-properties/mutations";
import SpaceTypesForm from "@/components/(rentals)/property/forms/space-types-form";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import useSpacesFromStore from "@/lib/rental-property/useSpacesFromStore";

const EditRentalPropertySpaces = () => {
  const router = useRouter();
  const store = useRentalPropertyStoreContext((state) => state.data);
  const { mutate: updateRentalProperty, status: uploadingStatus } =
    useUpdateRentalProperty();
  const { beds, partitions, rooms, setBeds, isDirty, setPartitions, setRooms } =
    useSpacesFromStore();
  const onSubmit = () => {
    const variantsWithChildren = rooms.map((room) => {
      const room_partitions = partitions
        .filter((p) => p.parent === room.id)
        .map((partition) => {
          const partitions_bed = beds
            .filter((bed) => bed.parent === partition.id)
            .map((bed) => ({
              id: bed.id.startsWith("new_") ? undefined : bed.id,
              title: bed.name,
              type: "bed",
              price: bed.rent_per_month,
              children: [],
              is_deleted: bed.is_deleted,
            }));
          return {
            id: partition.id.startsWith("new_") ? undefined : partition.id,
            is_deleted: partition.is_deleted,
            title: partition.name,
            type: "partition",
            price: partition.rent_per_month,
            children: partitions_bed,
          };
        });

      return {
        id: room.id.startsWith("new_") ? undefined : room.id,
        title: room.name,
        type: "room",
        price: room.rent_per_month,
        children: room_partitions,
        is_deleted: room.is_deleted,
      };
    });

    if (!store) return;
    if (!store.id) return;
    updateRentalProperty(
      {
        id: store.id,
        payload: {
          variants: variantsWithChildren,
          apartment: store?.apartment_number ?? "",
          floor: store?.floor_number ?? "",
          landlord: {
            name: store?.landlord_name ?? "",
            email: store?.landlord_email ?? "",
            phone: store?.landlord_phone_number ?? "",
          },
        },
      },
      {
        onSuccess: () => {
          router.navigate("/(rental)/property");
        },
      }
    );
  };

  return (
    <PlaceAdLayout
      title="Edit Rooms"
      className="relative flex-1"
      showDismissButton
    >
      <View className="items-center justify-center border border-gray-200 p-1">
        <Text className="text-gray-500 text-sm">
          {"Only available spaces are shown"}
        </Text>
      </View>
      <SpaceTypesForm
        rooms={rooms}
        partitions={partitions}
        beds={beds}
        setRooms={setRooms}
        setBeds={setBeds}
        setPartitions={setPartitions}
      />
      <View
        className="absolute bottom-0 w-full bg-white items-center justify-center px-6"
        style={[globalStyles.shadowMd, { height: 80 }]}
      >
        <Button
          className="w-full"
          onPress={onSubmit}
          isLoading={uploadingStatus === "loading"}
        >
          <Text className="text-white font-bold text-xl">
            {isDirty ? "Update" : "Next"}
          </Text>
        </Button>
      </View>
    </PlaceAdLayout>
  );
};

export default EditRentalPropertySpaces;
