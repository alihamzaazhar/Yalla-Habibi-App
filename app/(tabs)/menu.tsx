import { useLogout } from "@/api/hooks/marketplace/auth/mutations";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import RectButton from "@/ui/RectButton";
import TenantQuickView from "@/components/(rentals)/TenantQuickView";
import { useGetMyBookings } from "@/api/hooks/vendor/me/queries";
import Ionicons from "@expo/vector-icons/Ionicons";

const MenuScreen = () => {
  const { mutate, status } = useLogout();
  const router = useRouter();
  const { status: bookingStatus } = useGetMyBookings({
    is_active: true,
  });
  //Just to avoid layout shift
  if (bookingStatus === "loading") {
    return (
      <MenuScreenLayout title="Menu">
        <View className="flex-1 items-center" style={{ paddingTop: 200 }}>
          <ActivityIndicator size={40} color={Theme.gray[600]} />
        </View>
      </MenuScreenLayout>
    );
  }

  return (
    <MenuScreenLayout title="Menu">
      <TenantQuickView />
      <View className="py-4">
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() => router.navigate("/profile")}
        >
          <FontAwesome6
            name="user"
            size={20}
            color={`hsl(${Theme.colors.muted.foreground})`}
          />
          <Text className="text-muted-foreground text-xl font-medium">
            {"Profile"}
          </Text>
        </RectButton>
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() => router.navigate("/(menu)/favourites")}
        >
          <AntDesign
            name="hearto"
            size={20}
            color={`hsl(${Theme.colors.muted.foreground})`}
          />
          <Text className="text-muted-foreground text-xl font-medium">
            {"Favourites"}
          </Text>
        </RectButton>
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() => router.navigate("/profile-update-password")}
        >
          <AntDesign
            name="lock"
            size={20}
            color={`hsl(${Theme.colors.muted.foreground})`}
          />
          <Text className="text-muted-foreground text-xl font-medium">
            {"Update Password"}
          </Text>
        </RectButton>
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() => router.navigate("/(legal)/privacy-policy")}
        >
          <AntDesign
            name="filetext1"
            size={20}
            color={`hsl(${Theme.colors.muted.foreground})`}
          />
          <Text className="text-muted-foreground text-xl font-medium">
            {"Privacy Policy"}
          </Text>
        </RectButton>
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() => router.navigate("/(legal)/terms-of-use")}
        >
          <Ionicons
            name="document-text-outline"
            size={20}
            color={`hsl(${Theme.colors.muted.foreground})`}
          />
          <Text className="text-muted-foreground text-xl font-medium">
            {"Terms of Use"}
          </Text>
        </RectButton>
        <RectButton
          className="flex flex-row w-full items-start justify-start gap-4 p-6 border-b border-gray-200"
          onPress={() =>
            mutate(undefined, {
              onSuccess: () => {
                router.navigate("/(tabs)");
              },
            })
          }
          ButtonProps={{
            enabled: status !== "loading",
          }}
        >
          {status === "loading" ? (
            <ActivityIndicator size={24} color={Theme.gray[600]} />
          ) : (
            <MaterialIcons
              name="logout"
              size={24}
              color={`hsl(${Theme.colors.muted.foreground})`}
            />
          )}
          <Text className="text-muted-foreground text-xl font-medium">
            {"Logout"}
          </Text>
        </RectButton>
      </View>
    </MenuScreenLayout>
  );
};

export default MenuScreen;
