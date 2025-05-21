import { Button } from "@/ui/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import { useUpdateRentalTenant } from "@/api/hooks/rental-properties/mutations";
import AddTenantDetailsForm from "@/components/(rentals)/booking/forms/AddTenantDetails";
import { useRentalBookingStoreContext } from "@/lib/rental-property/tenant/tenant-store-context";

const RentalTenantFurtherDetails = () => {
  const router = useRouter();
  const {
    mutateAsync: updateRentalTenant,
    status: updatingStatus,
    error,
  } = useUpdateRentalTenant();
  const store = useRentalBookingStoreContext((state) => state.data);
  const updateStoreData = useRentalBookingStoreContext(
    (state) => state.actions.updateData
  );
  const errorMessage = error
    ? error?.response?.data?.message ?? "Something went wrong"
    : null;

  return (
    <WithFormHeaderLayout title="Edit Tenant" className="relative flex-1">
      <AddTenantDetailsForm
        data={{
          total_keys: store?.total_keys,
          total_kids: store?.total_kids,
          total_tenants: store?.total_tenants,
          address: store?.address,
          name: store?.name,
          phone: store?.phone,
        }}
        onNext={() => {
          router.navigate({
            pathname: `/(rental)/tenant/[id]`,
            params: {
              id: store?.id!,
            },
          });
        }}
        mode="edit"
        errorMessage={errorMessage}
        isUpdating={updatingStatus === "loading"}
        onSubmit={(values) => {
          //Id must be defined due _layout
          const id = store?.id!;
          const updatedData = {
            keys_count: values.total_keys ?? undefined,
            tenants_count: values.total_tenants ?? undefined,
            kids_count: values.total_kids ?? undefined,
          };

          updateRentalTenant(
            {
              id: id,
              data: updatedData,
            },
            {
              onSuccess: ({}, { data }) => {
                updateStoreData({
                  ...data,
                  id: id,
                });
                router.replace({
                  pathname: `/(rental)/tenant/[id]`,
                  params: {
                    id: store?.id!,
                  },
                });
              },
            }
          );
        }}
      />
    </WithFormHeaderLayout>
  );
};

export default RentalTenantFurtherDetails;
