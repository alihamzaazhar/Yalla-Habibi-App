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
import { RentalPropertySchema } from "../../../../lib/rental-property/property/rental-property-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "@/ui/molecules/InputField";
import { Button } from "@/ui/Button";
import * as z from "zod";
import CurrencyInputField from "@/ui/molecules/CurrencyInputField";
import { ImagePickerField } from "@/ui/Form/ImagePickerField";
import BaseButton from "@/ui/BaseButton";
const BasicDetails = z.object({
  title: z.string(),
  amount: z.number(),
  category_id: z.string(),
  category_name: z.string(),
  attachments: z
    .array(
      z
        .object({
          uri: z.string().optional(),
          url: z.string().optional(),
        })
        .passthrough()
    )
    .optional(),
});

type TFieldValues = z.infer<typeof BasicDetails>;
interface Props {
  data?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  onNext?: () => void;
  isUpdating?: boolean;
  mode?: "edit" | "create";
}
const ExpenseBasicDetailForm = (props: Props) => {
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
          <Input value={props.data?.category_name} readOnly />
          <Controller
            name="title"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["title"]?.message as string}
                placeholder="Title"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Controller
            name="amount"
            control={formInstance.control}
            render={({ field, formState }) => (
              <CurrencyInputField
                errorMessage={formState.errors["amount"]?.message as string}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                prefix="AED "
                placeholder="Amount"
              />
            )}
          />
          <View className="gap-4">
            <Text className="font-bold text-lg">Add Images</Text>
            <ImagePickerField name={"attachments"} className="mt-2" />
          </View>
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

export default ExpenseBasicDetailForm;
