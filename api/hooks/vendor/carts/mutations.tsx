import { useYallahApiContext } from "@/api/yallah-api-context";
import { StoreCartsRes } from "@medusajs/medusa";
import { useMutation } from "@tanstack/react-query";
import { PlacementServiceType } from "../../marketplace/services/queries";

interface Payload {
  variant_id: string;
  vendor_ad_id: string;
  placement_service_type: PlacementServiceType;
}

export const useCreateCartForBuyingAd = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await client.request<StoreCartsRes>(
        "POST",
        `/vendor/cart`,
        {
          variant_id: payload.variant_id,
          vendor_product_id: payload.vendor_ad_id,
          placement_service_type: payload.placement_service_type,
        }
      );
    },
  });
};


