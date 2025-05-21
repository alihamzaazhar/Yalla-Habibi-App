import { useUpdateRentalTenant } from "@/api/hooks/rental-properties/mutations";
import StackScreenLayout from "@/components/layouts/StackScreenLayout";
import colors from "@/constants/colors";
import { addOpacityToHsl } from "@/lib/common/utils";
import AmountInput from "@/ui/AmountInput";
import BorderlessButton from "@/ui/BorderlessButton";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const AddRentScreen = (props: Props) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const [value, setValue] = React.useState<number | undefined>(undefined);
  const { mutate: updateRentalTenant, status: isUpdating } =
    useUpdateRentalTenant();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <View className={"bg-primary flex-row items-center py-4"}>
          <SafeAreaView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
              paddingVertical: 16,
              paddingHorizontal: 18,
            }}
          >
            <BorderlessButton onPress={() => navigation.goBack()}>
              <Entypo name="chevron-left" size={20} color={`white`} />
            </BorderlessButton>
            <Text className="text-2xl font-bold text-white">{"Add Rent"}</Text>
            <View></View>
          </SafeAreaView>
        </View>
      ),
    });
  }, []);
  return (
    <StackScreenLayout title="Add Rent" className="bg-primary">
      <View className="flex-1 bg-primary mb-16">
        <View className="flex flex-col items-center gap-4 w-full px-4 flex-1 justify-center">
          <AmountInput
            value={value ?? null}
            onChangeValue={(v) => setValue(v == null ? undefined : v)}
            style={{
              fontSize: 80,
              height: 120,
            }}
            cursorColor={"white"}
            decimal_digits={2}
            placeholderClassName="text-primary text-base text-xl"
            placeholderTextColor={addOpacityToHsl(colors.accent.DEFAULT, 0.5)}
            placeholder="AED"
            className="flex-1 bg-transparent text-center text-white p-0 w-full"
            prefixClassName="text-white text-base text-xl"
            autoFocus
          />

          <Text className="text-xl text-white">Enter Amount</Text>
        </View>
      </View>
      <View className="absolute bottom-0 px-8 py-12 w-full bg-primary">
        <Button
          className="w-full bg-white py-4 h-auto"
          onPress={() => {
            if (!value) return;
            updateRentalTenant(
              {
                id: id,
                data: {
                  rent_paid: value,
                },
              },
              {
                onSuccess: () => {
                  router.navigate({
                    pathname: `/(rental)/tenant/[id]`,
                    params: {
                      id: id,
                    },
                  });
                },
              }
            );
          }}
          isLoading={isUpdating === "loading"}
          loadingClassName="bg-primary"
        >
          <Text className="text-primary font-bold text-xl">{"Add Rent"}</Text>
        </Button>
      </View>
    </StackScreenLayout>
  );
};

export default AddRentScreen;
