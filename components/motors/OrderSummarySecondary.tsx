import useBadgesVariants from "@/lib/placing-motors-ad/hooks/use-badges-variants";
import { useVariantsContext } from "@/lib/placing-ad/variants-context";

type Props = {};

const OrderSummarySecondary = (props: Props) => {
  const currentVariant = useVariantsContext((store) => store.currentVariant);
  const setCurrentVariant = useVariantsContext(
    (store) => store.setCurrentVariant
  );
  const onlyBadgesVariants = useBadgesVariants();
  if (!currentVariant) return null;
  return null;
};

export default OrderSummarySecondary;
