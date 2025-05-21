import { useMutation } from "@tanstack/react-query";
import {
  useCreateCouponAd,
  useUpdateCouponAd,
} from "@/api/hooks/vendor/coupon-ads/mutations";
import { CouponAdSchema } from "../schemas";
import { AxiosError } from "axios";
import useUploadFilesNative from "@/lib/hooks/useUploadFilesNative";

interface Payload extends CouponAdSchema {
  id?: string;
}
const useSaveCoupon = () => {
  const { mutateAsync: createCouponAd } = useCreateCouponAd();
  const { mutateAsync: updateCouponAd } = useUpdateCouponAd();
  const { mutateAsync: uploadFiles } = useUploadFilesNative();
  return useMutation({
    mutationFn: async (payload: Payload) => {
      const { id, ...data } = payload;

      const { parsedForClient, parsedForServer } = await uploadFiles(
        data.images ?? []
      );

      const mapToServerPayload = {
        collection_id_from_defaults: data.collection_id,
        description: data.description,
        discounted_price_amount: data.discount_price,
        images: parsedForServer,
        price_amount: data.price,
        title: data.title,
        coupon_code: data.coupon_code,
        id: id,
      };

      if (id) {
        await updateCouponAd({
          ...mapToServerPayload,
          id: id,
        });
      } else {
        const createdAd = await createCouponAd(mapToServerPayload);
        mapToServerPayload.id = createdAd.couponAd.id;
      }
      return {
        ...mapToServerPayload,
        images: parsedForClient,
      };
    },
    onError: (err: AxiosError) => void 0,
  });
};

export default useSaveCoupon;
