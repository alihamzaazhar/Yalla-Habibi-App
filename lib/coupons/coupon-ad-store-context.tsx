import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import createGenericContext from "../common/create-generic-context";
import { CouponAdSchema } from "./schemas";
type Data = Partial<CouponAdSchema> & {
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

const [useCouponAdContext, CouponAdStoreProviderContext] =
  createGenericContext<StoreApi<Store>>();

const CouponAdStoreProvider = ({
  children,
  data,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      data: data,
      actions: {
        updateData: (data: Partial<CouponAdSchema>) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
      },
    }))
  );

  return (
    <CouponAdStoreProviderContext value={store}>
      {children}
    </CouponAdStoreProviderContext>
  );
};

export function useCouponAdStoreContext<T>(selector: (state: Store) => T): T {
  return useStore(useCouponAdContext(), selector);
}
export default CouponAdStoreProvider;
