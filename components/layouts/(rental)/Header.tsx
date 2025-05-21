import { Theme } from "@/constants";
import { Button } from "@/ui/Button";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { Link, LinkProps, useNavigation, useRouter } from "expo-router";
import React, { PropsWithChildren, useLayoutEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";

type Props = {
  title: string;
  iconHref?: LinkProps<string | object>["href"];
};

const Header = ({ title, iconHref }: Props) => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white pt-6">
      <View className="pt-4 pb-2 flex-row justify-between items-center bg-white">
        <View className="p-2">
          <Button
            className="rounded-full"
            variant={"icon"}
            onPress={() => {
              router.navigate("/");
            }}
          >
            <Entypo
              name="chevron-left"
              size={18}
              color={`hsl(${Theme.colors.foreground})`}
            />
          </Button>
        </View>
        <Text className="font-semibold tracking-wider text-2xl">{title}</Text>
        {iconHref ? (
          <View className="p-2">
            <Link href={iconHref} asChild>
              <Button variant={"icon"}>
                <Feather
                  name="plus-circle"
                  size={18}
                  color={`hsl(${Theme.colors.foreground})`}
                />
              </Button>
            </Link>
          </View>
        ) : (
          <View className="w-9 h-9" />
        )}
      </View>
    </SafeAreaView>
  );
};
export const SetHeaderOnScreen = ({
  children,
  ...props
}: PropsWithChildren<Props>) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => <Header {...props} />,
    });
  }, []);
  return <>{children}</>;
};
export default Header;
