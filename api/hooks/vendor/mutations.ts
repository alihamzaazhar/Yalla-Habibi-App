import { useYallahApiContext } from "@/api/yallah-api-context";
import { StoreCartsRes } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";

interface Payload {
  variant_id: string;
  vendor_ad_id: string;
  extra_variant_id?: string;
}

export const useCreateCartForBuyingAd = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await client.request<StoreCartsRes>(
        "POST",
        `/vendor/cart/motor_ads/${payload.vendor_ad_id}`,
        {
          variant_id: payload.variant_id,
          extra_variant_id: payload.extra_variant_id,
        }
      );
    },
  });
};
interface CreateCartDigitalPayload {
  items?: Array<{
    variant_id: string;
    quantity: number;
    metadata: Record<string, unknown>;
  }>;
}
export const useCreateCartForDigitalProduct = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload:CreateCartDigitalPayload) => {
      return await client.request<StoreCartsRes>(
        "POST",
        `/marketplace/digital-cart`,
        payload
      );
    },
  });
};
