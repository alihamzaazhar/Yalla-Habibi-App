import React, { PropsWithChildren } from "react";
import { StoreApi, createStore, useStore } from "zustand";
import createGenericContext from "../../common/create-generic-context";
import { MotorAdInputSchema } from "../schema";
type Data = Partial<MotorAdInputSchema> & {
  id?: string;
};
interface Props {
  data?: Data;
  metadata?: {
    categories: Record<
      string,
      {
        id: string;
        name: string;
        handle: string;
      }
    >;
  };
}
type Metadata = {
  categories: Record<
    string,
    {
      id: string;
      name: string;
      handle: string;
    }
  >;
};
interface Store {
  data?: Data;
  metadata?: Metadata;
  actions: {
    updateData: (data: Data) => void;
    updateMetadata: (metadata: Metadata) => void;
  };
}

const [useMotorAdContext, MotorAdStoreProviderContext] =
  createGenericContext<StoreApi<Store>>();

const MotorAdStoreProvider = ({
  children,
  data,
  metadata,
}: PropsWithChildren<Props>) => {
  const [store] = React.useState(() =>
    createStore<Store>((set) => ({
      metadata,
      data: data,
      // data ? {
      //     body_type: "hatchback",
      //     fuel_type: "petrol",
      //     transmission_type: "auto",
      //     steering_side: "left",
      //     drive_system: "four_wheel",
      //     cylinder_count: 2,
      //     seats_count: 2,
      //     doors_count: 2,
      //     horsepower: 10000,
      //     engine_size: 10000,
      //     extra_features: [],
      //     location: {
      //       lat: 25.276987,
      //       lng: 55.296249,
      //     },
      //     images: [],
      //     year: 2000,
      //     kilometer: 10000,
      //     regional_spec: "GCC",
      //     has_warranty: false,
      //     description:
      //       "Aliqua esse nisi deserunt cupidatat deserunt aute quis pariatur. ",
      //     title:
      //       "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod",
      //     phone_number: "+97128686763",
      //     interior_color: "white",
      //     exterior_color: "white",
      //     price: 10000,
      //     has_insurance: false,
      //     trim: "Basic Motors Ads",
      //   }
      // :
      // undefined,
      actions: {
        updateData: (data: Partial<MotorAdInputSchema>) =>
          set((state) => ({
            data: state.data ? { ...state.data, ...data } : data,
          })),
        updateMetadata: (metadata: Metadata) =>
          set((state) => ({
            metadata: {
              ...state.metadata,
              categories: {
                ...state.metadata?.categories,
                ...metadata["categories"],
              },
            },
          })),
      },
    }))
  );

  return (
    <MotorAdStoreProviderContext value={store}>
      {children}
    </MotorAdStoreProviderContext>
  );
};

export function useMotorAdStoreContext<T>(selector: (state: Store) => T): T {
  return useStore(useMotorAdContext(), selector);
}
export default MotorAdStoreProvider;
