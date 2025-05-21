import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UseQueryCouponAdResponse,
  UseQueryCouponAdsResponse,
  marketplaceCouponsKey,
} from "../marketplace/services/coupons/queries";
import {
  UsePropertiesQueryResponse,
  UsePropertyQueryResponse,
  propertiesKey,
} from "../marketplace/services/properties/queries";
import {
  UseMotorQueryResponse,
  UseMotorsQueryResponse,
  motorsKey,
} from "../marketplace/services/motors/queries";
import { favouriteKey } from "./queries";

interface CustomerPostFavouriteReq {
  entity_type: string;
  entity_id: string;
}
export const useToggleFavourite = () => {
  const queryClient = useQueryClient();
  const { client } = useYallahApiContext();
  return useMutation({
    mutationFn: async (payload: CustomerPostFavouriteReq) => {
      return await client.request("POST", `/customer/favourites`, payload);
    },
    onSuccess: async (response, { entity_type, entity_id }) => {
      if (entity_type === "property_ad") {
        queryClient.setQueryData<UsePropertyQueryResponse>(
          propertiesKey.detail(entity_id),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              is_favourite: !prev.is_favourite,
            };
          }
        );
        queryClient.setQueriesData<UsePropertiesQueryResponse>(
          propertiesKey.lists(),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              properties: prev.properties.map((p) => {
                if (p.id === entity_id) {
                  return {
                    ...p,
                    is_favourite: !p.is_favourite,
                  };
                }
                return p;
              }),
            };
          }
        );
        
      } else if (entity_type === "motor_ad") {
        queryClient.setQueryData<UseMotorQueryResponse>(
          motorsKey.detail(entity_id),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              motorAd: {
                ...prev.motorAd,
                is_favourite: !prev.motorAd.is_favourite,
              },
            };
          }
        );
        queryClient.setQueriesData<UseMotorsQueryResponse>(
          motorsKey.lists(),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              motorAds: prev.motorAds.map((p) => {
                if (p.id === entity_id) {
                  return {
                    ...p,
                    is_favourite: !p.is_favourite,
                  };
                }
                return p;
              }),
            };
          }
        );
      } else if (entity_type === "coupon_ad") {
        queryClient.setQueryData<UseQueryCouponAdResponse>(
          marketplaceCouponsKey.detail(entity_id),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              couponAd: {
                ...prev.couponAd,
                is_favourite: !prev.couponAd.is_favourite,
              },
            };
          }
        );
        queryClient.setQueriesData<UseQueryCouponAdsResponse>(
          marketplaceCouponsKey.lists(),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              couponAds: prev.couponAds.map((p) => {
                if (p.id === entity_id) {
                  return {
                    ...p,
                    is_favourite: !p.is_favourite,
                  };
                }
                return p;
              }),
            };
          }
        );
      }
    },
  });
};
