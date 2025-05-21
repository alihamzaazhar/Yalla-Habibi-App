import React, { useState } from "react";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { View } from "react-native";
import AdsListFilter from "@/components/shared/AdsList/AdsListFilter";
import { VendorProductsListParams } from "@/api/hooks/vendor/products/queries";
import {
  CustomerGetFavouriteReq,
  useGetFavourites,
} from "@/api/hooks/favourite/queries";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import Error from "@/components/shared/templates/Error";
import NoDataFound from "@/components/shared/templates/NoDataFound";
import AdsList from "@/components/shared/AdsList";

const FavouritesList = (query: CustomerGetFavouriteReq) => {
  const { data, status } = useGetFavourites(query);
  if (status === "loading") return <LoadingDefault />;
  if (status === "error") return <Error />;
  if (!data) return <NoDataFound />;
  return <AdsList data={data.favourites} extraData={query} />;
};

const FavouritesScreen = () => {
  const [query, setQuery] = useState<CustomerGetFavouriteReq>();
  return (
    <MenuScreenLayout title="Favourites">
      <View className="flex-1">
        <View>
          <AdsListFilter query={query} setQuery={setQuery} />
        </View>
        <FavouritesList type={query?.type} />
      </View>
    </MenuScreenLayout>
  );
};

export default FavouritesScreen;
