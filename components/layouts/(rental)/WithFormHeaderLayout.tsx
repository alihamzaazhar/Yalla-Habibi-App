import { Href, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, ViewProps, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { Button } from "@/ui/Button";
import { Theme } from "@/constants";

type Props = {
  title: string;
};

const WithFormHeaderLayout = ({
  children,
  title,
  ...props
}: ViewProps & Props) => {
  const navigation = useNavigation();
  const router = useRouter()
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <SafeAreaView>
          <View className="flex-row pt-2 pr-4 justify-between items-center px-0">
            <View className="p-2">
              {router.canGoBack() && (
                <Button
                  className="rounded-full"
                  variant={"icon"}
                  onPress={() => router.back()}
                >
                  <Entypo
                    name="chevron-left"
                    size={20}
                    color={`hsl(${Theme.gray[800]})`}
                  />
                </Button>
              )}
            </View>
            <Text className="font-medium tracking-wider text-2xl text-gray-800">
              {title}
            </Text>
            <View style={{ width: 32, height: 32 }} />
            
          </View>
        </SafeAreaView>
      ),
    });
  }, []);
  return <View {...props}>{children}</View>;
};

export default WithFormHeaderLayout;
