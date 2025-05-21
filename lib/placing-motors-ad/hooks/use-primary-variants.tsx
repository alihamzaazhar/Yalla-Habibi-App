import { VariantType, useVariantsContext } from "@/lib/placing-ad/variants-context";
import { PRIMARY_VARIANT_OPTIONS } from "../../motors-ad/constants";
interface PrimaryVariant extends VariantType {
  value: (typeof PRIMARY_VARIANT_OPTIONS)[number];
}
const usePrimaryVariants = () => {
  const allVariants = useVariantsContext(state => state.allVariants)
  const variants = [] as PrimaryVariant[];
  for (const variantOption of PRIMARY_VARIANT_OPTIONS) {
    const v = allVariants.find(v => {
      const mainOption = v.options?.find(o => o.value === variantOption)
      const bundleOption = v.options?.find(o => o.value === "null")
      const badgeOption = v.options?.find(o => o.value === "null")
      return mainOption && bundleOption && badgeOption
    }); 
    if (v) {
      variants.push({
        id:v.id!,
        price: v.prices[0].amount,
        value: variantOption,
        option_values: v.options?.map(o => o.value)
      })
    }
  }
  return variants;
};

export default usePrimaryVariants;
