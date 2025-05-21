import { Button } from "@/ui/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import InputField from "@/ui/molecules/InputField";
import PhoneNumberInputField from "@/ui/molecules/PhoneNumberInputField";
import { Schema } from "@/lib/rental-property/tenant/schema";
import WithFormHeaderLayout from "@/components/layouts/(rental)/WithFormHeaderLayout";
import { useRentalBookingStoreContext } from "@/lib/rental-property/tenant/tenant-store-context";
import PlaceAdLayout from "@/components/layouts/PlaceAdLayout";
import BaseButton from "@/ui/BaseButton";

const TenantBasicDetailsSchema = Schema.pick({
  name: true,
  email: true,
  phone: true,
  address: true,
});

const PropertyBasicDetails = () => {
  const router = useRouter();
  const updateStore = useRentalBookingStoreContext(
    (state) => state.actions.updateData
  );
  const formInstance = useForm<z.infer<typeof TenantBasicDetailsSchema>>({
    mode: "all",
    resolver: zodResolver(TenantBasicDetailsSchema),
  });

  const onSubmit = formInstance.handleSubmit(async (values) => {
    updateStore(values);
    router.navigate("/(rental)/tenant/create/select-space-type");
  });
  console.log(formInstance.formState.errors)
  return (
    <PlaceAdLayout title="Add Tenant" className="relative flex-1">
      <FormProvider {...formInstance}>
        <ScrollView className="mb-4 px-6 pt-8 pb-4 relative flex-1">
          <View className="gap-4">
            <Controller
              name="name"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={formState.errors["name"]?.message as string}
                  placeholder="Tenant Name"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="email"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={formState.errors["email"]?.message as string}
                  placeholder="Tenant Email"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />

            <Controller
              name="phone"
              control={formInstance.control}
              render={({ field, formState }) => (
                <PhoneNumberInputField
                  errorMessage={formState.errors["phone"]?.message as string}
                  value={field.value}
                  onChangePhoneNumber={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="address"
              control={formInstance.control}
              render={({ field, formState }) => (
                <InputField
                  errorMessage={formState.errors["address"]?.message as string}
                  placeholder="Tenant Address"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
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
          >
            <Text className="text-white font-bold text-xl">Next</Text>
          </BaseButton>
        </View>
      </FormProvider>
    </PlaceAdLayout>
  );
};

export default PropertyBasicDetails;
