import { useMotorsCategories } from "@/api/hooks/marketplace/services/motors/queries";
import { SearchInput } from "@/components/shared/SearchInput";
import { Theme } from "@/constants";
import { useGlobalMetaData } from "@/contexts/GlobalMetaDataContext";
import { useMotorAdsFilter } from "@/lib/motors-ad/context/motor-ad-filters-context";
import { Button } from "@/ui/Button";
import { useNavigation, useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};
const SearchScreen = (props: Props) => {
  const navigation = useNavigation();
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const { filters, setFilters } = useMotorAdsFilter((store) => store);
  const { updateMetadata } = useGlobalMetaData();
  const rootParentCategoryId = filters.categories?.[0];
  const { data, status, fetchStatus } = useMotorsCategories(
    {
      q: value ?? "",
      parent_category_id: rootParentCategoryId,
    },
    {
      enabled: value ? value.length > 2 : false,
    }
  );
  const router = useRouter();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View className="bg-card">
          <SafeAreaView>
            <View className="p-4 flex-row justify-between">
              <SearchInput
                enableNavigatingBack
                autoFocus
                className="flex-1"
                placeholder="Search Make or Model"
                onChangeText={(t) =>
                  debounce(() => setValue(t.length > 2 ? t : undefined))()
                }
              />
            </View>
          </SafeAreaView>
        </View>
      ),
    });
  }, []);

  if (status === "loading" && fetchStatus !== "idle") {
    return (
      <View className="bg-gray-200 flex-1 py-6">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </View>
    );
  }
  if (status === "error") {
    return (
      <View className="bg-gray-200">
        <Text className="text-2xl font-bold">Something went wrong</Text>
      </View>
    );
  }
  if (!rootParentCategoryId) return <Text>{"How did you get here?"}</Text>;
  if (!data) return <Text></Text>;

  return (
    <ScrollView className="bg-gray-100">
      {data.motorAdsCategories.map((parent) => (
        <View key={parent.id}>
          <Button
            onPress={() => {
              setFilters({
                categories: [rootParentCategoryId, parent.id],
              });
              updateMetadata({
                [parent.id]: {
                  id: parent.id,
                  name: parent.name,
                  parent_category_id: filters.categories?.[0],
                },
              });
              router.navigate("/motor-ad/(list)/see-more");
            }}
            variant={"ghost"}
            className="w-full items-center justify-between gap-4 px-8 py-5"
            rippleClassName="bg-gray-300"
            rippleBorderRadius={4}
          >
            <Text className="font-semibold text-xl text-gray-600">{`${parent.name}`}</Text>
          </Button>
          {parent.category_children.map((d) => (
            <Button
              key={d.id}
              onPress={() => {
                setFilters({
                  categories: [rootParentCategoryId, parent.id, d.id],
                });
                updateMetadata({
                  [parent.id]: {
                    id: parent.id,
                    name: parent.name,
                    parent_category_id: filters.categories?.[0],
                  },
                });
                updateMetadata({
                  [d.id]: {
                    id: d.id,
                    name: d.name,
                    parent_category_id: filters.categories?.[0],
                  },
                });
                router.navigate("/motor-ad/(list)/see-more");
              }}
              variant={"ghost"}
              className="w-full items-center justify-between gap-4 px-8 py-5"
              rippleClassName="bg-gray-300"
              rippleBorderRadius={4}
            >
              <Text className="font-semibold text-xl text-gray-600">
                {`${parent.name} / ${d.name}`}
              </Text>
            </Button>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
export default SearchScreen;
