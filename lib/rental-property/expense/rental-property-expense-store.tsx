import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import createGenericContext from "../../common/create-generic-context";
import { RentalPropertyExpenseSchema } from "./rental-property-expense-schema";

type Data = Partial<RentalPropertyExpenseSchema>;
interface Props {
  data: Data;
}
interface Store {
  data: Data;
  actions: {
    updateData: (data: Data) => void;
  };
}

const [useRentalPropertyExpenseContext, RPEStoreProvider] =
  createGenericContext<StoreApi<Store>>();

const RentalPropertyExpenseStoreProvider = ({
  children,
  data,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      data: data,
      actions: {
        updateData: (data: Partial<RentalPropertyExpenseSchema>) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
      },
    }))
  );

  return <RPEStoreProvider value={store}>{children}</RPEStoreProvider>;
};

export function useRentalPropertyExpenseStoreContext<T>(
  selector: (state: Store) => T
): T {
  return useStore(useRentalPropertyExpenseContext(), selector);
}
export default RentalPropertyExpenseStoreProvider;
