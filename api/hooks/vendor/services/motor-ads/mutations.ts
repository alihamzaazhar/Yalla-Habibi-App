import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation } from "@tanstack/react-query";
import { StoreCartsRes } from "@medusajs/medusa";
import { useUploadFile } from "@/api/hooks/uploads/mutations";
import { ResponsePromise } from "@/api/axios-client/typings";

interface Payload {
  title: string;
  description: string;
  price: number;
  trim?: string;
  regional_spec?: string;
  year?: number;
  kilometer?: number;
  phone_number: string;
  has_insurance?: boolean;
  has_warranty?: boolean;
  tour_url_360?: string;
  fuel_type?: string;
  body_type?: string;
  transmission_type?: string;
  steering_side?: string;
  drive_system?: string;
  cylinder_count?: number;
  seats_count?: number;
  doors_count?: number;
  extra_features?: Record<string, unknown>;
  location?: {
    lat: number;
    lng: number;
  };
  horsepower?: number;
  engine_size?: number;
  car_type?: string;
  car_model?: string;
  images?: Array<string>;
}

type MotorAd = {
  id: string;
};
type PostVendorServiceMotorAdRes = ResponsePromise<{ motorAd: MotorAd }>;
export const useCreateMotorAd = () => {
  const { client } = useYallahApiContext();

  return useMutation({
    mutationFn: async (payload: Payload) => {
      return await client.request<PostVendorServiceMotorAdRes>(
        "POST",
        `/vendor/services/motor-ads`,
        payload
      );
    },
  });
};

export const useUpdateMotorAd = () => {
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Payload>;
    }) => {
      return await client.request<PostVendorServiceMotorAdRes>(
        "POST",
        `/vendor/services/motor-ads/${id}`,
        payload
      );
    },
  });
};
