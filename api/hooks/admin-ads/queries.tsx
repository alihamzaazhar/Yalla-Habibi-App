import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

const ADS_QUERY_KEY = `ads` as const;
export enum ADS_MODULES {
  MOTOR_ADS = "motor_ads",
  PROPERTY_ADS = "property_ads",
  COUPON_ADS = "coupon_ads",
}
interface AdminAdsListParams {
  module?: ADS_MODULES;
}
export const adsKey = queryKeysFactory<
  typeof ADS_QUERY_KEY,
  AdminAdsListParams
>(ADS_QUERY_KEY);
interface AdminAd {
  title?: string;
  body?: string;
  url?: string;
  module?: string;
  metadata?: {
    type?: "fullscreen" | "card";
    insertedAfter?: number;
  };
  images?: Array<{
    url: string;
  }>;
  id: string;
  created_at: string;
}
export interface AdminAdsListRes {
  adminAds: Array<AdminAd>;
  count: number;
  limit: number;
  offset: number;
}

const useAdminAds = (props?: AdminAdsListParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: adsKey.list(props),
    queryFn: async ({ queryKey }) => {
      const queryParams = queryKey[1] as AdminAdsListParams;
      return await client.request<AdminAdsListRes>(
        "GET",
        `/ads?${qs.stringify(queryParams)}`
      );
    },
    enabled: isScreenFocused,
  });
};

export default useAdminAds;
