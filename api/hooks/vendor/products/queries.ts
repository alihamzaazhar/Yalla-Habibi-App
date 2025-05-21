import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { PropertyAdEntity } from "../../marketplace/services/properties/queries";
import { MotorAdEntity } from "../../marketplace/services/motors/queries";
import { VendorProductType } from "@/api/types";

export interface VendorProductsListParams {
  type?: VendorProductType[];
}

const VENDOR_PRODUCTS_QUERY_KEY = `vendor-products` as const;
export const vendorProductsKey = queryKeysFactory<
  typeof VENDOR_PRODUCTS_QUERY_KEY,
  VendorProductsListParams
>(VENDOR_PRODUCTS_QUERY_KEY);

export type CouponProductEntity = {
  id: string;
  type: VendorProductType;
  created_at: string;
  title: string;
  description: string;
  status: string;
  thumbnail: string;
  is_favourite?:boolean
  collection: {
    id: string;
    title: string;
    created_at: string;
  } | null;
  images: [
    {
      id: string;
      created_at: string;
      url: string;
    }
  ];
  collection_id: string;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{
      id: string;
      currency_code: string;
      amount: number;
      discount?: {
        code: string;
        value: number;
      };
    }>;
  }>;
  owner: {
    id: string;
    created_at: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};
export type VendorProductCouponEntity = {
  type: "coupon_ad";
  data_entity_id: string;
  data_entity: CouponProductEntity;
};

export type VendorProductMotorEntity = {
  type: "motor_ad";
  data_entity_id: string;
  data_entity: MotorAdEntity;
};

export type VendorProductPropertyEntity = {
  type: "property_ad";
  data_entity_id: string;
  data_entity: PropertyAdEntity;
};

export interface VendorProductsGetRes {
  products: Array<
    | VendorProductCouponEntity
    | VendorProductMotorEntity
    | VendorProductPropertyEntity
  >;
  count: 11;
  offset: 0;
  limit: 100;
}

export const useVendorProducts = (query?: VendorProductsListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();

  return useQuery({
    queryKey: vendorProductsKey.list(query),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<VendorProductsGetRes>(
        "GET",
        `/vendor/products?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};

const VENDOR_PRODUCTS_ORDERS_QUERY_KEY = `vendor-products-orders` as const;
export const vendorProductsOrdersKey = queryKeysFactory<
  typeof VENDOR_PRODUCTS_ORDERS_QUERY_KEY,
  string
>(VENDOR_PRODUCTS_ORDERS_QUERY_KEY);

interface VendorProductOrdersGetRes {
  orders: Array<{
    id: string;
    status: string;
    customer: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  }>;
}
export const useVendorProductOrders = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: vendorProductsKey.detail(id),
    queryFn: async () => {
      return await client.request<VendorProductOrdersGetRes>(
        "GET",
        `/vendor/products/${id}/orders`
      );
    },
    enabled: isScreenFocused,
  });
};
