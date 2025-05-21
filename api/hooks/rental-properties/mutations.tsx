import { useYallahApiContext } from "@/api/yallah-api-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rentalBuildingsKey,
  rentalPropertyKey,
  rentalPropertyPaymentKey,
  rentalTenantsKey,
  useRentalBuildings,
} from "./queries";
import { AxiosError } from "axios";

interface CreateBuildingReq {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}
interface CreateBuildingRes {
  building: {
    id: string;
    name: string;
  };
}
export const useCreateBuilding = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBuildingReq) => {
      return client.request<CreateBuildingRes>(
        "POST",
        "/vendor/rental-property/building",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: [rentalBuildingsKey.list()],
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface CreateRentalPropertyReq {
  title: string;
  floor: string;
  apartment: string;
  building_id: string;
  landlord: {
    name: string;
    email: string;
    phone: string;
    address:string
  };
  variants: Array<{
    id?: string;
    title?: string;
    type?: string;
    price?: number;
    is_deleted?: boolean;
    children?: UpdateRentalPropertyReq["variants"];
  }>;
}
interface CreateRentalPropertyRes {}
export const useCreateRentalProperty = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalPropertyReq) => {
      return client.request<CreateRentalPropertyRes>(
        "POST",
        "/vendor/rental-property/property",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: [rentalPropertyKey.list()],
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface UpdateRentalPropertyReq {
  title?: string;
  floor?: string;
  apartment?: string;
  building_id?: string;
  landlord?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  variants?: Array<{
    id?: string;
    title?: string;
    type?: string;
    price?: number;
    is_deleted?: boolean;
    children?: UpdateRentalPropertyReq["variants"];
  }>;
}
export const useUpdateRentalProperty = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateRentalPropertyReq;
    }) => {
      return await client.request<undefined>(
        "POST",
        `/vendor/rental-property/property/${id}`,
        payload
      );
    },
    onSuccess: (_, { id }) => {
      return queryClient.refetchQueries({
        queryKey: rentalPropertyKey.detail(id),
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface CreateRentalTenantReq {
  variant_id: string;
  tenant: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  contract_starts_at?: Date;
  deposit?: number;

  unit_price: number;
  keys_count: number;
  tenants_count: number;
  kids_count: number;
}
interface CreateRentalTenantRes {}
export const useCreateRentalTenant = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRentalTenantReq) => {
      return client.request<CreateRentalTenantRes>(
        "POST",
        "/vendor/rental-property/booking",
        payload
      );
    },
    onSuccess: () => {
      return queryClient.refetchQueries({
        queryKey: [rentalTenantsKey.list()],
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface RentalPropertyBookingExpense {
  id?: string;
  title?: string;
  description?: string;
  amount?: number;
  attachments?: string[];
  categories_ids?: string[];
}
interface UpdateRentalTenantReq {
  expenses?: RentalPropertyBookingExpense[];
  tenant?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  keys_count?: number;
  tenants_count?: number;
  kids_count?: number;
  contract_starts_at?: Date;
  rent_paid?: number;
}
export const useUpdateRentalTenant = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      data: UpdateRentalTenantReq;
      id: string;
    }) => {
      const { id, data } = payload;
      return await client.request<EndContractRes>(
        "POST",
        `/vendor/rental-property/booking/${id}`,
        data
      );
    },
    onSuccess: (undefined, { data, id }) => {
      queryClient.refetchQueries({
        queryKey: [
          rentalTenantsKey.list(),
          rentalTenantsKey.detail(id),
          rentalPropertyPaymentKey.lists(),
        ],
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

interface EndContractReq {
  booking_id: string;
}
interface EndContractRes {}
export const useRentalTenantEndContract = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EndContractReq) => {
      return client.request<EndContractRes>(
        "DELETE",
        `/vendor/rental-property/booking/${payload.booking_id}`,
        payload
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [rentalTenantsKey.list(), rentalPropertyKey.list()],
      });
    },
    onError: (err: AxiosError) => void 0,
  });
};

export const useRentalTenantPayRent = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EndContractReq) => {
      return client.request<EndContractRes>(
        "POST",
        `/vendor/rental-property/booking/${payload.booking_id}`,
        payload
      );
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [rentalTenantsKey.list(), rentalPropertyKey.list()],
      });
    },
    onError: (error: AxiosError) => void 0,
  });
};

export const useDeleteBuilding = () => {
  const { client } = useYallahApiContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return client.request("DELETE", `/vendor/rental-property/building/${id}`);
    },
    onSuccess: (undefined, id) => {
      queryClient.setQueryData<ReturnType<typeof useRentalBuildings>["data"]>(
        rentalBuildingsKey.list(),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            pages: prev.pages.map((page) => {
              return {
                ...page,
                buildings: page.buildings.filter((b) => b.id !== id),
              };
            }),
          };
        }
      );
    },
    onError: (error: AxiosError) => void 0,
  });
};
