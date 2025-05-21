import { Button } from "@/ui/Button";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Theme, globalStyles } from "@/constants";
import { useCreateRentalProperty } from "@/api/hooks/rental-properties/mutations";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import SpaceTypesForm from "@/components/(rentals)/property/forms/space-types-form";
import useSpacesFromStore from "@/lib/rental-property/useSpacesFromStore";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import ServerErrorMessage from "@/ui/atoms/ServerErrorMessage";
import BaseButton from "@/ui/BaseButton";

const PropertyRoomDetails = () => {
  const router = useRouter();
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const store = useRentalPropertyStoreContext((state) => state.data);
  const { mutate: createRentalProperty, error,status: uploadingStatus } =
    useCreateRentalProperty();
  const { beds, partitions, rooms, setBeds, setPartitions, setRooms } =
    useSpacesFromStore();
  const errorMessage = error
    ? error?.response?.data?.message ?? "Something went wrong"
    : null;
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

    updateStore({
      ...store,
      variants: variantsWithChildren,
    });

    if (!store) return;
    if (!store.building_id) return;
    createRentalProperty(
      {
        title: store?.name ?? "",
        variants: variantsWithChildren,
        apartment: store?.apartment_number ?? "",
        floor: store?.floor_number ?? "",
        building_id: store?.building_id,
        landlord: {
          name: store?.landlord_name ?? "",
          email: store?.landlord_email ?? "",
          phone: store?.landlord_phone_number ?? "",
          address: store?.landlord_address ?? "",
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
      title="Add Rooms"
      className="relative flex-1"
    >
      <ServerErrorMessage errorMessage={errorMessage} />
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
        <BaseButton
          ButtonProps={{
            style:{
              width:'100%',
              backgroundColor: Theme.primary.DEFAULT,
            }
          }}
          className="w-full"
          variant={'default'}
          onPress={onSubmit}
          isLoading={uploadingStatus === "loading"}
        >
          <Text className="text-white font-bold text-xl">Next</Text>
        </BaseButton>
      </View>
    </PlaceAdLayout>
  );
};

export default PropertyRoomDetails;
