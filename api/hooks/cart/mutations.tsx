import { useYallahApiContext } from "@/api/yallah-api-context";
import {
  StoreCartsRes,
  StorePostCartReq,
  StorePostCartsCartLineItemsReq,
  StorePostCartsCartReq,
} from "@medusajs/medusa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUploadFile } from "../uploads/mutations";
import { cartKey } from "./queries";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

interface MarketplacePostCartServicePayload {
  variant_id: string;
  property_ad: {
    title: string;
    selling_mode: string;
    description: string;
    location: {
      lat: number;
      lng: number;
    };
    category_id: string;
    ready_at?: Date;
    area: number;
    price: number;
    bedroom_count: number;
    bathroom_count: number;
    is_furnished: boolean;
    listed_by: string;
    extra_features: string[];
    images: Array<string>;
    phone_number: string;
  };
}
export const useCreateServiceCart = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: MarketplacePostCartServicePayload) => {
      return await client.request<StoreCartsRes>(
        "POST",
        "/marketplace/services/properties/cart",
        {
          ...payload,
          property_ad: payload.property_ad,
        }
      );
    },
  });
};

export const useCreatePaymentSession = () => {
  const { client } = useYallahApiContext();
  return useMutation((cartId: string) =>
    client.request<StoreCartsRes>(
      "POST",
      `/store/carts/${cartId}/payment-sessions`
    )
  );
};

export const useSelectPaymentSession = () => {
  const { client } = useYallahApiContext();
  return useMutation((payload: { cartId: string; paymentSessionId: string }) =>
    client.request<StoreCartsRes>(
      "POST",
      `/store/carts/${payload.cartId}/payment-session`,
      {
        provider_id: payload.paymentSessionId,
      }
    )
  );
};

export const useCompleteCart = () => {
  const { client } = useYallahApiContext();
  return useMutation((cartId: string) =>
    client.request<StoreCartsRes>("POST", `/store/carts/${cartId}/complete`)
  );
};

export const useUpdateCart = () => {
  const { client } = useYallahApiContext();
  return useMutation(
    ({ id, ...payload }: StorePostCartsCartLineItemsReq & { id: string }) =>
      client.request<StoreCartsRes>(
        "POST",
        `/store/carts/${id}/line-items`,
        payload
      )
  );
};
export const useUpdateCartDetails = () => {
  const { client } = useYallahApiContext();
  return useMutation(
    ({ id, ...payload }: StorePostCartsCartReq & { id: string }) =>
      client.request<StoreCartsRes>("POST", `/store/carts/${id}`, payload)
  );
};

interface MarketplacePostCartReq {
  variant_id: string;
  email: string;
}
export const useDigitalCart = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: MarketplacePostCartReq) =>
      client.request<StoreCartsRes>("POST", `/marketplace/carts`, payload),
    onSuccess: (data) => {
      return queryClient.setQueryData(cartKey.detail(data.cart.id), data);
    },
  });
};
