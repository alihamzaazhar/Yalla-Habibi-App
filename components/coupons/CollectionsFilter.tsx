import { useCouponAdCollections } from "@/api/hooks/marketplace/services/coupons/queries";
import { humanizeString } from "@/lib/common/utils";
import ChipsSelect, { ChipsSelectSkeleton } from "@/ui/ChipsSelect";
import React from "react";

type Props = Omit<
  React.ComponentPropsWithoutRef<typeof ChipsSelect>,
  "options"
>;

const CollectionsFilter = (props: Props) => {
  const { data, status } = useCouponAdCollections();
  if (status === "loading") return <ChipsSelectSkeleton {...props} />;
  if (status === "error") return <></>;
  if (!data) return <></>;
  return (
    <ChipsSelect
      {...props}
      options={data.collections.map((v) => ({
        label: humanizeString(v.title),
        value: v.id,
      }))}
    />
  );
};

export default CollectionsFilter;
