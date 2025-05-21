;import { VariantType, useVariantsContext } from "@/lib/placing-ad/variants-context";
import { PRIMARY_VARIANT_OPTIONS, SECONDARY_VARIANT_OPTIONS } from "../../motors-ad/constants";

interface BundleVariantType extends VariantType {
  value: (typeof SECONDARY_VARIANT_OPTIONS)[number];
}

const useBundleVariants = () => {
  const allVariants = useVariantsContext((state) => state.allVariants);
  const selectedVariants = [] as Array<BundleVariantType>;
  for (const variantOption of SECONDARY_VARIANT_OPTIONS) {
    const variant = allVariants.find(v => {
      const mainOption = v.options?.find(o => o.value === PRIMARY_VARIANT_OPTIONS[1])
      const bundleOption = v.options?.find(o => o.value === variantOption)
      const badgeOption = v.options?.find(o => o.value === "null")
      return mainOption && bundleOption && badgeOption
    })
    if (variant) {
      selectedVariants.push({
        id:variant.id!,
        price: variant.prices[0].amount,
        value: variantOption,
        option_values: variant.options?.map(o => o.value)
      });
    }
  }
  return selectedVariants;
};

export default useBundleVariants;
