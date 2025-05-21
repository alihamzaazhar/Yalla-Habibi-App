import {
  VendorProductsListParams,
  useVendorProducts,
} from "@/api/hooks/vendor/products/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import AdsList from "@/components/shared/AdsList";
import AdsListFilter from "@/components/shared/AdsList/AdsListFilter";
import Error from "@/components/shared/templates/Error";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import NoDataFound from "@/components/shared/templates/NoDataFound";
import { useState } from "react";
import { View } from "react-native";

const MyAdsList = (query: VendorProductsListParams) => {
  const { data, status } = useVendorProducts(query);
  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (!data) return <NoDataFound />;
  return <AdsList data={data.products} extraData={query} />;
};
const MyAdsScreen = () => {
  const [query, setQuery] = useState<VendorProductsListParams>();
  return (
    <MenuScreenLayout title="My Ads">
      <View className="flex-1">
        <View>
          <AdsListFilter query={query} setQuery={setQuery} />
        </View>
        <MyAdsList {...query} />
      </View>
    </MenuScreenLayout>
  );
};

export default MyAdsScreen;
