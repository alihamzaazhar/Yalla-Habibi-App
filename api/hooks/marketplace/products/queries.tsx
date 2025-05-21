import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { CouponAd } from "../services/coupons/queries";
import { PropertyAdEntity } from "../services/properties/queries";
import { MotorAdEntity } from "../services/motors/queries";
import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import qs from "qs";
import {
  VendorProductsGetRes,
} from "../../vendor/products/queries";
import { VendorProductType } from "@/api/types";

const MARKETPLACE_PRODUCTS_SEARCH_QUERY_KEY =
  `marketplace-products-search` as const;
export const marketplaceProductsSearchKey = queryKeysFactory<
  typeof MARKETPLACE_PRODUCTS_SEARCH_QUERY_KEY,
  MarketplaceListPropertiesParams
>(MARKETPLACE_PRODUCTS_SEARCH_QUERY_KEY);

interface MarketplaceListPropertiesParams {
  q: string;
  lat?: number;
  lng?: number;
}
interface MarketplaceServicesPropertiesListRes {
  coupons: Array<CouponAd>;
  properties: Array<PropertyAdEntity>;
  motors: Array<MotorAdEntity>;
}

export const useSearchProducts = (
  query: MarketplaceListPropertiesParams,
  options = {
    enabled: true,
  }
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: marketplaceProductsSearchKey.list(query),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<MarketplaceServicesPropertiesListRes>(
        "GET",
        `/marketplace/products/search?${queryString}`
      );
    },

    enabled: options?.enabled && isScreenFocused,
  });
};

export interface MarketplaceProductsListParams {
  vendor_id?: string;
  type?: VendorProductType[];
}
interface MarketplaceProductsListRes extends VendorProductsGetRes {}
const MARKETPLACE_PRODUCTS_QUERY_KEY = `marketplace-products` as const;
export const marketplaceProductsKey = queryKeysFactory<
  typeof MARKETPLACE_PRODUCTS_QUERY_KEY,
  MarketplaceProductsListParams 
>(MARKETPLACE_PRODUCTS_QUERY_KEY);

export const useMarketplaceProducts = (
  query?: MarketplaceProductsListParams
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: marketplaceProductsKey.list(query),
    queryFn: async ({queryKey}) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<MarketplaceProductsListRes>(
        "GET",
        `/marketplace/products-all?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};
