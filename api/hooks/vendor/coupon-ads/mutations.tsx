import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation } from "@tanstack/react-query";
import { ResponsePromise } from "@/api/axios-client/typings";
import { AxiosError } from "axios";

interface Payload {
  title: string;
  description: string;
  price_amount: number;
  collection_id_from_defaults: string;
  discounted_price_amount: number;
  images: Array<string>;
  coupon_code: string;
}

type CouponAd = {
  id: string;
};
type VendorProductsCouponAdsPostRes = ResponsePromise<{ couponAd: CouponAd }>;
export const useCreateCouponAd = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await client.request<VendorProductsCouponAdsPostRes>(
        "POST",
        `/vendor/products/coupon-ads`,
        payload
      );
    },
  });
};

export const useUpdateCouponAd = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: Partial<Payload> & { id: string }) => {
      const { id, ...rest } = payload;

      return await client.request<VendorProductsCouponAdsPostRes>(
        "POST",
        `/vendor/products/coupon-ads/${payload.id}`,
        rest
      );
    },
    onError: (err: AxiosError) => void 0,
  });
};
