import {
  MarketplaceProductsListParams,
  useMarketplaceProducts,
} from "@/api/hooks/marketplace/products/queries";
import { useState } from "react";
import { View } from "react-native";
import LoadingDefault from "../shared/templates/LoadingDefault";
import NoDataFound from "../shared/templates/NoDataFound";
import Error from "../shared/templates/Error";
import AdsListFilter from "../shared/AdsList/AdsListFilter";
import AdsList from "../shared/AdsList";

const MyAdsList = (query: MarketplaceProductsListParams) => {
  const { data, status } = useMarketplaceProducts(query);
  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (!data) return <NoDataFound />;
  return <AdsList data={data.products} extraData={query} />;
};

type Props = MarketplaceProductsListParams;
const VendorAdsList = (props: Props) => {
  const [query, setQuery] = useState<MarketplaceProductsListParams>();
  return (
    <View className="flex-1 gap-2">
      <View>
        <AdsListFilter query={query} setQuery={setQuery} />
      </View>
      <MyAdsList vendor_id={props.vendor_id} {...query} />
    </View>
  );
};

export default VendorAdsList;
