import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import createGenericContext from "../../common/create-generic-context";
import { RentalPropertySchema } from "./rental-property-schema";

type Data = Partial<RentalPropertySchema> & {
  id?: string;
  building?: {
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

const [useRentalPropertyContext, RentalPropertyStoreProviderContext] =
  createGenericContext<StoreApi<Store>>();

const RentalPropertyStoreProvider = ({
  children,
  data,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      data: data,
      actions: {
        updateData: (data: Partial<RentalPropertySchema>) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
      },
    }))
  );

  return (
    <RentalPropertyStoreProviderContext value={store}>
      {children}
    </RentalPropertyStoreProviderContext>
  );
};

export function useRentalPropertyStoreContext<T>(
  selector: (state: Store) => T
): T {
  return useStore(useRentalPropertyContext(), selector);
}
export default RentalPropertyStoreProvider;
