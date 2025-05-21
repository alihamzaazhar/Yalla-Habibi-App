import { Button } from "@/ui/Button";
import { ImagePickerField } from "@/ui/Form/ImagePickerField";
import { InputField } from "@/ui/Form/InputField";
import React from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateKeysObjectForObject } from "@/lib/common/utils";
import { ScrollView } from "react-native-gesture-handler";
import { Theme, globalStyles } from "@/constants";
import PhoneNumberInput from "@/ui/PhoneNumberInput";
import {
  PROPERTY_SALE_TYPE_ENUM,
  PropertyAd1Schema,
} from "@/lib/property-ad/schemas";
import CurrencyInputField from "@/ui/molecules/CurrencyInputField";
import DateInputField from "@/ui/molecules/DateInputField";
import BaseButton from "@/ui/BaseButton";

const PropertyAdFirstScreenSchemaKeys = generateKeysObjectForObject(
  PropertyAd1Schema.shape
);
type TFieldValues = z.infer<typeof PropertyAd1Schema>;
interface Props {
  selling_mode?: (typeof PROPERTY_SALE_TYPE_ENUM)[number];
  initialData?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  onNext?: () => void;
  mode?: "edit" | "create";
}
const PropertyDetailForm = ({
  initialData,
  selling_mode,
  mode = "create",
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof PropertyAd1Schema>>({
    mode: "onBlur",
    defaultValues: initialData,
    resolver: zodResolver(PropertyAd1Schema),
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
          <InputField
            name={PropertyAdFirstScreenSchemaKeys["title"]}
            placeholder="Title for your ad"
          />
          <InputField
            name={PropertyAdFirstScreenSchemaKeys["description"]}
            multiline
            textAlignVertical="top"
            style={{ paddingTop: 8 }}
            numberOfLines={8}
            placeholder="Description"
          />
          {selling_mode !== "rent" ? (
            <Controller
              name="ready_at"
              control={formInstance.control}
              render={({ field }) => (
                <DateInputField
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Ready Date"
                />
              )}
            />
          ) : null}
          <Controller
            name="price"
            control={formInstance.control}
            render={({ field, formState }) => (
              <CurrencyInputField
                errorMessage={formState.errors["price"]?.message as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Price"
              />
            )}
          />
          {/* Convert the name currencyInputField to AmountInputField */}
          <Controller
            name="area"
            control={formInstance.control}
            render={({ field, formState }) => (
              <CurrencyInputField
                errorMessage={formState.errors["area"]?.message as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Area"
                prefix="SqFt"
                decimal_digits={0}
              />
            )}
          />
          <Controller
            name="phone_number"
            control={formInstance.control}
            render={({ field, formState }) => (
              <View>
                <PhoneNumberInput
                  initialValue={field.value}
                  onChangePhoneNumber={(v) => {
                    field.onChange(v);
                  }}
                  textProps={{ onBlur: field.onBlur }}
                />
                {Boolean(formState.errors["phone_number"]) ? (
                  <Text className="text-red-600 text-sm">
                    {formState.errors["phone_number"]?.message as string}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <ImagePickerField name={PropertyAdFirstScreenSchemaKeys["images"]} />
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

export default PropertyDetailForm;
