import { useVendorMe } from "@/api/hooks/vendor/me/queries";
import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import { Theme } from "@/constants";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import EditProfileForm from "@/components/profile/edit-profile-form";

const ProfileScreen = () => {
  const { data, status } = useVendorMe();
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
    <MenuScreenLayout title="Profile">
      <View className="flex-1 gap-4">
        <EditProfileForm
          data={{
            email: data.user.email,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            phone_number: data.user.phone,
          }}
        />
      </View>
    </MenuScreenLayout>
  );
};

export default ProfileScreen;
