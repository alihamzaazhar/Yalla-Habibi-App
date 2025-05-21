import useCreateUser from "@/api/hooks/marketplace/users/mutations/useCreateUser";
import OverlayScreenLayout from "@/components/layouts/OverlayScreenLayout";
import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { InputField } from "@/ui/Form/InputField";
import { Link, useNavigation, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useLayoutEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Text } from "react-native";
import { View } from "react-native";
import PasswordField from "@/ui/molecules/PasswordField";

const SignUp = () => {
  const { mutate, status, error } = useCreateUser();
  const { ...methods } = useForm({
    mode: "onChange",
  });

  const errorMessage = error
    ? error?.response?.data?.message ?? "Something went wrong"
    : null;

  const router = useRouter();
  const onSubmit = methods.handleSubmit(
    ({ first_name, last_name, email, password }) => {
      mutate(
        {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        },
        {
          onSuccess: () => {
            router.replace("/(auth)/sign-in");
          },
        }
      );
    }
  );

  return (
    <OverlayScreenLayout>
      <View className="p-8">
        <Text className="text-4xl font-bold self-center">
          Create an Account
        </Text>
        <View className="mt-8 gap-4">
          <FormProvider {...methods}>
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
              name="password"
              control={methods.control}
              render={({ field, formState }) => (
                <PasswordField
                  errorMessage={formState.errors["password"]?.message as string}
                  placeholder="Password"
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
              isLoading={status === "loading"}
            >
              <Text className="text-primary-foreground font-bold text-xl">
                Sign Up
              </Text>
            </Button>
            <View className="flex-row">
              <Text className="text-muted-foreground">
                Already have an account ?
              </Text>
              <Link href={"/(auth)/sign-in"} asChild>
                <Button variant={"link"} className="px-2 py-0">
                  <Text className="text-primary font-bold">Sign In</Text>
                </Button>
              </Link>
            </View>
          </View>
          {errorMessage && (
            <View className="bg-red-600 px-6 items-center py-4 mt-12 rounded-md flex-row gap-4">
              <AntDesign
                name="warning"
                size={24}
                color={`hsl(${Theme.colors.primary.foreground})`}
              />
              <Text className="text-white text-lg font-bold overflow-scroll flex-1">
                {errorMessage}
              </Text>
            </View>
          )}
        </View>
      </View>
    </OverlayScreenLayout>
  );
};

export default SignUp;
