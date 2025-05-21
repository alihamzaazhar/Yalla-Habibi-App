import {  clientReverseGeocoding } from "@/api/hooks/address/queries";
import {
  DateComparisonParams,
  NumericalComparisonParams,
  PaginatedResponse,
  StringComparisonParams,
} from "@/api/types";
import { queryKeysFactory } from "@/api/utils/queryKeyFactory";
import { useYallahApiContext } from "@/api/yallah-api-context";
import { CITIES } from "@/constants/enums";
import {
  EXTRA_FEATURES_ENUM,
  LISTED_BY_ENUM,
  PROPERTY_SALE_TYPE_ENUM,
} from "@/lib/property-ad/schemas";
import { DateComparisonOperator } from "@medusajs/medusa";
import { useIsFocused } from "@react-navigation/native";
import {  useQuery } from "@tanstack/react-query";
import qs from "qs";

export interface MarketplaceListPropertiesParams {
  q?: string;
  id?: string | Array<string>;
  category_id?: string;
  vendor_id?: string;
  city?:typeof CITIES[number];
  selling_mode?: (typeof PROPERTY_SALE_TYPE_ENUM)[number];
  is_premium?: boolean;
  price?: NumericalComparisonParams;
  area?: NumericalComparisonParams;
  is_ready_to_sell?: boolean;
  bedroom_count?: Array<number>;
  bathroom_count?: Array<number>;
  is_furnished?: boolean;
  listed_by?: Array<string>;
  extra_features?: Array<string>;  
  created_at?: DateComparisonOperator;
  updated_at?: DateComparisonOperator;
  offset?: number;
  limit?: number;
  order?: string;
}

const PROPERTIES_QUERY_KEY = `properties` as const;
export const propertiesKey = queryKeysFactory<
  typeof PROPERTIES_QUERY_KEY,
  MarketplaceListPropertiesParams
>(PROPERTIES_QUERY_KEY);

export type PropertyAdEntity = {
  bathroom_count: number;
  bedroom_count: number;
  created_at: string;
  currency_code: string;
  description: string;
  extra_features?: Array<(typeof EXTRA_FEATURES_ENUM)[number]>;
  id: string;
  is_furnished: boolean;
  listed_by: (typeof LISTED_BY_ENUM)[number] | null;
  phone_number: string;
  price: number;
  product_id: string;
  parent_category?: {
    id: string;
    name: string;
  };
  child_category?: {
    id: string;
    name: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    parent_category: {
      id: string;
      name: string;
    };
  }>;
  thumbnail?: { url: string };
  location: {
    type: string;
    coordinates: Array<number>;
  } | null;
  area: number | null;
  images: Array<{
    id: string;
    url: string;
  }>;
  requested_by: {
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    created_at: string;
  };
  is_premium: boolean;
  is_favourite: boolean;
  selling_mode: (typeof PROPERTY_SALE_TYPE_ENUM)[number];
  status: string;
  title: string;
};
type MarketplaceServicesPropertiesListRes = PaginatedResponse<
  "properties",
  PropertyAdEntity
>;

export const useProperties = (query?: MarketplaceListPropertiesParams) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();

  return useQuery({
    queryKey: propertiesKey.list(query),
    cacheTime:0,
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);

      return await client.request<MarketplaceServicesPropertiesListRes>(
        "GET",
        `/marketplace/services/properties?${queryString}`
      );
    },
    enabled: isScreenFocused,
  });
};
export type UsePropertiesQueryResponse = ReturnType<typeof useProperties>['data'];
type MarketplaceServicesPropertyRes = PropertyAdEntity & { thumbnail?: string };
interface Props {
  id: string;
}

export const useProperty = ({ id }: Props) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: propertiesKey.detail(id),
    queryFn: async () => {
      const data = await client.request<MarketplaceServicesPropertyRes>(
        "GET",
        `/marketplace/services/properties/${id}`
      );
      let address = "";
      try {
        address = await clientReverseGeocoding(
          data.location
            ? {
                longitude: data.location.coordinates[0],
                latitude: data.location.coordinates[1],
              }
            : {
                latitude: 0,
                longitude: 0,
              }
        );
      } catch (e) {}
      return {
        ...data,
        address,
      };
    },
    enabled: isScreenFocused,
  });
};

export type UsePropertyQueryResponse = ReturnType<typeof useProperty>['data'];

export interface MarketplaceListPropertiesCategoriesParams {
  parent_type: "to-rent" | "to-sell";
}

const PROPERTIES_CATEGORIES_QUERY_KEY = `properties-categories` as const;
export const propertiesCategoriesKey = queryKeysFactory<
  typeof PROPERTIES_CATEGORIES_QUERY_KEY,
  MarketplaceListPropertiesCategoriesParams
>(PROPERTIES_CATEGORIES_QUERY_KEY);

export interface MarketplaceListPropertiesCategoriesRes {
  propertyCategories: Array<{
    id: string;
    name: string;
    created_at: string;
    parent_category_id: string;
    category_children?: Array<{
      id: string;
      name: string;
      created_at: string;
      parent_category_id: string;
    }>;
  }>;
}

export const usePropertiesCategories = (
  props?: MarketplaceListPropertiesCategoriesParams,
  options?: {
    onSuccess?: (data: MarketplaceListPropertiesCategoriesRes) => void;
  }
) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: propertiesCategoriesKey.list(props),
    queryFn: async ({ queryKey }) => {
      const queryString = qs.stringify(queryKey[2].query);
      return await client.request<MarketplaceListPropertiesCategoriesRes>(
        "GET",
        `/marketplace/services/properties/categories?${queryString}`
      );
    },
    onSuccess: options?.onSuccess,
    enabled: isScreenFocused,
  });
};

interface MarketplaceListPropertiesCategoryRes {
  propertyCategory: {
    id: string;
    name: string;
    created_at: string;
    parent_category_id: string;
    category_children: Array<{
      id: string;
      name: string;
      created_at: string;
      parent_category_id: string;
    }>;
  };
}
export const usePropertiesCategory = (id: string) => {
  const { client } = useYallahApiContext();
  const isScreenFocused = useIsFocused();
  return useQuery({
    queryKey: propertiesCategoriesKey.detail(id),
    queryFn: async () => {
      return await client.request<MarketplaceListPropertiesCategoryRes>(
        "GET",
        `/marketplace/services/properties/categories/${id}`
      );
    },
    enabled: isScreenFocused,
  });
};
