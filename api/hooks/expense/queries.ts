import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const EXPENSE_CATEGORIES_QUERY_KEY = `expense-categories` as const;
export const expenseCategoriesKey = queryKeysFactory<
  typeof EXPENSE_CATEGORIES_QUERY_KEY,
  undefined
>(EXPENSE_CATEGORIES_QUERY_KEY);

interface VendorRentalPropertyExpenseCategoryGetRes {
  expenseCategories: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  count: number;
  offset: number;
  limit: number;
}

export const useGetExpenseCategories = () => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: expenseCategoriesKey.list(),
    queryFn: async () => {
      return await client.request<VendorRentalPropertyExpenseCategoryGetRes>(
        "GET",
        `/vendor/rental-property/expense-categories`
      );
    },
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset >= lastPage.count ? undefined : nextOffset;
    },
    getPreviousPageParam: (firstPage) => {
      const previousOffset = firstPage.offset - firstPage.limit;
      return previousOffset < 0 ? undefined : previousOffset;
    },
    enabled: isScreenFocused,
  });
};
export type UseGetExpenseCategoriesData = ReturnType<
  typeof useGetExpenseCategories
>["data"];
