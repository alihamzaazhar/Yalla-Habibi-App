import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { DateComparisonOperator } from "@medusajs/medusa";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

const rentalPropertyBookingsAnalytics =
  `rental-property-bookings-analytics` as const;

export interface VendorRentalPropertyBookingsAnalyticsGetReq {
  id?: string | string[];
  q?: string;
  tenant_email?: string;
  tenant_phone?: string;
  tenant_name?: string;
  is_active?: boolean;
  building_id?: string;
  contract_starts_at?: DateComparisonOperator;
  contract_ends_at?: DateComparisonOperator;
  created_at?: DateComparisonOperator;
  updated_at?: DateComparisonOperator;
  deleted_at?: DateComparisonOperator;
}
export const rentalPropertyBookingsAnalyticsKey = queryKeysFactory<
  typeof rentalPropertyBookingsAnalytics,
  VendorRentalPropertyBookingsAnalyticsGetReq
>(rentalPropertyBookingsAnalytics);

interface VendorRentalPropertyBookingsAnalyticsGetRes {
  analytics: {
    paymentsTotal: number;
    currentDueTotal:number;
    expensesTotal: number;
    depositsTotal: number;
    savings: number;
  };
}

export const useRentalPropertyBookingsAnalytics = (
  props: VendorRentalPropertyBookingsAnalyticsGetReq
) => {
  const { client } = useYallahApiContext();
  return useQuery({
    queryKey: rentalPropertyBookingsAnalyticsKey.list(props),
    queryFn: async ({ queryKey }) => {
      return await client.request<VendorRentalPropertyBookingsAnalyticsGetRes>(
        "GET",
        `/vendor/rental-property/booking/analytics?${qs.stringify(
          queryKey[2].query
        )}`
      );
    },
    enabled: true,
  });
};
