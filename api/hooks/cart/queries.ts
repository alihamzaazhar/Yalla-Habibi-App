const CART_QUERY_KEY = `cart` as const;
export const cartKey = queryKeysFactory<typeof CART_QUERY_KEY>(CART_QUERY_KEY);

import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

interface StoreGetCartRes {
  cart: {
    id: string;
    payment: null | object;
    items: Array<{
      id: string;
      title: string;
      variant_id: string;
      quantity: number;
      total:number
    }>;
    payment_sessions: Array<{
      provider_id: string;
      data: {
        client_secret: string;
      };
    }>;
    tax_total: number;
    total: number;
  };
}

export const useGetCart = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: cartKey.detail(id),
    queryFn: async ({ queryKey }) => {
      return await client.request<StoreGetCartRes>(
        "GET",
        `/store/carts/${queryKey[2]}`
      );
    },
    enabled: isScreenFocused,
  });
};
