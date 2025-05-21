import { ServiceProduct } from "@/api/hooks/marketplace/services/queries";

export const PROPERTY_AD_VARIANT_OPTIONS = ["defaultPackage"] as const;

export type VariantsOptionsCombination = "defaultPackage";

export interface VariantType {
  id: string;
  price: number;
  option_value: VariantsOptionsCombination;
}
export const processVariants = (serviceProduct: ServiceProduct) => {
  const variantsMappingWithOptions = new Map<
    VariantsOptionsCombination,
    VariantType
  >();

  for (const v of serviceProduct.variants) {
    if (!v.id || !v.calculated_price || !v.options?.length) continue;
    const options = v.options.map((o) => o.value);
    const optionValue = options.join("_") as VariantsOptionsCombination;
    if (optionValue && options.length) {
      variantsMappingWithOptions.set(optionValue, {
        id: v.id,
        price: v.calculated_price,
        option_value: optionValue,
      });
    }
  }

  return variantsMappingWithOptions;
};
