import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import createGenericContext from "../../common/create-generic-context";
import { TenantSchema } from "./schema";
type Data = Partial<TenantSchema> & {
  id?: string;
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

const [useRentalBookingContext, RentalBookingStoreProviderContext] =
  createGenericContext<StoreApi<Store>>();

const RentalBookingStoreProvider = ({
  children,
  data,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      data: data,
      actions: {
        updateData: (data: Partial<TenantSchema>) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
      },
    }))
  );

  return (
    <RentalBookingStoreProviderContext value={store}>
      {children}
    </RentalBookingStoreProviderContext>
  );
};

export function useRentalBookingStoreContext<T>(
  selector: (state: Store) => T
): T {
  return useStore(useRentalBookingContext(), selector);
}
export default RentalBookingStoreProvider;
