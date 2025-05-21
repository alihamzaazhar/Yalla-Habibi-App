import { Response } from "@/api/axios-client/typings";
import { clientReverseGeocoding } from "@/api/hooks/address/queries";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import {
  Category,
  NumericalComparisonParams,
  PaginatedResponse,
} from "@/api/types";
import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { CITIES } from "@/constants/enums";
import {
  BIKE_FINAL_DRIVE_SYSTEM,
  BIKE_WHEELS,
  MOTOR_BODY_TYPE,
  MOTOR_DRIVE_SYSTEM,
  MOTOR_FUEL_TYPE,
  MOTOR_STEERING_SIDE,
  MOTOR_TRANSMISSION_TYPE,
} from "@/lib/motors-ad/constants";
import { DateComparisonOperator } from "@medusajs/medusa";
import { useIsFocused } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";

export interface MarketplaceListMotorAdsParams {
  id?: string | Array<string>;
  q?: string;
  price?: NumericalComparisonParams;
  vendor_id?: string;
  city?: (typeof CITIES)[number];
  is_premium?: boolean;
  fuel_type?: (typeof MOTOR_FUEL_TYPE)[number];
  body_type?: (typeof MOTOR_BODY_TYPE)[number];
  categories?: Array<string>;
  transmission_type?: (typeof MOTOR_TRANSMISSION_TYPE)[number];
  engine_size?: NumericalComparisonParams;
  year?: NumericalComparisonParams;
  kilometer?: NumericalComparisonParams;
  steering_side?: (typeof MOTOR_STEERING_SIDE)[number];
  drive_system?: (typeof MOTOR_DRIVE_SYSTEM)[number];
  seats_count?: Array<number>;
  doors_count?: Array<number>;
  cylinder_count?: Array<number>;
  horsepower?: Array<number>;
  created_at?: DateComparisonOperator;
  has_insurance?: boolean;
  has_warranty?: boolean;
  wheels?: (typeof BIKE_WHEELS)[number];
  final_drive_system?: (typeof BIKE_FINAL_DRIVE_SYSTEM)[number];
  offset?: number;
  limit?: number;
  order?: string;
}

const MOTORS_QUERY_KEY = `motors` as const;
export const motorsKey = queryKeysFactory<
  typeof MOTORS_QUERY_KEY,
  MarketplaceListMotorAdsParams
>(MOTORS_QUERY_KEY);

export type MotorAdEntity = {
  id: string;
  title: string;
  description: string;
  phone_number: string;
  price: number;
  fuel_type?: (typeof MOTOR_FUEL_TYPE)[number];
  body_type?: (typeof MOTOR_BODY_TYPE)[number];
  trim?: string;
  regional_spec?: string;
  year?: number;
  kilometer?: number;
  transmission_type?: (typeof MOTOR_TRANSMISSION_TYPE)[number];
  steering_side?: (typeof MOTOR_STEERING_SIDE)[number];
  drive_system?: (typeof MOTOR_DRIVE_SYSTEM)[number];
  cylinder_count?: number;
  seats_count?: number;
  doors_count?: number;
  horsepower?: number;
  engine_size?: number;
  extra_features?: object;
  location: {
    type: string;
    coordinates: Array<number>;
  } | null;
  images: Array<{ url: string }>;
  thumbnail?: string;
  car_type: string;
  car_model: string;
  created_at: string;
  is_premium?: boolean;
  is_favourite: boolean;
  exterior_color: string;
  interior_color: string;
  has_insurance?: boolean;
  has_warranty?: boolean;
  usage?: string;
  final_drive_system?: string;
  wheels?: string;
  condition?: string;
  body_condition?: string;
  mechanical_condition?: string;
  weight?: string;
  age?: string;
  plate_number?: string;
  length?: string;
  badges?: Array<string>;
  categories: Array<Category>;
  requested_by: {
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    created_at: string;
  };
};
type MarketplaceMotorsListRes = PaginatedResponse<"motorAds", MotorAdEntity>;

export const useMotorAds = (query?: MarketplaceListMotorAdsParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: motorsKey.list(query),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<MarketplaceMotorsListRes>(
        "GET",
        `/marketplace/services/motor-ads?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};

export type UseMotorsQueryResponse = ReturnType<typeof useMotorAds>["data"];

type MarketplacePropertyRes = { motorAd: MotorAdEntity };
interface Props {
  id: string;
}
export const useMotorAd = ({ id }: Props) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: motorsKey.detail(id),
    queryFn: async () => {
      const data = await client.request<Response<MarketplacePropertyRes>>(
        "GET",
        `/marketplace/services/motor-ads/${id}`
      );
      let address = "";
      try {
        address = await clientReverseGeocoding(
          data.motorAd.location
            ? {
                longitude: data.motorAd.location.coordinates[0],
                latitude: data.motorAd.location.coordinates[1],
              }
            : {
                latitude: 0,
                longitude: 0,
              }
        );
      } catch (e) {}

      return {
        ...data,
        motorAd: {
          ...data.motorAd,
          address,
        },
      };
    },
    enabled: isScreenFocused,
  });
};
export type UseMotorQueryResponse = ReturnType<typeof useMotorAd>["data"];
interface MarketplaceListMotorsCategoriesParams {
  parent_category_id?: string;
  root_only?: boolean;
  q?: string;
}
const MOTORS_CATEGORIES_QUERY_KEY = `motors-categories` as const;
export const motorsCategoriesKey = queryKeysFactory<
  typeof MOTORS_CATEGORIES_QUERY_KEY,
  MarketplaceListMotorsCategoriesParams
>(MOTORS_CATEGORIES_QUERY_KEY);

interface MarketplaceListMotorsCategoriesRes {
  motorAdsCategories: Array<{
    id: string;
    name: string;
    created_at: string;
    handle: string;
    parent_category_id: string;
    category_children: Array<{
      id: string;
      name: string;
      handle: string;
      created_at: string;
      parent_category_id: string;
      category_children: Array<{
        id: string;
        name: string;
        handle: string;
        created_at: string;
        parent_category_id: string;
      }>;
    }>;
  }>;
}
export const useMotorsCategories = (
  query?: MarketplaceListMotorsCategoriesParams,
  options = {
    enabled: true as boolean | undefined,
  }
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  useVendorMe();
  return useQuery({
    queryKey: motorsCategoriesKey.list(query),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<Response<MarketplaceListMotorsCategoriesRes>>(
        "GET",
        `/marketplace/services/motor-ads/categories?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};
