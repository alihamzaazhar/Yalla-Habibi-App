import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import { Theme } from "@/constants";
import { cn } from "@/lib/common/utils";
import BaseButton from "@/ui/BaseButton";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";

type Props = {
  className?: string;
};

const StripeOnboardingAlert = (props: Props) => {
  const { data, status } = useVendorMe();
  if (status === "loading") return null;
  if (status === "error") return null;
  if (!data) return null;
  if (data.user.stripeAccount.enabled) return null;
  return (
    <View
      className={cn(
        "bg-orange-100 px-6 py-4 border-l-2 border-orange-600 flex-col gap-4",
        props.className
      )}
    >
      <View className="flex-row items-center flex-wrap gap-2">
        <AntDesign name="warning" size={18} color={Theme.orange[600]} />
        <Text className="text-gray-600 font-semibold flex-wrap flex-1 text-start">
          {"Complete the stripe onboarding to place coupon ads"}
        </Text>
      </View>
      <View>
        <BaseButton
          variant={"outline"}
          className="border border-orange-600 px-4 py-2 h-10"
          loadingClassName="bg-orange-600"
          ButtonProps={{
            style: {
              alignSelf: "flex-start",
            },
            rippleColor: Theme.orange[200],
          }}
          onPress={() =>
            Linking.openURL(data.user.stripeAccount.onboardingUrl!)
          }
        >
          <Text className="font-medium text-orange-600">
            Open Stripe Dashboard
          </Text>
        </BaseButton>
      </View>
    </View>
  );
};

export default StripeOnboardingAlert;
