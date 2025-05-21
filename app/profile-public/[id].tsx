import MenuScreenLayout from "@/components/layouts/MenuScreenLayout";
import React from "react";
import { View, Text } from "react-native";
import { Avatar, AvatarFallback } from "@/ui/Avatar";
import { useGetUser } from "@/api/hooks/marketplace/users/queries";
import { useLocalSearchParams } from "expo-router";
import VendorAdsList from "@/components/profile/VendorAdsList";
import LoadingDefault from "@/components/shared/templates/LoadingDefault";
import Error from "@/components/shared/templates/Error";
import { ScrollOffsetProvider } from "@/contexts/ScrollOffsetProvider";

const PublicProfileScreen = () => {
  const params = useLocalSearchParams();
  const { data, status } = useGetUser(params.id as string);
  if (status === "loading")
    return (
      <MenuScreenLayout title="Profile">
        <LoadingDefault />
      </MenuScreenLayout>
    );
  if (status === "error")
    return (
      <MenuScreenLayout title="Profile">
        <Error />
      </MenuScreenLayout>
    );
  if (!data)
    return (
      <MenuScreenLayout title="Profile">
        <Text>No Data</Text>
      </MenuScreenLayout>
    );

  return (
    <ScrollOffsetProvider>
      <MenuScreenLayout title="Profile">
        <View className="flex-col items-center justify-between gap-4 p-6 pb-4">
          <View className="flex-row items-center gap-2">
            <Avatar style={{ width: 80, height: 80 }}>
              <AvatarFallback
                textClassname="text-2xl"
                className="border border-border"
              >
                {data.customerAccount.first_name?.charAt(0).toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-semibold capitalize">
              {data.customerAccount.first_name +
                " " +
                data.customerAccount.last_name}
            </Text>
            <Text className="text-md font-medium text-gray-400">
              {data.customerAccount.email}
            </Text>
          </View>
        </View>
        <VendorAdsList vendor_id={params.id as string} />
      </MenuScreenLayout>
    </ScrollOffsetProvider>
  );
};

export default PublicProfileScreen;
