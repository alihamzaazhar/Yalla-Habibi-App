import React, { PropsWithChildren, useRef } from "react";
import { createStore, useStore } from "zustand";
import { ServiceProduct } from "@/api/hooks/marketplace/services/queries";
import { VariantType, processVariants } from "./process-variants";
import createGenericContext from "@/lib/common/create-generic-context";
interface Props {
  serviceProduct: ServiceProduct;
}
interface StoreState {
  allVariants: ReturnType<typeof processVariants>;
  currentVariant: VariantType | null;
  setCurrentVariant: (variant: VariantType | null) => void;
}
const createPropertyAdVariantsStore = (initProps: Props) => {
  const variantsMappingWithOptions = processVariants(initProps.serviceProduct);
  return createStore<StoreState>()((set) => ({
    allVariants: variantsMappingWithOptions,
    currentVariant: null as VariantType | null,
    setCurrentVariant: (variant: VariantType | null) => {
      return set((state) => {
        return {
          ...state,
          currentVariant: variant,
        };
      });
    },
  }));
};

const [usePropertyAdVariantsContext_, PropertyAdVariantsProviderContext] =
  createGenericContext<ReturnType<typeof createPropertyAdVariantsStore>>();

const PropertyAdVariantsProvider = ({
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const { current: store } = useRef(createPropertyAdVariantsStore(props));

  return (
    <PropertyAdVariantsProviderContext value={store}>
      {children}
    </PropertyAdVariantsProviderContext>
  );
};
function usePropertyAdVariantsContext<T>(
  selector: (state: StoreState) => T
): T {
  const store = usePropertyAdVariantsContext_();
  return useStore(store, selector);
}

export { usePropertyAdVariantsContext };
export default PropertyAdVariantsProvider;
