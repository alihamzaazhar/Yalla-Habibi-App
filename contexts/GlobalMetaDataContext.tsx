import createGenericContext from "@/lib/common/create-generic-context";
import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";

interface Store {
  metadata: Record<string,unknown>;
  updateMetadata: (data?: Record<string,unknown>) => void;
}

const [useGlobalMetaDataContext, GlobalMetaDataContextProvider] =
  createGenericContext<StoreApi<Store>>();

interface Props extends PropsWithChildren {}
const GlobalMetaDataProvider = ({ children }: Props) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      metadata: {},
      updateMetadata: (data?: Record<string,unknown>) =>
        set((state) => {
          return {
            ...state,
            metadata: data ? { ...state.metadata, ...data } : data,
          };
        }),
    }))
  );

  return (
    <GlobalMetaDataContextProvider value={store}>
      {children}
    </GlobalMetaDataContextProvider>
  );
};

const useGlobalMetaData = () => {
  const store = useGlobalMetaDataContext();
  return useStore(store, (state) => state);
};

export { useGlobalMetaData, GlobalMetaDataProvider };
