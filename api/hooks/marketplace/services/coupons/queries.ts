import { NumericalComparisonParams } from "@/api/types";
import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { DateComparisonOperator } from "@medusajs/medusa";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

export interface MarketplaceCouponsListParams {
  collection_id?: string;
  q?: string;
  price?: NumericalComparisonParams;
  created_at?: DateComparisonOperator
  offset?: number;
  limit?: number;
  order?: string;
}

const MARKETPLACE_COUPONS_QUERY_KEY = `marketplace-coupons` as const;
export const marketplaceCouponsKey = queryKeysFactory<
  typeof MARKETPLACE_COUPONS_QUERY_KEY,
  MarketplaceCouponsListParams
>(MARKETPLACE_COUPONS_QUERY_KEY);

export interface CouponAd {
  id: string;
  title: string;
  description: string;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{
      currency_code: string;
      amount: number;
      id: string;
      discount: {
        value: number;
        code: string;
      };
    }>;
  }>;
  collection: {
    id: string;
    title: string;
  };
  //[Todo]: Make it consistent with motors ad
  thumbnail?: string;
  images: Array<{
    id: string;
    url?: string;
    uri?: string;
  }>;
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    created_at: string;
    email: string;
  };
  is_favourite: boolean;
  created_at: string;
  metadata?:{
    coupon_code?:string
  }
}
interface MarketplaceCouponsListRes {
  couponAds: Array<CouponAd>;
  count: number;
  limit: number;
  offset: number;
}

export const useMarketplaceCoupons = (query?: MarketplaceCouponsListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: marketplaceCouponsKey.list(query),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<MarketplaceCouponsListRes>(
        "GET",
        `marketplace/products/coupon-ads?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};
export type UseQueryCouponAdsResponse = ReturnType<typeof useMarketplaceCoupons>["data"];
type MarketplaceCouponAdGet = { couponAd: CouponAd };
export const useCouponAd = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: marketplaceCouponsKey.detail(id),
    queryFn: async () => {
      return await client.request<MarketplaceCouponAdGet>(
        "GET",
        `/marketplace/products/coupon-ads/${id}`
      );
    },
    enabled: isScreenFocused,
  });
};

export type UseQueryCouponAdResponse = ReturnType<typeof useCouponAd>["data"];

const COUPON_COLLECTIONS_QUERY_KEY = `coupon-collections` as const;
export const couponAdCollectionsKey = queryKeysFactory<
  typeof COUPON_COLLECTIONS_QUERY_KEY,
  undefined
>(COUPON_COLLECTIONS_QUERY_KEY);

interface CouponAdCollectionsGetRes {
  collections: Array<{
    id: string;
    title: string;
    handle: string;
    created_at: string;
  }>;
}

export const useCouponAdCollections = () => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: couponAdCollectionsKey.list(),
    queryFn: async () => {
      return await client.request<CouponAdCollectionsGetRes>(
        "GET",
        `/marketplace/products/coupon-ads/collections/default`
      );
    },
    enabled: isScreenFocused,
  });
};
