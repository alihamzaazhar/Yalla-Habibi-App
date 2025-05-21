import OverlayScreenLayout from "@/components/layouts/OverlayScreenLayout";
import { Button } from "@/ui/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native";
import PasswordField from "@/ui/molecules/PasswordField";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendForgotPasswordOtp } from "@/api/hooks/auth/mutations";
import ServerErrorMessage from "@/ui/atoms/ServerErrorMessage";

const EditPasswordFormSchema = z
  .object({
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
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );
const UpdatePassword = () => {
  const { ...methods } = useForm<z.infer<typeof EditPasswordFormSchema>>({
    resolver: zodResolver(EditPasswordFormSchema),
    mode: "onChange",
  });
  const {
    error,
    mutate: sendForgotPasswordOtp,
    status: sendForgotPasswordOtpStatus,
  } = useSendForgotPasswordOtp();
  const searchParams = useLocalSearchParams();
  const email = searchParams.email as string;
  const router = useRouter();
  const errorMessage = error
    ? typeof error?.response?.data?.message === "string"
      ? error?.response?.data?.message
      : "Something went wrong, Please try again."
    : null;

  const onSubmit = methods.handleSubmit(({ newPassword, confirmPassword }) => {
    sendForgotPasswordOtp(
      {
        email: email as string,
      },
      {
        onSuccess: ({ token }) => {
          router.navigate({
            pathname: "/(auth)/forgot-password/verify-otp",
            params: {
              email: email as string,
              token: token,
              password: newPassword,
            },
          });
        },
      }
    );
  });

  return (
    <OverlayScreenLayout>
      <View className="p-8">
        <ServerErrorMessage errorMessage={errorMessage} />
        <Text className="text-3xl font-bold self-center mt-4">
          Update your password
        </Text>

        <View className="mt-8 gap-4">
          <FormProvider {...methods}>
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
          </FormProvider>
          <View className="mt-10 items-center gap-4">
            <Button
              onPress={onSubmit}
              className="w-full"
              isLoading={sendForgotPasswordOtpStatus === "loading"}
            >
              <Text className="text-primary-foreground font-bold text-xl">
                Next
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </OverlayScreenLayout>
  );
};

export default UpdatePassword;
