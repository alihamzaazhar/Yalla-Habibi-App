import { useCreateExpenseCategory } from "@/api/hooks/expense/mutations";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import Input from "@/ui/Input";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

const SelectBuilding = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const tenantId = params.id as string;
  const title = params.title as string;
  const [value, setValue] = React.useState("");
  const { mutate: createCategory, status: createCategoryStatus } =
    useCreateExpenseCategory();
  const [errorMessage, setFieldError] = React.useState<string | undefined>(
    undefined
  );

  return (
    <PlaceAdLayout title="Create a category" className="relative flex-1">
      <View className="px-4 py-6">
        <Input
          className="h-14 text-xl bg-gray-200"
          placeholder="Category Name"
          placeholderTextColor={`hsl(${Theme.colors.muted.foreground})`}
          cursorColor={`hsl(${Theme.colors.muted.foreground})`}
          value={value}
          onChangeText={(t) => setValue(t)}
        />
        <View className="mt-2">
          {errorMessage ? (
            <View className="bg-red-600 px-6 items-center py-4 rounded-md mt-12 flex-row gap-4">
              <AntDesign
                name="warning"
                size={24}
                color={`hsl(${Theme.colors.primary.foreground})`}
              />
              <Text className="text-white text-lg font-bold text-wrap flex-1 flex-wrap">
                {errorMessage}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <View className="mt-10 absolute bottom-0 w-full px-4 py-6">
        <Button
          className="w-full h-14"
          onPress={() => {
            if (value.length > 0) {
              createCategory(
                {
                  name: value,
                },
                {
                  onSuccess: ({ expenseCategory }) => {
                    router.navigate({
                      pathname: "/(rental)/tenant/[id]/add-expense/add-details",
                      params: {
                        id: tenantId,
                        category_id: expenseCategory.id,
                        category_name: expenseCategory.name,
                        title: title,
                      },
                    });
                  },
                }
              );
            } else {
              setFieldError("Please enter a building name");
            }
          }}
          isLoading={createCategoryStatus === "loading"}
        >
          <Text className="text-white font-bold text-2xl">Next</Text>
        </Button>
      </View>
    </PlaceAdLayout>
  );
};

export default SelectBuilding;
