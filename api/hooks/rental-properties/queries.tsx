import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { SPACE_TYPES } from "@/constants/enums";
import { DateComparisonOperator } from "@medusajs/medusa";
import { useIsFocused } from "@react-navigation/native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import qs from "qs";

const RENTAL_BUILDINGS_QUERY_KEY = `rental-buildings` as const;
export const rentalBuildingsKey = queryKeysFactory<
  typeof RENTAL_BUILDINGS_QUERY_KEY,
  undefined
>(RENTAL_BUILDINGS_QUERY_KEY);

export interface RentalBuildingsListRes {
  buildings: Array<{
    id: string;
    name: string;
    created_at: string;
  }>;
  count: number;
  limit: number;
  offset: number;
}
export const useRentalBuildings = () => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: rentalBuildingsKey.list(),
    queryFn: async ({ pageParam }) => {
      return await client.request<RentalBuildingsListRes>(
        "GET",
        `/vendor/rental-property/building?offset=${pageParam ?? 0}&limit=20`
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

const RENTAL_PROPERTIES_QUERY_KEY = `rental-properties` as const;
export interface RentalPropertiesListParams {
  status?: "booked" | "available";
  building_id?: string;
  type?: (typeof SPACE_TYPES)[number];
  q?: string;
  order?: string;
  contract_starts_at?: DateComparisonOperator;
  contract_ends_at?: DateComparisonOperator;
}
export const rentalPropertyKey = queryKeysFactory<
  typeof RENTAL_PROPERTIES_QUERY_KEY,
  RentalPropertiesListParams
>(RENTAL_PROPERTIES_QUERY_KEY);
interface RentalProperty {
  variant_id: string;
  type: (typeof SPACE_TYPES)[number];
  title: string;
  building: string;
  floor: string;
  apartment: string;
  product_id: string;
  parent_id: string;
  property_title: string;
  current_booking?: {
    keys_count?: number;
    tenants_count?: number;
    kids_count?: number;
    tenant_id: null | string;
    tenant?: {
      id: string;
      name: string;
      email: string;
      phone: string;
      address: string;
    } | null;
    contract_starts_at: string;
    contract_ends_at: string | null;
    id: string;
  } | null;
  prices?: Array<{
    currency_code: string;
    amount: number;
    id: string;
  }>;
}
interface RentalPropertiesListRes {
  rental_properties: Array<RentalProperty>;
  count: number;
  limit: number;
  offset: number;
}
export const useRentalProperties = (query?: RentalPropertiesListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: rentalPropertyKey.list(query),
    queryFn: async ({ pageParam, queryKey }) => {
      const q = qs.stringify({
        ...queryKey[2].query,
        offset: pageParam,
      });
      return await client.request<RentalPropertiesListRes>(
        "GET",
        `/vendor/rental-property/property?${q}`
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

interface RentalPropertyGetRes {
  rental_property: {
    id: string;
    title: string;
    landlord: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    floor: string;
    apartment: string;
    building_id: string;
    building: {
      id: string;
      name: string;
    };
    spaces: Array<{
      id: string;
      title: string;
      type: string;
      price: number;
      bookings: Array<{
        id: string;
        is_active: boolean;
        tenant: {
          id: string;
          name: string;
          email: string;
          phone: string;
          address: string;
        };
        contract_starts_at: string;
        contract_ends_at: string;
      }>;
      variant_parent_id: string;
    }>;
  };
}
export const useRentalProperty = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: rentalPropertyKey.detail(id),
    queryFn: async () => {
      return await client.request<RentalPropertyGetRes>(
        "GET",
        `/vendor/rental-property/property/${id}`
      );
    },
    enabled: isScreenFocused,
  });
};

export interface RentalTenantListParams {
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
  limit?: number;
  order?: string;
  offset?: number;
}
const RENTAL_TENANT_QUERY_KEY = `rental-tenants` as const;
export const rentalTenantsKey = queryKeysFactory<
  typeof RENTAL_TENANT_QUERY_KEY,
  RentalTenantListParams
>(RENTAL_TENANT_QUERY_KEY);

export interface RentalTenantBooking {
  keys_count?: number;
  tenants_count?: number;
  kids_count?: number;
  tenant_id: string;
  tenant: {
    name: string;
    email: string;
    phone: string;
    address: string;
    customer_id: string;
    id: string;
    created_at: string;
  };
  contract_starts_at: string | null;
  contract_ends_at: string | null;
  current_rent: number | null;
  current_due: number | null;
  deposit: number | null;
  current_due_updated_at: string | null;
  is_active?: boolean;
  variants: [
    {
      variant_parent_id: string;
      id: string;
      created_at: string;
      updated_at: string;
      deleted_at: null;
      title: string;
      metadata: {
        type: string;
      };
    }
  ];
  store_id: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
  totalPayments: number;
  totalExpenses: number;
  property: {
    id: string;
    building: {
      location: {
        type: string;
        coordinates: Array<number>;
      };
      id: string;
      created_at: string;
      name: string;
    };
    floor: string;
    apartment: string;
    title: string;
    landlord: {
      name: string;
      email: string;
      phone: string;
    };
  };
}
export interface RentalTenantsListRes {
  bookings: RentalTenantBooking[];
  count: 1;
  offset: 0;
  limit: 100;
}

export const useRentalTenants = (filters?: RentalTenantListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: rentalTenantsKey.list(filters),
    queryFn: async ({ pageParam, queryKey }) => {
      const q = qs.stringify({
        ...queryKey[2].query,
        offset: pageParam,
      });
      return await client.request<RentalTenantsListRes>(
        "GET",
        `/vendor/rental-property/booking?${q}`
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

export type UseRentalTenantsData = ReturnType<typeof useRentalTenants>["data"];

interface RentalTenantDetailRes {
  booking: RentalTenantBooking;
}
export const useRentalTenant = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: rentalTenantsKey.detail(id),
    queryFn: async () => {
      return await client.request<RentalTenantDetailRes>(
        "GET",
        `/vendor/rental-property/booking/${id}`
      );
    },
    enabled: isScreenFocused,
  });
};

const RENTAL_TENANT_EXPENSES_QUERY_KEY = `rental-tenant-expenses` as const;
interface VendorRentalPropertyExpensesListReq {
  rental_property_booking_id?: string;
  created_at?: DateComparisonOperator;
}
export const rentalPropertyExpenseKey = queryKeysFactory<
  typeof RENTAL_TENANT_EXPENSES_QUERY_KEY,
  VendorRentalPropertyExpensesListReq
>(RENTAL_TENANT_EXPENSES_QUERY_KEY);

interface VendorRentalPropertyExpensesListRes {
  expenses: Array<{
    title: string;
    description: string;
    amount: number;
    rental_property_booking_id: string;
    id: string;
    created_at: string;
  }>;
  count: number;
  offset: number;
  limit: number;
}

export const useRentalTenantExpenses = (
  filters: VendorRentalPropertyExpensesListReq
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: rentalPropertyExpenseKey.list(filters),
    queryFn: async ({ queryKey, pageParam }) => {
      const queryString = qs.stringify({
        ...queryKey[2].query,
        offset: pageParam,
      });
      return await client.request<VendorRentalPropertyExpensesListRes>(
        "GET",
        `/vendor/rental-property/expenses?${queryString}`
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

interface VendorRentalPropertyPaymentListReq {
  rental_property_booking_id?: string;
  created_at?: DateComparisonOperator;
}
const RENTAL_TENANT_PAYMENTS_QUERY_KEY = `rental-tenant-payments` as const;
export const rentalPropertyPaymentKey = queryKeysFactory<
  typeof RENTAL_TENANT_PAYMENTS_QUERY_KEY,
  VendorRentalPropertyPaymentListReq
>(RENTAL_TENANT_PAYMENTS_QUERY_KEY);
interface VendorRentalPropertyPaymentListRes {
  payments: Array<{
    rental_property_booking_id: string;
    id: string;
    created_at: string;
    email: string;
    items: Array<{
      title: string;
      unit_price: number;
      total: number;
    }>;
    total: number;
  }>;
  count: number;
  offset: number;
  limit: number;
}

export const useRentalTenantPayments = (
  filters: VendorRentalPropertyPaymentListReq
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useInfiniteQuery({
    queryKey: rentalPropertyPaymentKey.list(filters),
    queryFn: async ({ queryKey, pageParam }) => {
      const queryString = qs.stringify({
        ...queryKey[2].query,
        offset: pageParam,
      });
      return await client.request<VendorRentalPropertyPaymentListRes>(
        "GET",
        `/vendor/rental-property/payments?${queryString}`
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
