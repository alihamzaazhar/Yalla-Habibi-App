import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import ExpenseBasicDetailForm from "@/components/(rentals)/expense/forms/basic-details";
import { useUpdateRentalTenant } from "@/api/hooks/rental-properties/mutations";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

const ExpenseBasicDetails = () => {
  const router = useRouter();
  const data = useLocalSearchParams();
  const title = data.title as string;
  const { mutateAsync: updateTenantAsync, status: updateTenantStatus } =
    useUpdateRentalTenant();
  const { mutateAsync: uploadFilesAsync } = useUploadFilesNative();
  const tenantId = data.id as string;

  const category_id = data.category_id as string;
  const category_name = data.category_name as string;

  return (
    <PlaceAdLayout title="Create New Expense">
      <ExpenseBasicDetailForm
        data={
          data
            ? {
                category_id: category_id,
                category_name: category_name,
              }
            : undefined
        }
        mode="create"
        isUpdating={updateTenantStatus === "loading"}
        onSubmit={async (values) => {
          const { parsedForServer } = await uploadFilesAsync(
            values.attachments ?? []
          );
          await updateTenantAsync({
            id: tenantId,
            data: {
              expenses: [
                {
                  amount: values.amount,
                  categories_ids: [category_id],
                  title: values.title,
                  attachments: parsedForServer,
                },
              ],
            },
          });
          router.navigate({
            pathname: "/(rental)/tenant/[id]/overview",
            params: { id: tenantId, title: title },
          });
        }}
      />
    </PlaceAdLayout>
  );
};

export default ExpenseBasicDetails;
