import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Theme } from "@/constants";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import Feather from "@expo/vector-icons/Feather";
import RippleButton from "@/ui/animations/RippleButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import * as Linking from "expo-linking";
import { useVendorRefreshStripe } from "@/api/hooks/vendor/me/mutations";
import LoadingDots from "@/ui/animations/LoadingDots";
import MenuScreenWithEditLayout from "@/components/layouts/MenuScreenWithEditLayout";
import RectButton from "@/ui/RectButton";
import { useRouter } from "expo-router";
import ProfilePicture from "@/components/profile/profile-picture";
import VerifyEmailAlert from "@/components/profile/VerifyEmailAlert";
import { ScrollView } from "react-native-gesture-handler";
import StripeOnboardingAlert from "@/components/profile/StripeOnboardingAlert";

const ProfileScreen = () => {
  const { data, status,  isFetching} = useVendorMe();
  const router = useRouter();
  const { mutate: vendorRefreshStripe, status: refreshStripeStatus } =
    useVendorRefreshStripe();
  if (status === "loading")
    return (
      <MenuScreenLayout title="Profile" className="items-center justify-center">
        <ActivityIndicator size={"large"} color={Theme.gray[600]} />
      </MenuScreenLayout>
    );
  if (status === "error")
    return (
      <MenuScreenLayout title="Profile" className="items-center justify-center">
        <Text>Error...</Text>
      </MenuScreenLayout>
    );
  if (!data)
    return (
      <MenuScreenLayout title="Profile" className="items-center justify-center">
        <Text>No Data...</Text>
      </MenuScreenLayout>
    );

  return (
    <MenuScreenWithEditLayout
      title="Profile"
      onRightIconPress={() => {
        router.navigate("/profile-edit");
      }}
    >
      <ScrollView contentContainerClassName="gap-4 pb-4">
        <View className="flex-col items-center justify-between gap-4 p-6 pb-4">
          <View className="flex-row items-center gap-2">
            <ProfilePicture
              first_name={data.user.first_name}
              profile_image={data.user.profile_image}
            />
          </View>

          <View className="items-center">
            <Text className="text-2xl font-semibold capitalize">
              {data.user.first_name + " " + data.user.last_name}
            </Text>
            <Text className="text-md font-medium text-gray-400">
              {data.user.email}
            </Text>
          </View>
        </View>
        <VerifyEmailAlert className="mx-6" />
        <StripeOnboardingAlert className="mx-6" />
        <View className="px-6 gap-2">
          <Text className="text-muted-foreground px-1.5 font-semibold">
            Details
          </Text>
          <View className="bg-gray-200 rounded-xl overflow-hidden">
            <RectButton
              ButtonProps={{
                style: { backgroundColor: Theme.gray[200] },
              }}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-gray-600 font-medium text-lg">Name</Text>
              <View className="gap-2 flex-row items-center">
                <Text className="text-gray-500 font-medium">
                  {data.user.first_name + " " + data.user.last_name}
                </Text>
              </View>
            </RectButton>
            <RectButton
              ButtonProps={{
                style: { backgroundColor: Theme.gray[200] },
              }}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-gray-600 font-medium text-lg">Email</Text>
              <View className="gap-2 flex-row items-center">
                <View className="flex-row gap-2 items-center">
                  <Text className="text-gray-500 font-medium">
                    {data.user.email}
                  </Text>
                  {data.user.is_email_verified ? (
                    <AntDesign
                      name="checkcircleo"
                      size={15}
                      color={Theme.gray[500]}
                    />
                  ) : null}
                </View>
              </View>
            </RectButton>
            <RectButton
              ButtonProps={{
                style: { backgroundColor: Theme.gray[200] },
              }}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <Text className="text-gray-600 font-medium text-lg">
                Phone Number
              </Text>
              <View className="gap-2 flex-row items-center">
                <Text className="text-gray-500 font-medium">
                  {data.user.phone ?? "Not Provided"}
                </Text>
              </View>
            </RectButton>
          </View>
        </View>
        <View className="px-6 gap-2">
          <Text className="text-muted-foreground px-1.5 font-semibold">
            Vendor
          </Text>
          <View className="bg-gray-200 rounded-xl">
            {!data.user.stripeAccount.account_id ||
            !data.user.stripeAccount.onboardingUrl ? (
              <RippleButton
                rippleClassName="bg-gray-300"
                rippleBorderRadius={8}
                disabled={refreshStripeStatus === "loading"}
                onPress={() =>
                  vendorRefreshStripe({ vendor_account_capability: true })
                }
              >
                <View className="flex-row items-center justify-between px-4 py-4">
                  {refreshStripeStatus === "loading" ? (
                    <View className="self-center">
                      <LoadingDots className="bg-gray-400" />
                    </View>
                  ) : (
                    <>
                      <Text className="text-gray-800 font-medium text-lg">
                        Stripe
                      </Text>
                      <View className="gap-2 flex-row items-center">
                        <Text className="text-gray-500 font-medium">
                          {"Press to refresh"}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </RippleButton>
            ) : (
              <>
                <View className="flex-row items-center justify-between px-4 py-4">
                  <Text className="text-gray-600 font-medium text-lg">
                    Stripe
                  </Text>
                  <View className="gap-2 flex-row items-center">
                    <Text className="text-gray-500 font-medium">
                      {data.user.stripeAccount.account_id
                        ? "Connected"
                        : "Not Connected"}
                    </Text>
                  </View>
                </View>
                <RippleButton
                  rippleClassName="bg-gray-300"
                  rippleBorderRadius={8}
                  onPress={() =>
                    Linking.openURL(data.user.stripeAccount.onboardingUrl!)
                  }
                >
                  <View className="flex-row items-center justify-between px-4 py-4">
                    <Text className="text-gray-600 font-medium  text-lg">
                      Onboarding
                    </Text>
                    <View className="gap-2 flex-row items-center">
                      <Text className="text-gray-500 font-medium">
                        {data.user.stripeAccount.enabled
                          ? "Completed"
                          : "Not Completed"}
                      </Text>
                      <Feather
                        name="external-link"
                        size={18}
                        color={`${Theme.gray[500]}`}
                      />
                    </View>
                  </View>
                </RippleButton>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </MenuScreenWithEditLayout>
  );
};

export default ProfileScreen;
