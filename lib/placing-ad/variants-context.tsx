import React, { PropsWithChildren, useRef } from "react";
import { createStore, useStore } from "zustand";
import { ServiceProduct } from "@/api/hooks/marketplace/services/queries";
import createGenericContext from "@/lib/common/create-generic-context";
import { TaxServiceRate } from "@medusajs/medusa/dist/types/tax-service";

export interface VariantType {
  id: string;
  price: number;
  option_values?: string[];
  tax_price?: number | null;
  total_price?: number | null;
  tax_rates?: TaxServiceRate[] | null;
}
interface Props {
  serviceProduct: ServiceProduct;
}
type ServiceVariant = Omit<ServiceProduct["variants"][number], "options"> & {
  options: Array<
    Omit<
      NonNullable<ServiceProduct["variants"][number]["options"]>[number] & {
        title: string;
      },
      "beforeInsert"
    >
  >;
};
interface StoreState {
  productOptions: Array<{ id: string; title: string }>;
  allVariants: Array<ServiceVariant>;
  currentVariant: VariantType | null;
  setCurrentVariant: (variant: VariantType | null) => void;
  selectedVariants: Array<VariantType>;
  setSelectedVariants: (variants: Array<VariantType>) => void;
}
const createVariantsStore = (initProps: Props) => {
  const options = initProps.serviceProduct.options.map((o) => ({
    id: o.id,
    title: o.title,
  }));
  const productOptionsMapping = new Map<string, string>();
  initProps.serviceProduct.options.forEach((o) => {
    productOptionsMapping.set(o.id, o.title);
  });
  return createStore<StoreState>()((set) => ({
    productOptions: options,
    selectedVariants: initProps.serviceProduct.variants[0]
      ? [
          {
            id: initProps.serviceProduct.variants[0].id,
            price: initProps.serviceProduct.variants[0].calculated_price,
            option_values: initProps.serviceProduct.variants[0].options?.map(
              (o) => o.value
            ),
          } as VariantType,
        ]
      : [],
    setSelectedVariants: (variants) => {
      return set((state) => {
        return {
          ...state,
          selectedVariants: variants,
        };
      });
    },
    allVariants: initProps.serviceProduct.variants.map((v) => ({
      ...v,
      options: v.options?.map((o) => ({
        ...o,
        title: productOptionsMapping.get(o.option_id) ?? "",
      })),
    })) as ServiceVariant[],
    currentVariant: (initProps.serviceProduct.variants[0]
      ? {
          id: initProps.serviceProduct.variants[0].id,
          price: initProps.serviceProduct.variants[0].calculated_price,
          option_values: initProps.serviceProduct.variants[0].options?.map(
            (o) => o.value
          ),
          tax_price: initProps.serviceProduct.variants[0].calculated_tax,
          total_price:
            initProps.serviceProduct.variants[0].calculated_price_incl_tax,
          tax_rates: initProps.serviceProduct.variants[0].tax_rates,
        }
      : null) as VariantType | null,
    setCurrentVariant: (variant: VariantType | null) => {
      return set((state) => {
        return {
          ...state,
          selectedVariants: !variant
            ? state.selectedVariants.filter(
                (v) => v.id !== state.currentVariant?.id
              )
            : state.selectedVariants.concat(variant),
          currentVariant: variant,
        };
      });
    },
  }));
};

const [useVariantsContext_, VariantsProviderContext] =
  createGenericContext<ReturnType<typeof createVariantsStore>>();

const VariantsProvider = ({ children, ...props }: PropsWithChildren<Props>) => {
  const { current: store } = useRef(createVariantsStore(props));
  return (
    <VariantsProviderContext value={store}>{children}</VariantsProviderContext>
  );
};
function useVariantsContext<T>(selector: (state: StoreState) => T): T {
  const store = useVariantsContext_();
  return useStore(store, selector);
}

export { useVariantsContext };
export default VariantsProvider;
