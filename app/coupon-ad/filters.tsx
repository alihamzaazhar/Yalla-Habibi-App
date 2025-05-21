import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CollectionsFilter from "@/components/coupons/CollectionsFilter";
import FilterScreenLayout from "@/components/layouts/FilterScreenLayout";
import PostedWithinDateFilter from "@/components/property/filters/PostedWithinDateFilter";
import { useCouponAdsFilters } from "@/lib/coupons/hooks/useCouponFilters";

const CouponFiltersModal = () => {
  const filters = useCouponAdsFilters((state) => state.filters);
  const setFilters = useCouponAdsFilters((state) => state.setFilters);
  const navigation = useNavigation();
  return (
    <FilterScreenLayout
      onReset={() => {
        setFilters();
        navigation.goBack();
      }}
    >
      <ScrollView
        contentContainerClassName="bg-background gap-4 py-4 min-h-screen"
        scrollEnabled
      >
        <View className="gap-2">
          <View className="justify-between flex-row items-center px-4">
            <Text className="text-lg font-medium">Category Filter</Text>
            {filters.collection_id ? (
              <Button
                variant={"ghost"}
                className="gap-2 items-center"
                onPress={() => setFilters({ collection_id: undefined })}
              >
                <MaterialIcons
                  name="cancel"
                  size={18}
                  color={`${Theme.gray[500]}`}
                />
                <Text className="font-semibold text-gray-500 mb-0.5">
                  {"Clear"}
                </Text>
              </Button>
            ) : null}
          </View>
          <CollectionsFilter
            value={filters.collection_id}
            onChange={(v) => setFilters({ collection_id: v as string })}
            chipsContainerClassName="px-4"
          />
        </View>
        <PostedWithinDateFilter 
          filter={filters.created_at}
          setFilter={(created_at) => setFilters({ created_at })}
          

        />

      </ScrollView>
    </FilterScreenLayout>
  );
};

export default CouponFiltersModal;
