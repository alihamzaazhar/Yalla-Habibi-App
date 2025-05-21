import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import {
  VendorProductCouponEntity,
  VendorProductMotorEntity,
  VendorProductPropertyEntity,
} from "../vendor/products/queries";
import { VendorProductType } from "@/api/types";

export interface CustomerGetFavouriteReq {
  type?: VendorProductType[];
}

export interface CustomerGetFavouriteRes {
  favourites: Array<
    | VendorProductCouponEntity
    | VendorProductMotorEntity
    | VendorProductPropertyEntity
  >;
  count: number;
  offset: number;
  limit: number;
}
const FAVOURITE_QUERY_KEY = `favourite` as const;
export const favouriteKey = queryKeysFactory<
  typeof FAVOURITE_QUERY_KEY,
  CustomerGetFavouriteReq
>(FAVOURITE_QUERY_KEY);

export const useGetFavourites = (props?: CustomerGetFavouriteReq) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: favouriteKey.list(props),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<CustomerGetFavouriteRes>(
        "GET",
        `/customer/favourites?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};
