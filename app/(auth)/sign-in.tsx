import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { InputField } from "@/ui/Form/InputField";
import { Link, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { View } from "react-native";
import OverlayScreenLayout from "@/components/layouts/OverlayScreenLayout";
import { useLogin } from "@/api/hooks/marketplace/auth/mutations";
import PasswordField from "@/ui/molecules/PasswordField";
import { ScrollView } from "react-native-gesture-handler";
import BorderlessButton from "@/ui/BorderlessButton";

const SignIn = () => {
  const router = useRouter();
  const { status: logInStatus, mutate: logIn, error } = useLogin();
  const { ...methods } = useForm({
    mode: "onChange",
  });
  const errorMessage = error
    ? error.response?.status === 401
      ? "Email or password is incorrect"
      : "Something went wrong, Please try again."
    : null;

  const onSubmit = methods.handleSubmit(({ email, password }) => {
    logIn(
      { email, password },
      {
        onSuccess: () => {
          router.dismissAll();
        },
      }
    );
    // try {
    //   router.dismissAll();
    // } catch (e) {
    //   const error = e as AxiosError;
    //   setAuthError(
    //     error.response?.status === 401
    //       ? "Email or password is incorrect"
    //       : "Something went wrong, Please try again."
    //   );
    // }
  });
  return (
    <OverlayScreenLayout>
      <ScrollView contentContainerClassName="p-8 gap-8 flex-1">
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
        <View className="gap-6">
          <Text className="text-4xl font-bold self-center">Sign In</Text>
          <View className="gap-4">
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
              <View className="flex-col">
                <Controller
                  name="password"
                  control={methods.control}
                  render={({ field, formState }) => (
                    <PasswordField
                      errorMessage={
                        formState.errors["password"]?.message as string
                      }
                      placeholder="Password"
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <Link href={"/(auth)/forgot-password"} asChild>
                  <BorderlessButton
                    ButtonProps={{ style: { alignSelf: "flex-end" } }}
                    style={{ alignSelf: "flex-end" }}
                  >
                    <Text className="text-primary font-medium text-sm">
                      Forgot Password ?
                    </Text>
                  </BorderlessButton>
                </Link>
              </View>
            </FormProvider>
            <View className="mt-10 items-center gap-4">
              <Button
                onPress={onSubmit}
                isLoading={logInStatus === "loading"}
                className="w-full"
              >
                <Text className="text-primary-foreground font-bold text-xl">
                  Sign In
                </Text>
              </Button>
              <View className="flex-row">
                <Text className="text-muted-foreground">
                  Don't have an account ?
                </Text>
                <Link href={"/(auth)/sign-up"} asChild>
                  <Button variant={"link"} className="px-2 py-0">
                    <Text className="text-primary font-bold">Sign Up</Text>
                  </Button>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </OverlayScreenLayout>
  );
};

export default SignIn;
