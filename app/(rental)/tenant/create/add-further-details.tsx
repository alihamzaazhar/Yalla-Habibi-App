import { Button } from "@/ui/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import InputField from "@/ui/molecules/InputField";
import { Schema } from "@/lib/rental-property/tenant/schema";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import { useCreateRentalTenant } from "@/api/hooks/rental-properties/mutations";
import CurrencyInputField from "@/ui/molecules/CurrencyInputField";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateInputField from "@/ui/molecules/DateInputField";
import { useRentalBookingStoreContext } from "@/lib/rental-property/tenant/tenant-store-context";
import BaseButton from "@/ui/BaseButton";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";

const TenantFurtherDetailsSchema = Schema.pick({
  total_keys: true,
  total_kids: true,
  total_tenants: true,
  unit_price: true,
  deposit: true,
  contract_starts_at: true,
});
const RentalTenantFurtherDetails = () => {
  const router = useRouter();
  const store = useRentalBookingStoreContext((state) => state.data);
  const params = useLocalSearchParams();
  const {
    error,
    mutate: createRentalTenant,
    status: createTenantStatus,
  } = useCreateRentalTenant();
  const variantId = params.variantId as string;
  const variantPrice = params.variantPrice as string;
  const formInstance = useForm<z.infer<typeof TenantFurtherDetailsSchema>>({
    mode: "all",
    defaultValues: {
      unit_price: parseInt(variantPrice),
    },
    resolver: zodResolver(TenantFurtherDetailsSchema),
  });
  const onSubmit = formInstance.handleSubmit(async (values) => {
    if (!store) return;

    createRentalTenant(
      {
        variant_id: variantId,
        unit_price: values.unit_price,
        //[Todo]: Find a way to remove this casting
        tenant: {
          name: store.name!,
          email: store.email!,
          phone: store.phone!,
          address: store.address!,
        },
        keys_count: values.total_keys,
        tenants_count: values.total_tenants,
        kids_count: values.total_kids,
        contract_starts_at: values.contract_starts_at,
        deposit: values.deposit,
      },
      {
        onSuccess: () => {
          router.navigate("/(rental)/tenant");
        },
        onError: (error) => {
          let errorMessage = error
            ? error?.response?.data?.message ?? "Something went wrong"
            : null;
          if (errorMessage.includes("Customer")) {
            errorMessage =
              "There is no customer with this email or phone number. Kindly verify the tenant details and try again.";
          }
          Alert.alert("Error", errorMessage);
        },
      }
    );
  });

  return (
    <PlaceAdLayout title="Add Tenant" className="relative flex-1">
      <FormProvider {...formInstance}>
        <ScrollView className="mb-4 px-6 pt-8 pb-4 relative flex-1">
          <View className="gap-4">
            <Controller
              name="unit_price"
              control={formInstance.control}
              render={({ field, formState }) => (
                <CurrencyInputField
                  errorMessage={
                    formState.errors["unit_price"]?.message as string
                  }
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Unit Price"
                />
              )}
            />
            <Controller
              name="deposit"
              control={formInstance.control}
              render={({ field, formState }) => (
                <CurrencyInputField
                  errorMessage={formState.errors["deposit"]?.message as string}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Deposit"
                />
              )}
            />
            <Controller
              name="total_keys"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={
                    formState.errors["total_keys"]?.message as string
                  }
                  placeholder="Total Keys (Optional)"
                  //@ts-ignore
                  value={field.value}
                  onChangeText={(v) => field.onChange(parseInt(v))}
                  onBlur={field.onBlur}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              name="total_kids"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={
                    formState.errors["total_kids"]?.message as string
                  }
                  placeholder="Total Kids"
                  //@ts-ignore
                  value={field.value}
                  onChangeText={(v) => field.onChange(parseInt(v))}
                  onBlur={field.onBlur}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              name="total_tenants"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={
                    formState.errors["total_tenants"]?.message as string
                  }
                  placeholder="Total Tenants"
                  //@ts-ignore
                  value={field.value}
                  onChangeText={(v) => field.onChange(parseInt(v))}
                  onBlur={field.onBlur}
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              name="contract_starts_at"
              control={formInstance.control}
              render={({ field }) => (
                <DateInputField
                  placeholder="Contract Starts At"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {/* Placeholder due to floating button */}
            <View className="h-40" />
          </View>
        </ScrollView>
        <View
          className="absolute bottom-0 p-6 w-full bg-white"
          style={globalStyles.shadowMd}
        >
          <BaseButton
            ButtonProps={{
              style: {
                width: "100%",
                backgroundColor: Theme.primary.DEFAULT,
              },
            }}
            className="w-full"
            variant={"default"}
            onPress={onSubmit}
            isLoading={createTenantStatus === "loading"}
          >
            <Text className="text-white font-bold text-xl">Next</Text>
          </BaseButton>
        </View>
      </FormProvider>
    </PlaceAdLayout>
  );
};

export default RentalTenantFurtherDetails;
