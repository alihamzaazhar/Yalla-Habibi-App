import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Theme } from "@/constants";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { usePropertiesCategory } from "@/api/hooks/marketplace/services/properties/queries";
import RectButton from "@/ui/RectButton";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import { cn } from "@/lib/common/utils";

const SelectSecondaryCategory = () => {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const primaryCategory = searchParams.primary_category_id as string;
  const { data: categories, status } = usePropertiesCategory(primaryCategory);
  const savedChildCategory = usePropertyAdStoreContext(
    (store) => store.data?.child_category
  );
  
  const appendDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );

  if (status === "loading") {
    return (
      <PlaceAdLayout title="Select Category">
        <View className="bg-gray-100 flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={Theme.gray[600]} />
        </View>
      </PlaceAdLayout>
    );
  }
  if (status === "error") {
    return (
      <PlaceAdLayout title="Select Category">
        <Text>Error...</Text>
      </PlaceAdLayout>
    );
  }
  return (
    <PlaceAdLayout title="Select Category">
      <ScrollView className="bg-gray-100">
        {categories.propertyCategory.category_children.map((d) => (
          <RectButton
            key={d.id}
            onPress={() => {
              appendDataToStore({
                category_id: d.id,
                child_category: d,
              });
              router.navigate({
                pathname: "/(modals)/place-add/property/add-details",
              });
            }}
            className={cn(
              "px-8 py-4 border-b border-gray-200 flex-row items-center justify-between",
              savedChildCategory?.id === d.id &&
                "border-gray-400 border-dashed border-t"
            )}
          >
            <Text className="font-semibold text-xl text-gray-600">
              {d.name}
            </Text>
          </RectButton>
        ))}
      </ScrollView>
    </PlaceAdLayout>
  );
};

export default SelectSecondaryCategory;
