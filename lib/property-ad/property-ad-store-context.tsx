import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import { PropertyAdInputSchema } from "./schemas";
import createGenericContext from "../common/create-generic-context";
import { omit } from "lodash";

type Data = Partial<PropertyAdInputSchema> & {
  id?: string;
  parent_category?: {
    id: string;
    name: string;
  };
  child_category?: {
    id: string;
    name: string;
  };
};
interface Props {
  data?: Data;
}
interface Store {
  data?: Data;
  actions: {
    updateData: (data: Data) => void;
  };
}

const [usePropertyAdContext, PropertyAdStoreProviderContext] =
  createGenericContext<StoreApi<Store>>();

const PropertyAdStoreProvider = ({
  children,
  data,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      data: data,
      actions: {
        updateData: (data: Data) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
      },
    }))
  );

  return (
    <PropertyAdStoreProviderContext value={store}>
      {children}
    </PropertyAdStoreProviderContext>
  );
};

export function usePropertyAdStoreContext<T>(selector: (state: Store) => T): T {
  return useStore(usePropertyAdContext(), selector);
}
export default PropertyAdStoreProvider;
