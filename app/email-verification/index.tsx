import { useVendorMeGenerateOtp } from "@/api/hooks/vendor/me/mutations";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Theme } from "@/constants";
import { addOpacityToHsl } from "@/lib/common/utils";
import BaseButton from "@/ui/BaseButton";
import { Link, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

type Props = {};

const EmailVerification = (props: Props) => {
  const { data, status } = useVendorMe();
  const router = useRouter();
  const { mutate: generateOtpMutate, status: generateOtpStatus } =
    useVendorMeGenerateOtp();
  if (status === "loading")
    return <ActivityIndicator size={"large"} color={Theme.gray[600]} />;
  if (status === "error") return <Text>Something went wrong</Text>;

  return (
    <MenuScreenLayout>
      <View className="flex-1 items-center justify-between">
        <View className="p-4">
          <View className="flex-col items-center gap-4 mx-4">
            <Text className="text-3xl text-gray-800 font-semibold">
              Email Verification
            </Text>
            <Text className="font-medium text-gray-500 text-center mx-4">
              We will be sending you an OTP to verify your email address.
            </Text>
          </View>
          <Image
            source={require("@/assets/images/otp-verifcation.png")}
            style={{
              width: "100%",
              aspectRatio: 1,
            }}
          />
        </View>
        <View className="gap-4 w-full mx-4 p-8">
          <Link
            asChild
            href={{
              pathname: "/",
              params: {},
            }}
          >
            <BaseButton
              variant={"outline"}
              className="border border-primary px-4 py-2 h-14 w-full items-center"
              loadingClassName="bg-primary"
              ButtonProps={{
                style: {
                  alignItems: "center",
                },
                rippleColor: addOpacityToHsl(Theme.colors.primary.DEFAULT, 0.5),
              }}
            >
              <Text className="font-medium text-primary items-center text-lg">
                Maybe Later
              </Text>
            </BaseButton>
          </Link>

          <BaseButton
            variant={"outline"}
            className="bg-primary px-4 py-2 h-14 w-full items-center"
            loadingClassName="bg-primary"
            ButtonProps={{
              style: {
                alignItems: "center",
              },
              rippleColor: addOpacityToHsl(Theme.colors.primary.DEFAULT, 0.5),
            }}
            onPress={() => {
              generateOtpMutate(undefined, {
                onSuccess: ({token}) => {
                  router.navigate({
                    pathname: "/email-verification/get-otp",
                    params: {
                      email: data?.user.email,
                      token: token,
                    },
                  });
                },
              });
            }}
            disabled={generateOtpStatus === "loading"}
            isLoading={generateOtpStatus === "loading"}
          >
            <Text className="font-medium text-white items-center text-lg">
              Send OTP To Email
            </Text>
          </BaseButton>
        </View>
      </View>
    </MenuScreenLayout>
  );
};

export default EmailVerification;
