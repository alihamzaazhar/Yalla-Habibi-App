import jwtTokenManager from "@/api/axios-client/jwt-token-manager";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { vendorMeKey } from "../../vendor/me/queries";

interface MarketplaceAuthTokenPostReq {
  email: string;
  password: string;
}
interface MarketplaceAuthTokenPostRes {
  access_token: string;
}
export const useLogin = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MarketplaceAuthTokenPostReq) => {
      const response = await client.request<MarketplaceAuthTokenPostRes>(
        "POST",
        "/marketplace/auth/token",
        payload
      );
      await jwtTokenManager.registerJwtAsync(response.access_token);
      return response;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: vendorMeKey.all,
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await jwtTokenManager.registerJwtAsync(null);
      return {
        access_token: null,
      };
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries();
    },
  });
};
