import { useSearchProducts } from "@/api/hooks/marketplace/products/queries";
import { SearchInput } from "@/components/shared/SearchInput";
import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation, useRouter } from "expo-router";
import debounce from "lodash.debounce";
import React, { useLayoutEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {};

const SearchScreen = (props: Props) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const { data, status } = useSearchProducts({
    q: value ?? "",
  });

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
                placeholder="Search Properties, Motors and Coupons"
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

  if (status === "loading") {
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

  return (
    <ScrollView className="bg-gray-100">
      {data.coupons.length ? (
        <View className="border-b pb-2 pt-6 border-gray-200">
          <Text className="text-sm font-bold text-gray-400 px-8">Coupons</Text>
          {data.coupons.map((d) => (
            <Button
              key={d.id}
              onPress={() => router.navigate(`/coupon-ad/${d.id}`)}
              variant={"ghost"}
              className="w-full items-center justify-between gap-4 px-8 py-5"
              rippleClassName="bg-gray-300"
              rippleBorderRadius={4}
            >
              <Text className="font-semibold text-xl text-gray-600">
                {d.title}
              </Text>
              <View>
                <Feather
                  name="arrow-up-right"
                  size={24}
                  color={`${Theme.gray[500]}`}
                />
              </View>
            </Button>
          ))}
        </View>
      ) : null}
      {data.motors.length ? (
        <View className="border-b pb-2 pt-6 border-gray-200">
          <Text className="text-sm font-bold text-gray-400 px-8">Motors</Text>
          {data.motors.map((d) => (
            <Button
              key={d.id}
              onPress={() => router.navigate(`/motor-ad/${d.id}`)}
              variant={"ghost"}
              className="w-full items-center justify-between gap-4 px-8 py-5"
              rippleClassName="bg-gray-300"
              rippleBorderRadius={4}
            >
              <Text className="font-semibold text-xl text-gray-600">
                {d.title}
              </Text>
              <View>
                <Feather
                  name="arrow-up-right"
                  size={24}
                  color={`${Theme.gray[500]}`}
                />
              </View>
            </Button>
          ))}
        </View>
      ) : null}

      {data.properties.length ? (
        <View className="border-b pb-2 pt-6 border-gray-200">
          <Text className="text-sm font-bold text-gray-400 px-8">
            Properties
          </Text>
          {data.properties.map((d) => (
            <Button
              key={d.id}
              onPress={() => router.navigate(`/property/${d.id}`)}
              variant={"ghost"}
              className="w-full items-center justify-between gap-4 px-8 py-5"
              rippleClassName="bg-gray-300"
              rippleBorderRadius={4}
            >
              <Text className="font-semibold text-xl text-gray-600">
                {d.title}
              </Text>
              <View>
                <Feather
                  name="arrow-up-right"
                  size={24}
                  color={`${Theme.gray[500]}`}
                />
              </View>
            </Button>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
};
export default SearchScreen;
