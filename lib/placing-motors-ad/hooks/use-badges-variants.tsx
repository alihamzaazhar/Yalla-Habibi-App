import {
  VariantType,
  useVariantsContext,
} from "@/lib/placing-ad/variants-context";
import {
  BADGES_VARIANT_OPTIONS,
  PRIMARY_VARIANT_OPTIONS,
  SECONDARY_VARIANT_OPTIONS,
} from "../../motors-ad/constants";

interface BadgeVariantType extends VariantType {
  value: (typeof BADGES_VARIANT_OPTIONS)[number];
  badgePrice: number;
}
const useBadgesVariants = () => {
  const currentVariant = useVariantsContext((store) => store.currentVariant);
  const allVariants = useVariantsContext((store) => store.allVariants);
  if (!currentVariant) return [];

  const bundleVariant = currentVariant?.option_values?.find((o) =>
    SECONDARY_VARIANT_OPTIONS.includes(
      o as (typeof SECONDARY_VARIANT_OPTIONS)[number]
    )
  );
  if (!bundleVariant) return [];
  const mediumBundleVariantWithoutBadge = allVariants.find((v) => {
    const mainOption = v.options?.find(
      (o) => o.value === PRIMARY_VARIANT_OPTIONS[1]
    );
    const bundleOption = v.options?.find((o) => o.value === bundleVariant);
    const badgeOption = v.options?.find((o) => o.value === "null");
    return mainOption && bundleOption && badgeOption;
  });
  if (!mediumBundleVariantWithoutBadge) return [];
  const variantsFound = [] as Array<BadgeVariantType>;
  for (const badgeOption of BADGES_VARIANT_OPTIONS) {
    const v = allVariants.find((v) => {
      const mainOption = v.options?.find(
        (o) => o.value === PRIMARY_VARIANT_OPTIONS[1]
      );
      const bundleOption = v.options?.find((o) => o.value === bundleVariant);
      const badgeOptionSelected = v.options?.find(
        (o) => o.value === badgeOption
      );
      return mainOption && bundleOption && badgeOptionSelected;
    });
    if (v)
      variantsFound.push({
        id: v.id!,
        price: v.prices[0].amount,
        value: badgeOption,
        option_values: v.options?.map((o) => o.value),
        badgePrice:
          v.prices[0].amount -
          (mediumBundleVariantWithoutBadge?.prices[0].amount ?? 0),
      });
  }
  return variantsFound;
};
export default useBadgesVariants;
