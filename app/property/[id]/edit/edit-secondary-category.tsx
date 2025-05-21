import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { usePropertiesCategory } from "@/api/hooks/marketplace/services/properties/queries";
import RectButton from "@/ui/RectButton";
import { usePropertyAdStoreContext } from "@/lib/property-ad/property-ad-store-context";
import { cn } from "@/lib/common/utils";
import { Button } from "@/ui/Button";
import { useUpdatePropertyAd } from "@/api/hooks/vendor/products/mutations";
import BaseButton from "@/ui/BaseButton";

const EditSecondaryCategory = () => {
  const router = useRouter();
  const savedCategoryId = usePropertyAdStoreContext(
    (store) => store.data?.child_category?.id
  );
  const propertyId = usePropertyAdStoreContext((store) => store.data?.id);
  const { mutate: updatePropertyAd, status: updatingStatus } =
    useUpdatePropertyAd();
  const [focusedCategoryId, setSelectedCategoryId] = React.useState<
    string | undefined
  >(savedCategoryId);
  const searchParams = useLocalSearchParams();
  const primaryCategory = searchParams.primary_category_id as string;
  const { data: categories, status } = usePropertiesCategory(primaryCategory);
  const updateDataToStore = usePropertyAdStoreContext(
    (store) => store.actions.updateData
  );

  if (status === "loading") {
    return (
      <PlaceAdLayout
        title="Update Category"
        showDismissButton
        onDismiss={() => {
          router.navigate({
            pathname: `/property/[id]`,
            params: {
              id: propertyId!,
            },
          });
        }}
      >
        <View className="bg-gray-100 flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={Theme.gray[600]} />
        </View>
      </PlaceAdLayout>
    );
  }
  if (status === "error") {
    return (
      <PlaceAdLayout
        title="Update Category"
        showDismissButton
        onDismiss={() => {
          router.navigate({
            pathname: `/property/[id]`,
            params: {
              id: propertyId!,
            },
          });
        }}
      >
        <Text>Error...</Text>
      </PlaceAdLayout>
    );
  }

  return (
    <PlaceAdLayout
      title="Update Category"
      showDismissButton
      onDismiss={() => {
        router.navigate({
          pathname: `/property/[id]`,
          params: {
            id: propertyId!,
          },
        });
      }}
    >
      <ScrollView className="bg-gray-100">
        <View className="flex-1" style={{ marginBottom: 90 }}>
          {categories.propertyCategory.category_children.map((d) => (
            <RectButton
              key={d.id}
              onPress={setSelectedCategoryId.bind(null, d.id)}
              className={cn(
                "px-8 py-4 border-b border-gray-200 flex-row items-center justify-between",
                savedCategoryId === d.id
                  ? "bg-primary"
                  : focusedCategoryId === d.id &&
                      "border-gray-400 border-dashed border-t"
              )}
            >
              <Text
                className={cn(
                  "font-semibold text-xl text-gray-600",
                  savedCategoryId === d.id && "text-white"
                )}
              >
                {d.name}
              </Text>
            </RectButton>
          ))}
        </View>
      </ScrollView>
      <View
        className="absolute bottom-0 p-6 w-full bg-white"
        style={globalStyles.shadowMd}
      >
        <View className="flex flex-row gap-4 items-center justify-between">
          <BaseButton
            ButtonProps={{
              style: {
                width: "100%",
                backgroundColor: Theme.primary.DEFAULT,
              },
            }}
            className="w-full"
            variant={"default"}
            isLoading={updatingStatus === "loading"}
            onPress={() => {
              if (focusedCategoryId !== savedCategoryId) {
                updatePropertyAd(
                  {
                    id: propertyId!,
                    data: {
                      category_id: focusedCategoryId,
                    },
                  },
                  {
                    onSuccess: (data) => {
                      updateDataToStore({
                        category_id: data.propertyAd.categories?.[0].id,
                        parent_category: data.propertyAd.parent_category,
                        child_category: data.propertyAd.child_category,
                      });
                    },
                  }
                );
              } else {
                router.navigate({
                  pathname: `/property/[id]/edit/edit-details`,
                  params: {
                    id: propertyId!,
                  },
                });
              }
            }}
          >
            <Text className="text-white font-bold text-xl">
              {focusedCategoryId !== savedCategoryId ? "Update" : "Next"}
            </Text>
          </BaseButton>
        </View>
      </View>
    </PlaceAdLayout>
  );
};

export default EditSecondaryCategory;
