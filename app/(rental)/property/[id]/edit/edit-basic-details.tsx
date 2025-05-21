import React from "react";
import { useRentalPropertyStoreContext } from "@/lib/rental-property/property/rental-property-store-context";
import { useRouter } from "expo-router";
import RentalPropertyBasicDetailsForm from "@/components/(rentals)/property/forms/basic-details";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { useUpdateRentalProperty } from "@/api/hooks/rental-properties/mutations";

const PropertyBasicDetails = () => {
  const updateStore = useRentalPropertyStoreContext(
    (state) => state.actions.updateData
  );
  const router = useRouter();
  const data = useRentalPropertyStoreContext((state) => state.data);
  const { mutate: updateRentalProperty, status: updateRentalPropertyStatus } =
    useUpdateRentalProperty();
  return (
    <PlaceAdLayout title="Edit Property Details" showDismissButton>
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
        isUpdating={updateRentalPropertyStatus === "loading"}
        mode="edit"
        onSubmit={(values) => {
          updateRentalProperty(
            {
              id: data?.id!,
              payload: {
                apartment: values.apartment_number,
                floor: values.floor_number,
                title: values.name,
              },
            },
            {
              onSuccess: () => {
                updateStore(values);
                router.navigate({
                  pathname: `/(rental)/property/[id]/edit/edit-landlord-details`,
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
            pathname: `/(rental)/property/[id]/edit/edit-landlord-details`,
            params: {
              id: data?.id!,
            },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default PropertyBasicDetails;
