import { Theme, globalStyles } from "@/constants";
import Input from "@/ui/Input";
import React from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { ScrollView, View, Text } from "react-native";
import { z } from "zod";
import { RentalPropertySchema } from "../../../../lib/rental-property/property/rental-property-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/ui/molecules/InputField";
import { Button } from "@/ui/Button";
import PhoneNumberInputField from "@/ui/molecules/PhoneNumberInputField";
import BaseButton from "@/ui/BaseButton";

const LandlordDetails = RentalPropertySchema.pick({
  landlord_name: true,
  landlord_email: true,
  landlord_phone_number: true,
  landlord_address: true,
});
type TFieldValues = z.infer<typeof LandlordDetails>;
interface Props {
  data?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  onNext?: () => void;
  isUpdating?: boolean;
  mode?: "edit" | "create";
}
const RentalPropertyLandlordDetailsForm = (props: Props) => {
  const formInstance = useForm<TFieldValues>({
    mode: "all",
    defaultValues: props.data,
    resolver: zodResolver(LandlordDetails),
  });

  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    formInstance.reset(values);
  });
  return (
    <FormProvider {...formInstance}>
      <ScrollView className="mb-4 px-6 pt-8 pb-4 relative flex-1">
        <View className="gap-4">
          <Controller
            name="landlord_name"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={
                  formState.errors["landlord_name"]?.message as string
                }
                placeholder="Landlord Name"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            name="landlord_email"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={
                  formState.errors["landlord_email"]?.message as string
                }
                placeholder="Email"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="landlord_phone_number"
            control={formInstance.control}
            render={({ field, formState }) => (
              <PhoneNumberInputField
                errorMessage={
                  formState.errors["landlord_phone_number"]?.message as string
                }
                value={field.value}
                onChangePhoneNumber={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="landlord_address"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={
                  formState.errors["landlord_address"]?.message as string
                }
                placeholder="Address"
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
          onPress={() => {
            if (props.mode === "create") onSubmit();
            else {
              if (formInstance.formState.isDirty) {
                onSubmit();
              } else {
                props.onNext?.();
              }
            }
          }}
          isLoading={props.isUpdating}
        >
          <Text className="text-white font-bold text-xl">
            {props.mode === "edit" && formInstance.formState.isDirty
              ? "Update"
              : "Next"}
          </Text>
        </BaseButton>
      </View>
    </FormProvider>
  );
};

export default RentalPropertyLandlordDetailsForm;
