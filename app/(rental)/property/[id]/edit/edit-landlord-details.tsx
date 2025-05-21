import React from "react";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import { useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import RentalPropertyLandlordDetailsForm from "@/components/(rentals)/property/forms/landlord-details";
import { useUpdateRentalProperty } from "@/api/hooks/rental-properties/mutations";

const PropertyLandlordDetails = () => {
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const data = useRentalPropertyStoreContext((state) => state.data);
  const router = useRouter();
  const { mutate: updateRentalProperty, status: updateRentalPropertyStatus } =
    useUpdateRentalProperty();
  return (
    <PlaceAdLayout title="Edit Property Details" showDismissButton>
      <RentalPropertyLandlordDetailsForm
        data={{
          landlord_address: data?.landlord_address,
          landlord_name: data?.landlord_name,
          landlord_phone_number: data?.landlord_phone_number,
          landlord_email: data?.landlord_email,
        }}
        isUpdating={updateRentalPropertyStatus === "loading"}
        mode="edit"
        onSubmit={(values) => {
          updateRentalProperty(
            {
              id: data?.id!,
              payload: {
                landlord: {
                  name: values.landlord_name,
                  email: values.landlord_email,
                  phone: values.landlord_phone_number,
                  address: values.landlord_address,
                },
              },
            },
            {
              onSuccess: () => {
                updateStore({
                  landlord_address: values.landlord_address,
                  landlord_name: values.landlord_name,
                  landlord_phone_number: values.landlord_phone_number,
                  landlord_email: values.landlord_email,
                });
                router.navigate({
                  pathname: `/(rental)/property/[id]/edit/edit-room-details`,
                  params: {
                    id: data?.id!,
                  },
                });
              },
            }
          );
        }}
        onNext={() => {
          router.navigate({
            pathname: `/(rental)/property/[id]/edit/edit-room-details`,
            params: {
              id: data?.id!,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default PropertyLandlordDetails;
