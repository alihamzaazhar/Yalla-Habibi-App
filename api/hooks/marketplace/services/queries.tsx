import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { StoreProductsListRes } from "@medusajs/medusa";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

const SERVICES_QUERY_KEY = `services` as const;
export const servicesKey = queryKeysFactory<
  typeof SERVICES_QUERY_KEY,
  undefined
>(SERVICES_QUERY_KEY);
export const PLACEMENT_SERVICES_TYPES = [
  "property_ads",
  "motor_ads",
  "coupon_ads",
] as const;
export type PlacementServiceType = (typeof PLACEMENT_SERVICES_TYPES)[number];
interface MarketplaceServicesGetRes {
  services: Array<ServiceProduct>;
  count: StoreProductsListRes["count"];
  limit: StoreProductsListRes["limit"];
  offset: StoreProductsListRes["offset"];
}

export type ServiceProduct = StoreProductsListRes["products"][0] & {
  options: NonNullable<StoreProductsListRes["products"][0]["options"]>;
  placement_service_type: PlacementServiceType;
};
const useServices = () => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: servicesKey.list(),
    queryFn: async () => {
      return await client.request<MarketplaceServicesGetRes>(
        "GET",
        `/vendor/services`
      );
    },
    select: (data) => {
      //[Todo]: Get this constant values from backend
      const allowedServiceTypes = PLACEMENT_SERVICES_TYPES;
      const servicesMap = new Map<
        (typeof allowedServiceTypes)[number],
        Array<ServiceProduct>
      >();
      for (const service of data.services) {
        if (allowedServiceTypes.includes(service.placement_service_type)) {
          if (!servicesMap.has(service.placement_service_type)) {
            servicesMap.set(service.placement_service_type, []);
          }
          servicesMap.get(service.placement_service_type)?.push(service);
        }
      }
      return servicesMap;
    },
    enabled: isScreenFocused,
  });
};

export default useServices;
