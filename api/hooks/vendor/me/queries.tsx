import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { RentalTenantsListRes } from "../../rental-properties/queries";
import { DateComparisonOperator } from "@medusajs/medusa";
import qs from "qs";
import JwtTokenManager from "../../../axios-client/jwt-token-manager";

const VENDOR_ME_QUERY_KEY = `vendor-me` as const;
export const vendorMeKey =
  queryKeysFactory<typeof VENDOR_ME_QUERY_KEY>(VENDOR_ME_QUERY_KEY);

export interface VendorGetCurrentUserRes {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    profile_image?: string;
    address: string | null;
    is_email_verified?: boolean | null;
    stripeAccount: {
      enabled: boolean;
      account_id?: string | null;
      onboardingUrl?: string | null;
    };
  };
}
export const useVendorMe = () => {
  const { client } = useYallahApiContext();
  return useQuery({
    queryKey: vendorMeKey.details(),
    queryFn: async () => {
      try {
        return await client.request<VendorGetCurrentUserRes>(
          "GET",
          `/vendor/users/me`
        );
      } catch (e) {
        await JwtTokenManager.registerJwtAsync(null);
        if ((e as AxiosError).response?.status === 401) {
          return null;
        }
        throw e;
      }
    },
    cacheTime: Infinity,
    staleTime: Infinity,
  });
};

export interface VendorBookingListParams {
  id?: string | string[];
  q?: string;
  is_active?: boolean;
  contract_starts_at?: DateComparisonOperator;
  contract_ends_at?: DateComparisonOperator;
  created_at?: DateComparisonOperator;
  updated_at?: DateComparisonOperator;
  deleted_at?: DateComparisonOperator;
  limit?: number;
  order?: string;
  offset?: number;
}
const VENDOR_ME_BOOKINGS_QUERY_KEY = `vendor-me-bookings` as const;
export const vendorMeBookingsKey = queryKeysFactory<
  typeof VENDOR_ME_BOOKINGS_QUERY_KEY,
  VendorBookingListParams
>(VENDOR_ME_BOOKINGS_QUERY_KEY);

type VendorPropertyBooking = RentalTenantsListRes["bookings"][0];
export interface VendorBookingListRes {
  bookings: VendorPropertyBooking[];
  count: number;
  limit: number;
  offset: number;
}
export const useGetMyBookings = (props?: VendorBookingListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: vendorMeBookingsKey.list(props),
    queryFn: async ({ queryKey }) => {
      const q = queryKey[2].query;
      return await client.request<VendorBookingListRes>(
        "GET",
        `/vendor/users/me/bookings?${qs.stringify(q)}`
      );
    },
    enabled: isScreenFocused,
  });
};
