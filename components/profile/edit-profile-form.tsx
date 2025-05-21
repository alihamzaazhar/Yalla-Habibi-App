import { useVendorMeEdit } from "@/api/hooks/vendor/me/mutations";
import { Theme } from "@/constants";
import PhoneNumber from "@/lib/common/phone-number";
import { Button } from "@/ui/Button";
import { InputField } from "@/ui/Form/InputField";
import PhoneNumberInput from "@/ui/PhoneNumberInput";
import ServerErrorMessage from "@/ui/atoms/ServerErrorMessage";
import AntDesign from "@expo/vector-icons/AntDesign";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import {
  Controller,
  DefaultValues,
  FormProvider,
  useForm,
} from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as z from "zod";

const EditProfileFormSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone_number: z
    .string({ message: "Please enter a valid phone number" })
    .refine(
      (number) => {
        const code = PhoneNumber.getCountryCodeOfNumber(number);
        return PhoneNumber.isValidNumber(number, code);
      },
      { message: "This number doesn't seems to be valid. Please try again" }
    )
    .optional(),
});

type Props = {
  data?: DefaultValues<z.infer<typeof EditProfileFormSchema>>;
};

const EditProfileForm = (props: Props) => {
  const { mutate: vendorMeEdit, status, error } = useVendorMeEdit();
  const { ...methods } = useForm<z.infer<typeof EditProfileFormSchema>>({
    defaultValues: props.data,
    mode: "onChange",
    resolver: zodResolver(EditProfileFormSchema),
  });

  const errorMessage = error
    ? error?.response?.data?.message ?? "Something went wrong"
    : null;

  const router = useRouter();
  const onSubmit = methods.handleSubmit(
    ({ email, first_name, last_name, phone_number }) => {
      vendorMeEdit(
        {
          first_name: first_name,
          last_name: last_name,
          email: email === props.data?.email ? undefined : email,
          phone: phone_number,
        },
        {
          onSuccess: () => {
            router.navigate("/profile");
          },
        }
      );
    }
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1">
        <FormProvider {...methods}>
          <ScrollView className="px-6 py-4 flex-1">
            <View className="gap-4 mb-8">
              <ServerErrorMessage errorMessage={errorMessage} />
              <InputField
                name="first_name"
                placeholder="First Name"
                rules={{
                  required: "First name is required!",
                }}
              />
              <InputField
                name="last_name"
                placeholder="Last Name"
                rules={{
                  required: "Last name is required!",
                }}
              />
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

              <Controller
                name="phone_number"
                control={methods.control}
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
            </View>
          </ScrollView>
          <View className="bottom-0 w-full p-4">
            <Button
              className="w-full"
              onPress={onSubmit}
              isLoading={status === "loading"}
              disabled={!methods.formState.isDirty}
            >
              <Text className="text-white font-bold text-xl">Save</Text>
            </Button>
          </View>
        </FormProvider>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditProfileForm;
