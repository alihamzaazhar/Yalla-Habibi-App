import { MarketplaceListPropertiesParams } from "@/api/hooks/marketplace/services/properties/queries";
import createGenericContext from "@/lib/common/create-generic-context";
import React, { PropsWithChildren } from "react";
import { StoreApi, create, createStore, useStore } from "zustand";

type Filters = MarketplaceListPropertiesParams;
interface Store {
  filters: Filters;
  setFilters: (filters?: Filters) => void;
}

const [usePropertiesFilterContext, PropertiesFilterContextProvider] =
  createGenericContext<StoreApi<Store>>();

interface Props extends PropsWithChildren {
  initalFilters?: Filters;
}
const PropertiesFilterProvider = ({ children, initalFilters }: Props) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      filters: initalFilters ?? {},
      setFilters: (filters?: Filters) =>
        set((state) => {
          return {
            ...state,
            filters: filters ? { ...state.filters, ...filters } : initalFilters,
          };
        }),
    }))
  );

  return (
    <PropertiesFilterContextProvider value={store}>
      {children}
    </PropertiesFilterContextProvider>
  );
};


function usePropertiesFilter<T>(selector: (state: Store) => T): T {
  return useStore(usePropertiesFilterContext(), selector);
}

export { usePropertiesFilter, PropertiesFilterProvider };
