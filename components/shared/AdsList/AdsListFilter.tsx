import { VendorProductsListParams } from "@/api/hooks/vendor/products/queries";
import Chip from "@/ui/Chip";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

type Props = {
  query: VendorProductsListParams | undefined;
  setQuery: React.Dispatch<
    React.SetStateAction<VendorProductsListParams | undefined>
  >;
};

const AdsListFilter = ({ query, setQuery }: Props) => {
  const selectedTypes = query?.type ?? [];
  const showAllTypes = !selectedTypes || selectedTypes.length === 0;
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="py-4 gap-2"
      contentContainerStyle={{ paddingLeft: 15, paddingRight: 15 }}
    >
      <Chip
        label={"All"}
        variant={showAllTypes ? "selected" : "default"}
        onPress={() => setQuery({ type: undefined })}
      />
      <Chip
        label={"Motor Ads"}
        variant={selectedTypes.includes("motor_ad") ? "selected" : "default"}
        onPress={() =>
          setQuery({
            type: selectedTypes.includes("motor_ad")
              ? selectedTypes.filter((t) => t !== "motor_ad")
              : ["motor_ad", ...selectedTypes],
          })
        }
      />
      <Chip
        label={"Property Ads"}
        variant={selectedTypes.includes("property_ad") ? "selected" : "default"}
        onPress={() =>
          setQuery({
            type: selectedTypes.includes("property_ad")
              ? selectedTypes.filter((t) => t !== "property_ad")
              : ["property_ad", ...selectedTypes],
          })
        }
      />
      <Chip
        label={"Coupon Ads"}
        variant={selectedTypes.includes("coupon_ad") ? "selected" : "default"}
        onPress={() =>
          setQuery({
            type: selectedTypes.includes("coupon_ad")
              ? selectedTypes.filter((t) => t !== "coupon_ad")
              : ["coupon_ad", ...selectedTypes],
          })
        }
      />
    </ScrollView>
  );
};

export default AdsListFilter;
