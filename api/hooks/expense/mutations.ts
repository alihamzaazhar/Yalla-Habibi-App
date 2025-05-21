import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseCategoriesKey } from "./queries";
import { AxiosError } from "axios";

interface VendorRentalPropertyExpenseCategoryPostReq {
  name: string;
}
interface VendorRentalPropertyExpensePostRes {
  expenseCategory: {
    id: string;
    name: string;
  };
}
export const useCreateExpenseCategory = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: VendorRentalPropertyExpenseCategoryPostReq) => {
      return await client.request<VendorRentalPropertyExpensePostRes>(
        "POST",
        `/vendor/rental-property/expense-categories`,
        payload
      );
    },

    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: expenseCategoriesKey.list(),
      });
    },
  });
};

export const useDeleteExpenseCategory = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return client.request(
        "DELETE",
        `/vendor/rental-property/expense-categories/${id}`
      );
    },
    onSuccess: (undefined, id) => {
      queryClient.refetchQueries({
        queryKey: expenseCategoriesKey.list(),
      });
    },
    onError: (error: AxiosError) => void 0,
  });
};
