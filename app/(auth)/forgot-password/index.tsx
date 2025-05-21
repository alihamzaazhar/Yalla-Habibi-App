import OverlayScreenLayout from "@/components/layouts/OverlayScreenLayout";
import { InputField } from "@/ui/Form/InputField";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native";
import BaseButton from "@/ui/BaseButton";

const ForgotPasswordScreen = () => {
  const { ...methods } = useForm({
    mode: "onChange",
  });

  const router = useRouter();
  const onSubmit = methods.handleSubmit(({ email }) => {
    router.navigate({
      pathname: "/(auth)/forgot-password/update-password",
      params: {
        email: email,
      },
    });
  });

  return (
    <OverlayScreenLayout>
      <View className="p-8">
        <Text className="text-3xl font-bold self-center mt-4">
          Forgot your password?
        </Text>
        <View className="mt-8 gap-4">
          <FormProvider {...methods}>
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
          </FormProvider>
          <View className="mt-10 items-center gap-4">
            <BaseButton
              className="bg-primary items-center w-full"
              disabled={!methods.formState.isValid}
              ButtonProps={{
                style: {
                  width: "100%",
                },
              }}
              onPress={onSubmit}
            >
              <Text className="text-white font-bold text-xl">Next</Text>
            </BaseButton>
          </View>
        </View>
      </View>
    </OverlayScreenLayout>
  );
};

export default ForgotPasswordScreen;
