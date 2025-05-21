import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface MarketplaceUserPostReq {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
export interface MarketplaceUserPostRes {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
const useCreateUser = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: MarketplaceUserPostReq) =>
      await client.request<MarketplaceUserPostRes>(
        "POST",
        "/marketplace/users",
        payload
      ),

    onError: (error:AxiosError) => void 0
  });
};

export default useCreateUser;
