import {
  useUpdateMePassword,
  useVendorMeEdit,
} from "@/api/hooks/vendor/me/mutations";
import { Theme } from "@/constants";
import PhoneNumber from "@/lib/common/phone-number";
import { Button } from "@/ui/Button";
import { InputField } from "@/ui/Form/InputField";
import PhoneNumberInput from "@/ui/PhoneNumberInput";
import PasswordField from "@/ui/molecules/PasswordField";
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

const EditPasswordFormSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      path:['confirmPassword'],
      message: "Passwords do not match",
    }
  );

type Props = {
  data?: DefaultValues<z.infer<typeof EditPasswordFormSchema>>;
};

const UpdatePasswordForm = (props: Props) => {
  const { mutate: vendorMeEdit, status, error } = useUpdateMePassword();
  const { ...methods } = useForm<z.infer<typeof EditPasswordFormSchema>>({
    defaultValues: props.data,
    resolver: zodResolver(EditPasswordFormSchema),
    mode: "onChange",
  });
  const errorMessage =
    methods.formState.errors.root?.message ?? error
      ? error?.response?.data?.message ?? "Something went wrong"
      : null;

  const router = useRouter();
  const onSubmit = methods.handleSubmit(({ confirmPassword, oldPassword }) => {
    vendorMeEdit(
      {
        password: confirmPassword,
        oldPassword: oldPassword,
      },
      {
        onSuccess: () => {
          router.navigate("/profile");
        },
      }
    );
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1">
        <FormProvider {...methods}>
          <ScrollView className="px-6 py-4 flex-1">
            <View className="gap-4 mb-8">
              {errorMessage ? (
                <View className="bg-red-600 px-6 items-center py-4 rounded-md flex-row gap-4">
                  <AntDesign
                    name="warning"
                    size={24}
                    color={`hsl(${Theme.colors.primary.foreground})`}
                  />
                  <Text className="text-white text-lg font-bold overflow-scroll flex-1">
                    {errorMessage}
                  </Text>
                </View>
              ) : null}

              <Controller
                name="oldPassword"
                control={methods.control}
                render={({ field, formState }) => (
                  <PasswordField
                    errorMessage={
                      formState.errors["oldPassword"]?.message as string
                    }
                    placeholder="Old Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />

              <Controller
                name="newPassword"
                control={methods.control}
                render={({ field, formState }) => (
                  <PasswordField
                    errorMessage={
                      formState.errors["newPassword"]?.message as string
                    }
                    placeholder="New Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={methods.control}
                render={({ field, formState }) => (
                  <PasswordField
                    errorMessage={
                      formState.errors["confirmPassword"]?.message as string
                    }
                    placeholder="Confirm Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </View>
          </ScrollView>
          <View className="bottom-0 w-full p-4">
            <Button
              className="w-full"
              onPress={onSubmit}
              isLoading={status === "loading"}
            >
              <Text className="text-white font-bold text-xl">Save</Text>
            </Button>
          </View>
        </FormProvider>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdatePasswordForm;
