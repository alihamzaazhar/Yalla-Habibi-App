import { useVendorMeGenerateOtp } from "@/api/hooks/vendor/me/mutations";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Theme } from "@/constants";
import { addOpacityToHsl } from "@/lib/common/utils";
import BaseButton from "@/ui/BaseButton";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {};

const SuccessScreen = (props: Props) => {
  return (
    <MenuScreenLayout>
      <View className="flex-1 items-center justify-between">
        <View className="p-4">
          <View className="flex-col items-center gap-4 mx-4">
            <Text className="text-3xl text-gray-800 font-semibold">
              Successfully Verified
            </Text>
          </View>
          <Image
            source={require("@/assets/images/email-verified-success.png")}
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
              pathname: "/profile",
              params: {},
            }}
          >
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
            >
              <Text className="font-medium text-white items-center text-lg">
                Continue to Profile
              </Text>
            </BaseButton>
          </Link>
        </View>
      </View>
    </MenuScreenLayout>
  );
};

export default SuccessScreen;
