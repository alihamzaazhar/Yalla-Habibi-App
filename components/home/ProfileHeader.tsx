import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar";
import { Button } from "@/ui/Button";
import { Link } from "expo-router";
import { Skeleton } from "@/ui/Skeleton";
import { useVendorMe } from "@/api/hooks/vendor/me/queries";

interface Props {
  first_name: string;
  last_name: string;
  profile_image?: string;
}

const ProfileHeader = () => {
  const { data: customer, status } = useVendorMe();
  if (status === "loading") return <HeaderSkeleton />;
  if (status === "success" && customer) {
    return (
      <View className="bg-white">
        <SafeAreaView
          className="flex flex-row items-center px-4 pt-8 pb-5 justify-between"
          style={{ marginTop: StatusBar.currentHeight }}
        >
          <HeaderWithCustomer
            first_name={customer.user.first_name}
            last_name={customer.user.last_name}
            profile_image={customer.user.profile_image}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="bg-white">
      <SafeAreaView
        className="flex flex-row items-center px-4 pt-8 pb-5 justify-between"
        style={{ marginTop: StatusBar.currentHeight }}
      >
        <Link asChild href="/(auth)/sign-in">
          <Button
            variant={"ghost"}
            className="flex flex-row items-center gap-3 py-0"
          >
            <Avatar>
              <AvatarImage
                source={require("@/assets/images/empty-avatar.png")}
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Text className="text-xl font-bold">Sign In</Text>
          </Button>
        </Link>
        {/* <Button variant={"icon"}>
          <Feather
            name="bell"
            size={24}
            color={`hsl(${Theme.colors.foreground})`}
          />
        </Button> */}
      </SafeAreaView>
    </View>
  );
};

const HeaderWithCustomer = ({
  first_name,
  last_name,
  profile_image,
}: Props) => {
  return (
    <>
      <Button
        variant={"ghost"}
        className="flex flex-row items-center gap-3 py-0"
      >
        <Avatar>
          {profile_image ? (
            <AvatarImage src={profile_image} alt="@shadcn" />
          ) : (
            <AvatarFallback>{first_name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <Text className="text-xl font-bold capitalize">{first_name}</Text>
      </Button>
      {/* 
      <Button variant={"ghost"}>
        <Feather
          name="bell"
          size={24}
          color={`hsl(${Theme.colors.foreground})`}
        />
      </Button> */}
    </>
  );
};

const HeaderSkeleton = () => {
  return (
    <View className="bg-white">
      <SafeAreaView
        className="flex flex-row items-center px-5 pt-8 pb-5 justify-between"
        style={{ marginTop: StatusBar.currentHeight }}
      >
        <View className="gap-3 flex-row items-center">
          <Skeleton className="rounded-full h-12 w-12" />
          <Skeleton className="rounded-md w-16 h-4" />
        </View>
        {/* <Skeleton className="rounded-md h-8 w-8" /> */}
      </SafeAreaView>
    </View>
  );
};

export default ProfileHeader;
