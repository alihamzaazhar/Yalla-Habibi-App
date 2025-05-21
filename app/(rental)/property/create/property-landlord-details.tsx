import { useRouter } from "expo-router";
import React from "react";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import RentalPropertyLandlordDetailsForm from "@/components/(rentals)/property/forms/landlord-details";

const PropertyLandlordDetails = () => {
  const router = useRouter();
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const data = useRentalPropertyStoreContext((state) => state.data);

  return (
    <PlaceAdLayout title="Add Landlord Details" showDismissButton>
      <RentalPropertyLandlordDetailsForm
        data={
          data
            ? {
                landlord_address: data.landlord_address,
                landlord_name: data.landlord_name,
                landlord_phone_number: data.landlord_phone_number,
                landlord_email: data.landlord_email,
              }
            : undefined
        }
        isUpdating={false}
        mode="create"
        onSubmit={(values) => {
          updateStore({
            landlord_address: values.landlord_address,
            landlord_name: values.landlord_name,
            landlord_phone_number: values.landlord_phone_number,
            landlord_email: values.landlord_email,
          });
          router.navigate(`/(rental)/property/create/property-room-details`);
        }}
      />
    </PlaceAdLayout>
  );
};

export default PropertyLandlordDetails;
