import React from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import CurrencyInputField from "@/ui/molecules/CurrencyInputField";
import { MotorAdInputSchema } from "@/lib/motors-ad/schema";
import InputField from "@/ui/molecules/InputField";
import PhoneNumberInputField from "@/ui/molecules/PhoneNumberInputField";
import { RadioButton } from "@/ui/RadioButton";
import BaseButton from "@/ui/BaseButton";

const MotorAdBasicDetailSchema = MotorAdInputSchema.pick({
  title: true,
  description: true,
  price: true,
  year: true,
  kilometer: true,
  phone_number: true,
  has_insurance: true,
});
type TFieldValues = z.infer<typeof MotorAdBasicDetailSchema>;
interface Props {
  initalData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  onNext?: () => void;
  mode: "edit" | "create";
}
const MotorAdDetailsForm = ({
  initalData,
  mode = "create",
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof MotorAdBasicDetailSchema>>({
    mode: "onBlur",
    defaultValues: initalData,
    resolver: zodResolver(MotorAdBasicDetailSchema),
  });
  const { reset } = formInstance;
  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    reset(values);
  });

  return (
    <FormProvider {...formInstance}>
      <ScrollView contentContainerClassName="px-6 pt-6 relative bg-gray-100">
        <View className="gap-4">
          <Controller
            name="title"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["title"]?.message as string}
                placeholder="Title for your ad"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="description"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["title"]?.message as string}
                placeholder="Description"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                multiline
                textAlignVertical="top"
                style={{ paddingTop: 8 }}
                numberOfLines={8}
              />
            )}
          />

          <Controller
            name="year"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["year"]?.message as string}
                placeholder="Year"
                value={field.value ? field.value + "" : undefined}
                onChangeText={(v) => field.onChange(parseInt(v))}
                onBlur={field.onBlur}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            name="kilometer"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["kilometer"]?.message as string}
                placeholder="Kilometer"
                value={field.value ? field.value + "" : undefined}
                onChangeText={(v) => field.onChange(parseInt(v))}
                onBlur={field.onBlur}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            name="price"
            control={formInstance.control}
            render={({ field, formState }) => (
              <CurrencyInputField
                errorMessage={formState.errors["price"]?.message as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="AED 000"
              />
            )}
          />
          <Controller
            name="phone_number"
            control={formInstance.control}
            render={({ field, formState }) => (
              <PhoneNumberInputField
                errorMessage={
                  formState.errors["phone_number"]?.message as string
                }
                value={field.value}
                onChangePhoneNumber={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            name="has_insurance"
            control={formInstance.control}
            render={({ field, formState }) => (
              <View className="gap-1.5">
                <Text className="text-lg font-bold">Car Insured By UAE ?</Text>
                <View>
                  <RadioButton
                    isChecked={
                      typeof field.value === "boolean" && field.value
                        ? true
                        : false
                    }
                    setChecked={(checked) => checked && field.onChange(true)}
                    label="Yes"
                  />
                  <RadioButton
                    isChecked={
                      !(typeof field.value === "boolean" && field.value)
                    }
                    setChecked={(checked) => checked && field.onChange(false)}
                    label="No"
                  />
                </View>
                {formState.errors["has_insurance"]?.message && (
                  <Text className="text-red-600 text-sm">
                    {formState.errors["has_insurance"]?.message}
                  </Text>
                )}
              </View>
            )}
          />
          {/* Placeholder due to floating button */}
          <View className="h-32" />
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
            if (mode === "create") return onSubmit();
            else {
              if (formInstance.formState.isDirty) onSubmit();
              else props.onNext?.();
            }
          }}
          isLoading={formInstance.formState.isSubmitting}
        >
          <Text className="text-white font-bold text-xl">
            {mode === "edit" && formInstance.formState.isDirty
              ? "Update"
              : "Next"}
          </Text>
        </BaseButton>
      </View>
    </FormProvider>
  );
};

export default MotorAdDetailsForm;
