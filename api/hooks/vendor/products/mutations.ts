import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PropertyAdEntity,
  propertiesKey,
} from "../../marketplace/services/properties/queries";

type CreatePropertyAd = {
  title: string;
  selling_mode: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  category_id: string;
  ready_at: Date;
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
type VendorPostPropertyAdReq = {
  id: string;
  data: Partial<CreatePropertyAd>;
};
type VendorPostPropertyAdRes = {
  propertyAd: PropertyAdEntity;
};
export const useUpdatePropertyAd = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: payload }: VendorPostPropertyAdReq) => {
      return await client.request<VendorPostPropertyAdRes>(
        "POST",
        `/vendor/products/property-ads/${id}`,
        payload
      );
    },
    onSuccess: (data) => {
      return queryClient.invalidateQueries({
        queryKey: propertiesKey.detail(data.propertyAd.id),
      });
    },
  });
};
