import { MarketplaceListMotorAdsParams } from "@/api/hooks/marketplace/services/motors/queries";
import createGenericContext from "@/lib/common/create-generic-context";
import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";

type Filters = MarketplaceListMotorAdsParams;
interface Store {
  filters: Filters;
  setFilters: (filters?: Filters) => void;
}

const [useMotorAdsFilterContext, MotorAdsFilterContextProvider] =
  createGenericContext<StoreApi<Store>>();

interface Props extends PropsWithChildren {
  initalFilters?: Filters;
}
const MotorAdsFilterProvider = ({ children, initalFilters }: Props) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      filters: initalFilters ?? {},
      setFilters: (filters?: Filters) =>
        set((state) => {
          return {
            ...state,
            filters: filters
              ? { ...state.filters, ...filters }
              : {
                  ...initalFilters,
                  categories: state?.filters?.categories?.[0]
                    ? [state.filters.categories[0]]
                    : undefined,
                },
          };
        }),
    }))
  );

  return (
    <MotorAdsFilterContextProvider value={store}>
      {children}
    </MotorAdsFilterContextProvider>
  );
};

function useMotorAdsFilter<T>(selector: (state: Store) => T): T {
  return useStore(useMotorAdsFilterContext(), selector);
}

export { useMotorAdsFilter, MotorAdsFilterProvider };
