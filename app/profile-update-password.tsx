import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import UpdatePasswordForm from "@/components/profile/update-password-form";
import React from "react";
import { View } from "react-native";


const ProfileUpdatePassword = () => {
  return (
    <MenuScreenLayout title="Profile">
      <View className="flex-1 gap-4">
        <UpdatePasswordForm />
      </View>
    </MenuScreenLayout>
  );
};

export default ProfileUpdatePassword;
