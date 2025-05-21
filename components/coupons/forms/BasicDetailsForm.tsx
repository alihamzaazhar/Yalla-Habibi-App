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
import InputField from "@/ui/molecules/InputField";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ImagePickerField } from "@/ui/Form/ImagePickerField";
import { CouponAdSchema } from "@/lib/coupons/schemas";
import BaseButton from "@/ui/BaseButton";

const CouponAdDetailSchema = CouponAdSchema.pick({
  title: true,
  description: true,
  price: true,
  discount_price: true,
  images: true,
  coupon_code: true,
});
type TFieldValues = z.infer<typeof CouponAdDetailSchema>;
interface Props {
  data?: DefaultValues<TFieldValues>;
  onSubmit: (values: TFieldValues) => Promise<void> | void;
  onNext?: () => void;
  errorMessage?: string;
  hiddenFields?: Array<keyof TFieldValues>;
  mode?: "edit" | "create";
}
const CouponAdDetailsForm = ({
  data,
  mode = "create",
  errorMessage,
  ...props
}: Props) => {
  const formInstance = useForm<z.infer<typeof CouponAdDetailSchema>>({
    mode: "onBlur",
    defaultValues: data,
    resolver: zodResolver(
      CouponAdDetailSchema.omit({
        coupon_code: props.hiddenFields?.includes("coupon_code")
          ? true
          : undefined,
      })
    ),
  });
  const { reset } = formInstance;
  const onSubmit = formInstance.handleSubmit(async (values) => {
    await props.onSubmit(values);
    reset(values);
  });

  return (
    <FormProvider {...formInstance}>
      <ScrollView contentContainerClassName="px-6 pt-6 relative bg-gray-100">
        {errorMessage && (
          <View className="bg-red-600 px-6 items-center py-4 rounded-md my-6 flex-row gap-4 flex-wrap">
            <AntDesign
              name="warning"
              size={24}
              color={`hsl(${Theme.colors.primary.foreground})`}
            />
            <Text className="text-white text-lg font-bold">{errorMessage}</Text>
          </View>
        )}
        <View className="gap-4">
          <Controller
            name="title"
            control={formInstance.control}
            render={({ field, formState }) => (
              <InputField
                errorMessage={formState.errors["title"]?.message as string}
                placeholder="Coupon Title"
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
                placeholder="Coupon Description"
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
          {props.hiddenFields?.includes("coupon_code") ? null : (
            <Controller
              name="coupon_code"
              control={formInstance.control}
              render={({ field, formState }) => (
                <View>
                  <InputField
                    errorMessage={
                      formState.errors["coupon_code"]?.message as string
                    }
                    placeholder="Coupon Code"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                  <Text className="text-sm text-slate-400">
                    {"This code will be sent to the customer through email"}
                  </Text>
                </View>
              )}
            />
          )}
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
          <Controller
            name="discount_price"
            control={formInstance.control}
            render={({ field, formState }) => (
              <CurrencyInputField
                errorMessage={
                  formState.errors["discount_price"]?.message as string
                }
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Compare at price"
              />
            )}
          />

          <View className="gap-4">
            <Text className="font-bold text-lg">Add Images</Text>
            <ImagePickerField name={"images"} />
          </View>
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
            enabled: !formInstance.formState.isSubmitting,
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

export default CouponAdDetailsForm;
