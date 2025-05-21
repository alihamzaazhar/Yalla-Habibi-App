import React from "react";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import { useRouter } from "expo-router";
import RentalPropertyBasicDetailsForm from "@/components/(rentals)/property/forms/basic-details";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";

const PropertyBasicDetails = () => {
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );

  const router = useRouter();
  const data = useRentalPropertyStoreContext((state) => state.data);

  return (
    <PlaceAdLayout title="Create New Property">
      <RentalPropertyBasicDetailsForm
        data={
          data
            ? {
                building_id: data.building_id,
                name: data.name,
                floor_number: data.floor_number,
                apartment_number: data.apartment_number,
                building: data.building,
              }
            : undefined
        }
        mode="create"
        onSubmit={(values) => {
          updateStore(values);
          router.navigate(
            "/(rental)/property/create/property-landlord-details"
          );
        }}
      />
    </PlaceAdLayout>
  );
};

export default PropertyBasicDetails;
