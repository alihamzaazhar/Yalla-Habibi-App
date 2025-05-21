import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useQuery } from "@tanstack/react-query";

const MARKETPLACE_USERS_QUERY_KEY = `marketplace-users` as const;
export const marketplaceUsersKey = queryKeysFactory<
  typeof MARKETPLACE_USERS_QUERY_KEY,
  string
>(MARKETPLACE_USERS_QUERY_KEY);

interface MarketplaceGetUserResponse {
  customerAccount: {
    id: string | null;
    created_at: string | null;
    updated_at: string | null;
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    billing_address_id: string | null;
    phone: string | null;
    has_account: string | null;
    metadata: string | null;
    billing_address: string | null;
  };
  id: string;
}

export const useGetUser = (id: string) => {
  const { client } = useYallahApiContext();

  return useQuery({
    queryKey: marketplaceUsersKey.detail(id),
    queryFn: async () => {
      return await client.request<MarketplaceGetUserResponse>(
        "GET",
        `/marketplace/users/${id}`
      );
    },
  });
};
