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
import BaseButton from "@/ui/BaseButton";

const BasicDetails = RentalPropertySchema.pick({
  building_id: true,
  name: true,
  floor_number: true,
  apartment_number: true,
  building: true,
});
type TFieldValues = z.infer<typeof BasicDetails>;
interface Props {
  data?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  onNext?: () => void;
  isUpdating?: boolean;
  mode?: "edit" | "create";
}
const RentalPropertyBasicDetailsForm = (props: Props) => {
  const formInstance = useForm<z.infer<typeof BasicDetails>>({
    mode: "all",
    defaultValues: props.data,
    resolver: zodResolver(BasicDetails),
  });

  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    formInstance.reset(values);
  });
  return (
    <FormProvider {...formInstance}>
      <ScrollView className="mb-4 px-6 pt-4 pb-4 relative flex-1">
        <View className="gap-4">
          <Input value={props.data?.building?.name} readOnly />
          <Controller
            name="name"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["name"]?.message as string}
                placeholder="Name of the property"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="floor_number"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={
                  formState.errors["floor_number"]?.message as string
                }
                placeholder="Floor Number"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="apartment_number"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={
                  formState.errors["apartment_number"]?.message as string
                }
                placeholder="Apartment Number"
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
          isLoading={props.isUpdating || formInstance.formState.isSubmitting}
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

export default RentalPropertyBasicDetailsForm;
