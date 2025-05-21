import React, { useEffect } from "react";
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
import { Schema } from "@/lib/rental-property/tenant/schema";
import InputField from "@/ui/molecules/InputField";
import ServerErrorMessage from "@/ui/atoms/ServerErrorMessage";
import BaseButton from "@/ui/BaseButton";

const TenantSchema = Schema.pick({
  name: true,
  phone: true,
  address: true,
  total_keys: true,
  total_kids: true,
  total_tenants: true,
});
type TFieldValues = z.infer<typeof TenantSchema>;
interface Props {
  data?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  onNext: () => void;
  isUpdating?: boolean;
  errorMessage?: string;
  mode?: "edit" | "create";
}
const AddTenantDetailsForm = ({
  data,
  isUpdating = false,
  mode = "create",
  errorMessage,
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof TenantSchema>>({
    mode: "all",
    defaultValues: data,
    resolver: zodResolver(TenantSchema),
  });
  const { reset } = formInstance;
  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
  });

  useEffect(() => reset(data), [data]);

  return (
    <FormProvider {...formInstance}>
      <ScrollView className="mb-4 px-6 pt-8 pb-4 relative flex-1">
        <ServerErrorMessage errorMessage={errorMessage} />
        <View className="gap-4">
          <Controller
            name="total_keys"
            control={formInstance.control}
            render={({ field, formState, fieldState }) => {
              return (
                <InputField
                  errorMessage={
                    formState.errors["total_keys"]?.message as string
                  }
                  label="Total Keys"
                  placeholder="Total Keys (Optional)"
                  value={
                    field.value !== null && field.value !== undefined
                      ? field.value + ""
                      : undefined
                  }
                  onChangeText={(v) => {
                    const value = parseInt(v) || null;
                    if (value === null) {
                      formInstance.resetField("total_keys");
                    } else {
                      field.onChange(parseInt(v));
                    }
                  }}
                  onBlur={field.onBlur}
                  keyboardType="numeric"
                />
              );
            }}
          />
          <Controller
            name="total_kids"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["total_kids"]?.message as string}
                placeholder="Total Kids (Optional)"
                value={
                  field.value !== null || field.value !== undefined
                    ? field.value + ""
                    : undefined
                }
                label="Total Kids"
                onChangeText={(v) => {
                  const value = parseInt(v) || null;
                  if (value === null) {
                    formInstance.resetField("total_kids");
                  } else {
                    field.onChange(parseInt(v));
                  }
                }}
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
                placeholder="Total Tenants (Optional)"
                label="Total Tenants"
                value={
                  field.value !== null || field.value !== undefined
                    ? field.value + ""
                    : undefined
                }
                onChangeText={(v) => {
                  const value = parseInt(v) || null;
                  if (value === null) {
                    formInstance.resetField("total_tenants");
                  } else {
                    field.onChange(parseInt(v));
                  }
                }}
                onBlur={field.onBlur}
                keyboardType="numeric"
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
            if (formInstance.formState.isDirty) {
              onSubmit();
            } else {
              props.onNext();
            }
          }}
          isLoading={isUpdating}
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

export default AddTenantDetailsForm;
