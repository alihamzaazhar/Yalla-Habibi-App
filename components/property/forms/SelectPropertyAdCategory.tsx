import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import {
  MarketplaceListPropertiesCategoriesParams,
  MarketplaceListPropertiesCategoriesRes,
  usePropertiesCategories,
} from "@/api/hooks/marketplace/services/properties/queries";
import RectButton from "@/ui/RectButton";
import { cn } from "@/lib/common/utils";
import { Button } from "@/ui/Button";

type Category =
  MarketplaceListPropertiesCategoriesRes["propertyCategories"][number];
interface Props {
  categoryFilters?: MarketplaceListPropertiesCategoriesParams;
  savedCategory?: Partial<Category>;
  focusedCategory?: Partial<Category>;
  pickCategory: (category: Category) => void;
  actionButtonText?: string;
  actionButtonLoading?: boolean;
  actionButtonOnPress?: () => void;
}

const SelectPropertyAdCategory = ({
  savedCategory,
  focusedCategory,
  pickCategory,
  categoryFilters,
  actionButtonOnPress,
  actionButtonLoading = false,
  actionButtonText = "Next",
}: Props) => {
  const { data: categories, status } = usePropertiesCategories(categoryFilters);

  if (status === "loading") {
    return (
      <View className="bg-gray-100 flex-1 items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    );
  }
  if (status === "error") {
    return <Text>Error...</Text>;
  }
  return (
    <View>
      <ScrollView className="bg-gray-100">
        {categories.propertyCategories.map((d) => (
          <RectButton
            key={d.id}
            onPress={pickCategory?.bind(null, d)}
            className={cn(
              "px-8 py-4 border-b border-gray-200 flex-row items-center justify-between",
              savedCategory?.id === d.id
                ? "bg-primary"
                : focusedCategory?.id === d.id && "border-gray-400 border-dashed border-t"
            )}
          >
            <Text
              className={cn(
                "font-semibold text-xl text-gray-600",
                savedCategory?.id === d.id && "text-white"
              )}
            >
              {d.name}
            </Text>
          </RectButton>
        ))}
      </ScrollView>
      {actionButtonOnPress ? (
        <View
          className="absolute bottom-0 p-6 w-full bg-white"
          style={globalStyles.shadowMd}
        >
          <View className="flex flex-row gap-4 items-center justify-between">
            <Button
              className="w-full flex-1"
              isLoading={actionButtonLoading}
              onPress={actionButtonOnPress}
            >
              <Text className="text-white font-bold text-xl">
                {actionButtonText}
              </Text>
            </Button>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default SelectPropertyAdCategory;
