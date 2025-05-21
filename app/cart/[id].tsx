import { useGetCart } from "@/api/hooks/cart/queries";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import { useCompleteCartWithStripe } from "@/lib/cart/useCompleteCartWithStripe";
import { formatPrice } from "@/lib/common/prices";
import { Button } from "@/ui/Button";
import { InputField } from "@/ui/Form/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native";
import * as z from "zod";

const CompleteCartFormSchema = z.object({
  email: z.string().email(),
});

const CartScreen = () => {
  const id = useLocalSearchParams().id as string;
  const { data, status } = useGetCart(id);
  const { mutate: completeCart, status: completeCartStatus } =
    useCompleteCartWithStripe();
  const router = useRouter();
  const { data: userData } = useVendorMe();
  const { ...methods } = useForm<z.infer<typeof CompleteCartFormSchema>>({
    mode: "onChange",
    defaultValues: userData
      ? {
          email: userData?.user.email,
        }
      : undefined,
    resolver: zodResolver(CompleteCartFormSchema),
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    if (!data) return;
    completeCart(
      { id: data?.cart.id, email: values.email },
      {
        onSuccess: () => {
          router.navigate("/(tabs)");
        },
      }
    );
  });
  if (status === "loading")
    return (
      <MenuScreenLayout title="Buy Coupon">
        <LoadingDefault />
      </MenuScreenLayout>
    );
  if (status === "error")
    return (
      <MenuScreenLayout title="Buy Coupon">
        <Text>Error...</Text>
      </MenuScreenLayout>
    );
  if (!data)
    return (
      <MenuScreenLayout title="Buy Coupon">
        <Text>No data...</Text>
      </MenuScreenLayout>
    );
  return (
    <MenuScreenLayout title="Buy Coupon">
      <FormProvider {...methods}>
        <View className="flex-1 p-6 gap-4">
          <View>
            <InputField
              name="email"
              placeholder="Email"
              keyboardType="email-address"
              rules={{
                required: "Email is required!",
                pattern: {
                  value: /\b[\w\\.+-]+@[\w\\.-]+\.\w{2,4}\b/,
                  message: "Must be formatted: john.doe@email.com",
                },
              }}
            />
            <Text className="text-sm text-slate-400">
              {"Please enter your email to receive the coupon code"}
            </Text>
          </View>
          <View className="gap-2">
            {data.cart.items.map((v) => (
              <View
                key={v.id}
                className="flex-row items-center justify-between"
              >
                <Text>{v.title}</Text>
                <Text>
                  {formatPrice({
                    amount: v.total,
                    currency_code: "aed",
                  })}
                </Text>
              </View>
            ))}
          </View>
          <View className="flex-row items-center justify-between border-t border-dashed py-4">
            <Text className="text-xl font-semibold">Total</Text>
            <Text className="text-xl font-semibold">
              {formatPrice({
                amount: data.cart.total,
                currency_code: "aed",
              })}
            </Text>
          </View>
          <View className="flex-row items-center justify-between py-4">
            <Button
              className="w-full"
              isLoading={completeCartStatus === "loading"}
              onPress={onSubmit}
            >
              <Text className="text-xl text-white font-semibold">
                {"Pay Now"}
              </Text>
            </Button>
          </View>
        </View>
      </FormProvider>
    </MenuScreenLayout>
  );
};

export default CartScreen;
